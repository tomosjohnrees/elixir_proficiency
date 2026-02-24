"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  topicGraph,
  categoryMeta,
  categoryOrder,
  getTopicBySlug,
} from "@/data/courses/elixir/topic-relationships";
import type { TopicCategory } from "@/lib/types";

const SVG_W = 1000;
const SVG_H = 900;
const NODE_W = 134;
const NODE_H = 36;

const shortTitles: Record<string, string> = {
  "basic-data-types": "Data Types",
  "pattern-matching": "Pattern Match",
  "control-flow": "Control Flow",
  "functions-and-modules": "Funcs & Mods",
  recursion: "Recursion",
  "guards-in-depth": "Guards",
  "lists-and-tuples": "Lists & Tuples",
  "maps-and-structs": "Maps & Structs",
  "strings-in-depth": "Strings",
  enumerables: "Enums & Streams",
  comprehensions: "Comprehensions",
  sigils: "Sigils & Regex",
  processes: "Processes",
  genserver: "GenServer",
  supervisors: "Supervisors",
  "mix-and-otp": "Mix & OTP",
  "concurrency-patterns": "Concurrency",
  ets: "ETS",
  protocols: "Protocols",
  behaviours: "Behaviours",
  macros: "Macros",
  "error-handling": "Error Handling",
  testing: "Testing",
  "ecto-basics": "Ecto",
  "phoenix-basics": "Phoenix",
  liveview: "LiveView",
  deployment: "Deployment",
  "typespecs-and-dialyzer": "Typespecs",
  "debugging-and-tooling": "Debugging",
  "idiomatic-elixir": "Idiomatic Elixir",
};

interface LaneInfo {
  category: TopicCategory;
  label: string;
  color: string;
  x: number;
  width: number;
  centerX: number;
}

function computeLanes(): LaneInfo[] {
  const laneWidth = SVG_W / categoryOrder.length;
  return categoryOrder.map((cat, i) => ({
    category: cat,
    label: categoryMeta[cat].label,
    color: categoryMeta[cat].color,
    x: i * laneWidth,
    width: laneWidth,
    centerX: i * laneWidth + laneWidth / 2,
  }));
}

