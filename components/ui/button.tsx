import * as React from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-xl font-medium transition focus:outline-none focus:ring ${
        variant === "outline"
          ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          : "bg-black text-white hover:bg-gray-800"
      } ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

export default Button;
