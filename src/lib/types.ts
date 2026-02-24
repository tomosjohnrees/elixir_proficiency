export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  topicCount: number;
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  number: number;
  active: boolean;
}

export interface ELI5Content {
  analogy: string;
  analogyTitle: string;
  items: { label: string; description: string }[];
  keyTakeaways: string[];
}

export interface DataTypeCard {
  name: string;
  color: string;
  examples: string[];
  description: string;
}

export interface OperatorGroup {
  name: string;
  operators: { symbol: string; description: string }[];
}

export interface AnimationEntry {
  component: React.ComponentType;
  duration: number;
}

export interface VisualsContent {
  animation?: React.ComponentType;
  animationDuration?: number;
  animations?: AnimationEntry[];
  dataTypes: DataTypeCard[];
  operatorGroups: OperatorGroup[];
}

export interface DeepDiveSubsection {
  title: string;
  prose: string[];
  code?: { title?: string; code: string; output?: string };
}

export interface DeepDiveContent {
  sections: DeepDiveSubsection[];
}

export interface QuizOption {
  label: string;
  correct?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface Hint {
  text: string;
}

export interface PracticeProblem {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prompt: string;
  hints: Hint[];
  solution: string;
  walkthrough: string[];
}

export interface PracticeContent {
  problems: PracticeProblem[];
}

export interface Gotcha {
  title: string;
  description: string;
  code?: string;
}

export interface GotchasContent {
  items: Gotcha[];
}

export interface TopicContent {
  meta: TopicMeta;
  eli5: ELI5Content;
  visuals: VisualsContent;
  deepDive: DeepDiveContent;
  gotchas?: GotchasContent;
  quiz: QuizContent;
  practice: PracticeContent;
}

export interface TaggedQuizQuestion extends QuizQuestion {
  topicSlug: string;
  topicTitle: string;
  topicNumber: number;
}

// ─── Topic Relationship Types ────────────────────────────

export type TopicCategory =
  | "foundations"
  | "data-processing"
  | "otp-concurrency"
  | "abstraction"
  | "ecosystem"
  | "tooling";

export interface TopicRelationship {
  from: string;
  to: string;
  strength: "strong" | "moderate";
}

export interface TopicNode {
  slug: string;
  category: TopicCategory;
  x: number;
  y: number;
}

export interface TopicGraph {
  nodes: TopicNode[];
  edges: TopicRelationship[];
}
