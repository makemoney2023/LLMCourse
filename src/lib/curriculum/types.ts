export type ToolMapping = {
  abstraction: string;
  surfaces: string;
};

export type ModuleMeta = {
  id: string;
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  workshopSession: number;
  prerequisites: string[];
  objectives: string[];
  loopPlacement: string;
  skipConsequence: string;
  exerciseTitles: string[];
  toolMapping: ToolMapping[];
  quizCount: number;
  dirName: string;
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizRemediation = {
  lessonHeading?: string;
  glossaryIds?: string[];
  moduleSlug?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  /** Optional glossary-linked HTML for the prompt stem. */
  promptHtml?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  remediation?: QuizRemediation;
};

export type Quiz = {
  moduleId: string;
  questions: QuizQuestion[];
};

export type ModuleContent = {
  meta: ModuleMeta;
  lessonMarkdown: string;
  exercisesMarkdown: string;
  workshopMarkdown: string;
  diagramSource: string;
  quiz: Quiz | null;
};

export type WorkshopSlideLayout =
  | "title"
  | "section"
  | "bullets"
  | "steps"
  | "activity"
  | "discussion"
  | "takeaway";

export type WorkshopSlide = {
  id: string;
  layout: WorkshopSlideLayout;
  title: string;
  subtitle?: string;
  bullets?: string[];
  steps?: string[];
  /** Short on-slide prompt or activity brief */
  body?: string;
  /** Facilitator speaking notes (not shown full-screen by default) */
  notes?: string;
  timing?: string;
};

export type WorkshopSession = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  outcome: string;
  markdown: string;
  moduleSlugs: string[];
  slides: WorkshopSlide[];
};

export type RoleTrackId =
  | "general"
  | "ops"
  | "sales"
  | "eng"
  | "marketing";

export type CourseProgress = {
  completedModules: string[];
  completedExercises: Record<string, string[]>;
  quizScores: Record<string, number>;
  revealedAnswers: Record<string, string[]>;
  roleTrack: RoleTrackId;
  checkpoints: string[];
  sandboxAttempts: Record<string, { comparedAt: string }>;
  certificateClaims: string[];
  packSavedAck: boolean;
};
