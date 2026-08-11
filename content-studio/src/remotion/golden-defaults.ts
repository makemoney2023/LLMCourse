import { scriptPackToTitlePunchProps, type TitlePunchProps } from "../render/props";
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

export const goldenTitlePunchProps: TitlePunchProps =
  scriptPackToTitlePunchProps(parseScriptPack(goldenFixture));
