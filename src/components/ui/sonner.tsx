import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:border-white/70 group-[.toaster]:bg-white/92 group-[.toaster]:text-foreground group-[.toaster]:shadow-[0_24px_80px_-44px_rgba(15,23,42,0.6)] group-[.toaster]:backdrop-blur",
          description: "group-[.toast]:text-muted-foreground/90",
          actionButton:
            "group-[.toast]:rounded-xl group-[.toast]:bg-slate-950 group-[.toast]:text-white group-[.toast]:shadow-sm",
          cancelButton:
            "group-[.toast]:rounded-xl group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
