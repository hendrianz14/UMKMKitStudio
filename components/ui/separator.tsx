import * as React from "react";

export function Separator({ orientation = "horizontal", className = "" }: { orientation?: "horizontal" | "vertical"; className?: string }) {
  return orientation === "vertical"
    ? <span className={`inline-block w-px h-5 bg-gray-300 mx-2 align-middle ${className}`} />
    : <hr className={`my-2 border-gray-200 ${className}`} />;
}