function computeEdgePath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): string {
  const sameLane = Math.abs(fromX - toX) < NODE_W;

  if (sameLane) {
    const midY = (fromY + toY) / 2;
    const curveX = 25;
    return `M ${fromX} ${fromY + NODE_H / 2} C ${fromX + curveX} ${midY}, ${toX + curveX} ${midY}, ${toX} ${toY - NODE_H / 2}`;
  }

  const startX = fromX + NODE_W / 2;
  const startY = fromY;
  const endX = toX - NODE_W / 2;
  const endY = toY;
  const cpOffset = (endX - startX) * 0.4;

  return `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;
}

const springSnappy = { type: "spring" as const, stiffness: 400, damping: 25 };
const springGentle = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function ConceptMapSVG({ courseSlug }: { courseSlug: string }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const router = useRouter();

  const lanes = useMemo(computeLanes, []);

  const nodePositions = useMemo(() => {
    const positions: Record<string, { px: number; py: number }> = {};
    topicGraph.nodes.forEach((node) => {
      positions[node.slug] = {
        px: node.x * SVG_W,
        py: node.y * SVG_H + 30,
      };
    });
    return positions;
  }, []);

  const connectedSlugs = useMemo(() => {
    if (!hoveredSlug) return null;
    const set = new Set<string>([hoveredSlug]);
    topicGraph.edges.forEach((e) => {
      if (e.from === hoveredSlug) set.add(e.to);
      if (e.to === hoveredSlug) set.add(e.from);
    });
    return set;
  }, [hoveredSlug]);

  const connectedEdges = useMemo(() => {
    if (!hoveredSlug) return null;
    return new Set(
      topicGraph.edges
        .filter((e) => e.from === hoveredSlug || e.to === hoveredSlug)
        .map((e) => `${e.from}->${e.to}`)
    );
  }, [hoveredSlug]);

  const handleNodeClick = useCallback(
    (slug: string) => {
      router.push(`/${courseSlug}/topics/${slug}`);
    },
    [router]
  );

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Concept map showing relationships between Elixir topics"
      onMouseLeave={() => setHoveredSlug(null)}
    >
      <defs>
        {/* Arrow markers */}
        <marker
          id="arrow"
          viewBox="0 0 10 6"
          refX="10"
          refY="3"
          markerWidth="7"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 3 L 0 6 z" fill="var(--muted)" />
        </marker>
        {categoryOrder.map((cat) => (
          <marker
            key={cat}
            id={`arrow-${cat}`}
            viewBox="0 0 10 6"
            refX="10"
            refY="3"
            markerWidth="7"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 3 L 0 6 z"
              fill={categoryMeta[cat].color}
            />
          </marker>
        ))}

        {/* Glow filters per category */}
        {categoryOrder.map((cat) => (
          <filter
            key={`glow-${cat}`}
            id={`glow-${cat}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
            <feFlood
              floodColor={categoryMeta[cat].color}
              floodOpacity="0.3"
              result="color"
            />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {/* Category lane backgrounds */}
      {lanes.map((lane, i) => (
        <motion.rect
          key={lane.category}
          x={lane.x + 4}
          y={24}
          width={lane.width - 8}
          height={SVG_H - 32}
          rx={12}
          fill={lane.color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: i * 0.06, duration: 0.5 }}
        />
      ))}

      {/* Category labels */}
      {lanes.map((lane, i) => (
        <motion.text
          key={`label-${lane.category}`}
          x={lane.centerX}
          y={16}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={lane.color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: i * 0.06 + 0.1, duration: 0.3 }}
        >
          {lane.label}
        </motion.text>
      ))}

      {/* Edges */}
      {topicGraph.edges.map((edge) => {
        const from = nodePositions[edge.from];
        const to = nodePositions[edge.to];
        if (!from || !to) return null;

        const edgeKey = `${edge.from}->${edge.to}`;
        const isActive = connectedEdges?.has(edgeKey);
        const fromNode = topicGraph.nodes.find(
          (n) => n.slug === edge.from
        );
        const catColor = fromNode
          ? categoryMeta[fromNode.category].color
          : "var(--muted)";

        const dimmed = hoveredSlug && !isActive;

        return (
          <motion.path
            key={edgeKey}
            d={computeEdgePath(from.px, from.py, to.px, to.py)}
            fill="none"
            stroke={isActive ? catColor : "var(--muted)"}
            strokeDasharray={
              isActive
                ? "8 4"
                : edge.strength === "moderate"
                  ? "5 3"
                  : undefined
            }
            markerEnd={`url(#arrow${isActive ? `-${fromNode?.category}` : ""})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: dimmed ? 0.04 : isActive ? 0.85 : 0.18,
              strokeWidth: isActive
                ? edge.strength === "strong"
                  ? 2.8
                  : 2.2
                : edge.strength === "strong"
                  ? 1.8
                  : 1.2,
              strokeDashoffset: isActive ? [0, -24] : 0,
            }}
            transition={{
              pathLength: { delay: 0.4, duration: 0.7, ease: "easeOut" },
              opacity: springGentle,
              strokeWidth: springSnappy,
              strokeDashoffset: isActive
                ? { duration: 1.2, ease: "linear", repeat: Infinity }
                : { duration: 0 },
            }}
          />
        );
      })}

      {/* Nodes */}
      {topicGraph.nodes.map((node, i) => {
        const pos = nodePositions[node.slug];
        if (!pos) return null;

        const topic = getTopicBySlug(node.slug);
        if (!topic) return null;

        const catColor = categoryMeta[node.category].color;
        const isHovered = hoveredSlug === node.slug;
        const isConnected = !hoveredSlug || connectedSlugs?.has(node.slug);
        const dimmed = hoveredSlug && !isConnected;
        const title = shortTitles[node.slug] || topic.title;

        return (
          <motion.g
            key={node.slug}
            onMouseEnter={() => setHoveredSlug(node.slug)}
            onClick={() => handleNodeClick(node.slug)}
            style={{
              cursor: "pointer",
              transformOrigin: `${pos.px}px ${pos.py}px`,
            }}
            filter={isHovered ? `url(#glow-${node.category})` : undefined}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: dimmed ? 0.15 : 1,
              y: 0,
              scale: isHovered
                ? 1.1
                : isConnected && hoveredSlug
                  ? 1.03
                  : dimmed
                    ? 0.96
                    : 1,
            }}
            transition={{
              opacity: { duration: 0.2 },
              y: {
                delay: 0.1 + i * 0.02,
                duration: 0.4,
                ease: "easeOut",
              },
              scale: { type: "spring", stiffness: 500, damping: 22 },
            }}
          >
            <title>
              {topic.title} — {topic.description}
            </title>

            {/* Node background */}
            <motion.rect
              x={pos.px - NODE_W / 2}
              y={pos.py - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={10}
              fill="var(--surface)"
              stroke={
                isHovered || (isConnected && hoveredSlug)
                  ? catColor
                  : "var(--border)"
              }
              animate={{
                strokeWidth: isHovered ? 2.2 : 1.2,
                strokeOpacity:
                  isConnected && hoveredSlug && !isHovered ? 0.5 : 1,
              }}
              transition={springSnappy}
            />

            {/* Color overlay — always present, animated */}
            <motion.rect
              x={pos.px - NODE_W / 2}
              y={pos.py - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={10}
              fill={catColor}
              animate={{
                opacity: isHovered
                  ? 0.13
                  : isConnected && hoveredSlug
                    ? 0.05
                    : 0,
              }}
              transition={springSnappy}
            />

            {/* Topic number */}
            <text
              x={pos.px - NODE_W / 2 + 10}
              y={pos.py + 1}
              fontSize="10"
              fontFamily="var(--font-mono)"
              fontWeight="700"
              fill={catColor}
              dominantBaseline="middle"
            >
              {String(topic.number).padStart(2, "0")}
            </text>

            {/* Topic title */}
            <text
              x={pos.px - NODE_W / 2 + 28}
              y={pos.py + 1}
              fontSize="11"
              fontWeight="500"
              fill="var(--foreground)"
              dominantBaseline="middle"
            >
              {title}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
