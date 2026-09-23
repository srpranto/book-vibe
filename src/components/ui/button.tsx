import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:opacity-90",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-xs hover:bg-primary-hover shadow-primary/20",
        secondary:
          "bg-muted text-[#7A4B22] border border-[#E8D5C4] hover:bg-border",
        outline:
          "border border-[#DCC8B6] bg-white text-[#4A2E18] shadow-2xs hover:border-primary hover:bg-muted hover:text-primary",
        ghost: "text-[#4A2E18] hover:bg-muted hover:text-primary",
        destructive:
          "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:text-red-800",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
        warm: "bg-foreground text-white hover:bg-[#382419] shadow-xs",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
