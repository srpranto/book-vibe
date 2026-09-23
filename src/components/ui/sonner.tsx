"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-foreground group-[.toaster]:text-background group-[.toaster]:border-[#4A3324] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
          description: "group-[.toast]:text-[#D8C7BA]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-xl",
          cancelButton:
            "group-[.toast]:bg-[#3D291D] group-[.toast]:text-background group-[.toast]:rounded-xl",
          closeButton:
            "group-[.toast]:bg-[#3D291D] group-[.toast]:text-background group-[.toast]:border-[#4A3324] group-[.toast]:hover:bg-[#4A3324]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
