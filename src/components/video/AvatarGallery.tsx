import { Check } from "lucide-react";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import { cn } from "@/lib/utils";
import { videoAvatars, type VideoAvatarId } from "@/lib/video-avatars";

const avatarPreviews = {
  "avatar-1": avatar1,
  "avatar-2": avatar2,
  "avatar-3": avatar3,
  "avatar-4": avatar4,
} as const;

type AvatarGalleryProps = {
  value: VideoAvatarId;
  onChange: (avatarId: VideoAvatarId) => void;
};

export function AvatarGallery({ value, onChange }: AvatarGalleryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {videoAvatars.map((avatar) => {
        const selected = avatar.id === value;

        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onChange(avatar.id)}
            className={cn(
              "group relative overflow-hidden rounded-[1.75rem] border bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
              selected
                ? "border-slate-950 ring-2 ring-slate-950 ring-offset-2"
                : "border-slate-200 hover:border-slate-300",
            )}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-slate-100">
              <img
                src={avatarPreviews[avatar.id]}
                alt={avatar.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  avatar.accent,
                  "opacity-25 mix-blend-multiply",
                )}
              />
              {selected && (
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{avatar.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    {avatar.role}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                    selected ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600",
                  )}
                >
                  {selected ? "Selected" : "Pick"}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{avatar.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
