import { createFileRoute } from "@tanstack/react-router";
import { LiveAvatarStudio } from "@/components/video/LiveAvatarStudio";

export const Route = createFileRoute("/dashboard/avatars")({
  component: AvatarsPage,
});

function AvatarsPage() {
  return <LiveAvatarStudio />;
}
