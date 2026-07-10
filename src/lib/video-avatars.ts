import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

export const videoAvatars = [
  {
    id: "avatar-1",
    name: "Avery",
    role: "Business presenter",
    category: "Business",
    description:
      "Polished enterprise presenter for product demos, onboarding, and investor-ready messaging.",
    personality: "Professional",
    languages: ["en-US", "en-GB", "de-DE"],
    voiceOptions: ["Corporate Female", "Neutral Female"],
    providerAvatarId: "heygen_business_avery",
    previewClipUrl: avatar1,
    accent: "from-slate-900 via-slate-700 to-slate-500",
  },
  {
    id: "avatar-2",
    name: "Mina",
    role: "Social media creator",
    category: "Social",
    description:
      "Warm, camera-friendly creator style with expressive delivery for vertical campaigns.",
    personality: "Friendly",
    languages: ["en-US", "es-ES", "fr-FR"],
    voiceOptions: ["Creator Female", "Warm Female"],
    providerAvatarId: "heygen_social_mina",
    previewClipUrl: avatar2,
    accent: "from-sky-700 via-cyan-500 to-emerald-400",
  },
  {
    id: "avatar-3",
    name: "Noah",
    role: "News presenter",
    category: "News",
    description:
      "Confident anchor-style delivery optimized for updates, explainers, and authority-led videos.",
    personality: "Confident",
    languages: ["en-US", "en-GB", "it-IT"],
    voiceOptions: ["Anchor Male", "Neutral Male"],
    providerAvatarId: "heygen_news_noah",
    previewClipUrl: avatar3,
    accent: "from-indigo-700 via-violet-500 to-fuchsia-400",
  },
  {
    id: "avatar-4",
    name: "Zara",
    role: "Educational presenter",
    category: "Education",
    description:
      "Clear instructional presence ideal for tutorials, courses, and product education tracks.",
    personality: "Storyteller",
    languages: ["en-US", "pt-BR", "hi-IN"],
    voiceOptions: ["Educational Female", "Calm Female"],
    providerAvatarId: "heygen_education_zara",
    previewClipUrl: avatar4,
    accent: "from-rose-700 via-orange-500 to-amber-300",
  },
] as const;

export type VideoAvatar = (typeof videoAvatars)[number];
export type VideoAvatarId = VideoAvatar["id"];

export const defaultVideoAvatarId: VideoAvatarId = "avatar-1";

export function getVideoAvatarById(avatarId: string | null | undefined) {
  return videoAvatars.find((avatar) => avatar.id === avatarId) ?? videoAvatars[0];
}
