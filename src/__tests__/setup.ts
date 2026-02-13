import "@testing-library/jest-dom/vitest";
import React from "react";

// Mock motion/react so animations render instantly in tests
const motionPropNames = new Set([
  "initial", "exit", "transition", "variants",
  "whileHover", "whileTap", "whileFocus", "whileInView", "whileDrag",
  "layoutId", "layout", "layoutDependency", "layoutScroll",
  "onAnimationStart", "onAnimationComplete", "onUpdate",
  "drag", "dragConstraints", "dragElastic", "dragMomentum",
]);

const componentCache = new Map<string, React.ForwardRefExoticComponent<Record<string, unknown>>>();

function createMotionComponent(tag: string) {
  const Component = React.forwardRef<unknown, Record<string, unknown>>((props, ref) => {
    const { animate, ...rest } = props;
    const domProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (!motionPropNames.has(key)) {
        domProps[key] = value;
      }
    }

    // Apply animate target as inline style so content is visible/testable
    if (animate && typeof animate === "object" && !Array.isArray(animate)) {
      domProps.style = { ...(domProps.style as Record<string, unknown>), ...(animate as Record<string, unknown>) };
    }

    return React.createElement(tag, { ...domProps, ref });
  });
  Component.displayName = `motion.${tag}`;
  return Component;
}

const motionProxy = new Proxy({} as Record<string, unknown>, {
  get: (_target, tag: string) => {
    if (!componentCache.has(tag)) {
      componentCache.set(tag, createMotionComponent(tag));
    }
    return componentCache.get(tag);
  },
});

vi.mock("motion/react", () => ({
  motion: motionProxy,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useInView: () => true,
  useMotionValue: (init: number) => ({ get: () => init, set: vi.fn() }),
  useTransform: () => ({ get: () => 0 }),
  useScroll: () => ({ scrollY: { get: () => 0, set: vi.fn() } }),
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
}));

// Mock IntersectionObserver for SectionNav tests
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock matchMedia for ThemeToggle tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
