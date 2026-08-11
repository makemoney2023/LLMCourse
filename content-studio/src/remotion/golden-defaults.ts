import {
  scriptPackToListRevealProps,
  scriptPackToLoopSnippetProps,
  scriptPackToTitlePunchProps,
  type ListRevealProps,
  type LoopSnippetProps,
  type TitlePunchProps,
} from "../render/props";
import { parseScriptPack } from "../schema/script-pack";

/**
 * Browser-safe mirror of fixtures/mental-model-desk-space-01.yaml.
 * CLI render-one.ts loads the YAML on disk; Studio/calculateMetadata use this.
 */
const goldenFixture = {
  id: "mental-model-desk-space-01",
  module: "01-mental-model",
  anchor: "Context window = desk space",
  format: "voice" as const,
  hook: "Your AI isn't dumb — your desk is crowded.",
  beats: [
    {
      text: "Think of the context window as desk space.",
      visual: "title_card",
    },
    {
      text: "Too many sticky notes → worse answers.",
      visual: "kinetic_list",
    },
    {
      text: "Clear the desk. Keep the goal and the facts.",
      visual: "punchline",
    },
  ],
  cta: "Free LLM Leverage course — link in bio",
  duration_target_sec: 45,
  tags: ["context-window", "beginners"],
};

const goldenPack = parseScriptPack(goldenFixture);

export const goldenTitlePunchProps: TitlePunchProps =
  scriptPackToTitlePunchProps(goldenPack);

export const goldenListRevealProps: ListRevealProps =
  scriptPackToListRevealProps(
    parseScriptPack({
      ...goldenFixture,
      id: "myth-fix-desk-space-01",
      hook: "Myth: more sticky notes always help.",
    }),
  );

export const goldenLoopSnippetProps: LoopSnippetProps =
  scriptPackToLoopSnippetProps(
    parseScriptPack({
      ...goldenFixture,
      id: "loop-snippet-desk-space-01",
      anchor: "Observe → Decide → Act",
      hook: "Zoom in on one node of the loop.",
    }),
  );
