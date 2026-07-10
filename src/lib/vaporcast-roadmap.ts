import { Sparkles, Wand2, Bot, Languages, Users, Rocket } from "lucide-react";

export type RoadmapPhase = {
  title: string;
  subtitle: string;
  icon: typeof Sparkles;
  items: string[];
};

export const vaporcastRoadmap: RoadmapPhase[] = [
  {
    title: "Foundation",
    subtitle: "Make the core workflow fast and predictable.",
    icon: Wand2,
    items: [
      "Prompt composer with saved presets",
      "Avatar selection and defaults",
      "Reliable job history and status tracking",
      "Template starter gallery",
    ],
  },
  {
    title: "Premium Creation",
    subtitle: "Add the features users expect from modern AI video tools.",
    icon: Bot,
    items: [
      "Model picker for text-to-video and image-to-video",
      "Voice selection and voice cloning hooks",
      "Scene editor with regenerate controls",
      "Brand kit and style presets",
    ],
  },
  {
    title: "Localization",
    subtitle: "Turn one video into many markets.",
    icon: Languages,
    items: [
      "Auto captions and subtitle styles",
      "Video translation and dubbing",
      "Multi-language exports",
      "Regional prompt and voice presets",
    ],
  },
  {
    title: "Team Workflow",
    subtitle: "Make Vaporcast work for teams and agencies.",
    icon: Users,
    items: [
      "Commenting and review mode",
      "Workspace roles and approvals",
      "Shared asset library",
      "Bulk generation and batch variants",
    ],
  },
  {
    title: "Scale",
    subtitle: "Unlock premium and enterprise differentiation.",
    icon: Rocket,
    items: [
      "Export presets for every channel",
      "Usage analytics and performance tracking",
      "API access and automation",
      "Enterprise onboarding and security controls",
    ],
  },
];
