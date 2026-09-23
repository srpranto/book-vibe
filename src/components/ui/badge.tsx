import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-muted text-[#7A4B22] border border-[#E8D5C4]",
        outline: "border border-[#DCC8B6] bg-white text-[#4A2E18]",
        success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        amber: "bg-amber-50 text-amber-800 border border-amber-200",
        blue: "bg-sky-50 text-sky-800 border border-sky-200",
        destructive: "bg-red-50 text-red-700 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
