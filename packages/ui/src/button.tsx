// packages/ui/src/Button.tsx
"use client"; // Keep this directive if components in 'ui' might be used in Server Components in the future

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string; // Allow overriding/extending styles
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      type="button" // Explicitly set type for buttons
      // Add Tailwind classes here:
      className={`
        px-4 py-2                      # Padding
        bg-indigo-600                 # Background color (using Indigo for distinctness)
        text-white                    # Text color
        font-semibold                 # Font weight
        rounded-lg                    # Rounded corners
        shadow-md                     # Add a subtle shadow
        hover:bg-indigo-700           # Darken background on hover
        focus:outline-none            # Remove default focus outline
        focus:ring-2                  # Add a ring on focus
        focus:ring-indigo-500         # Ring color
        focus:ring-offset-2           # Ring offset
        transition ease-in-out duration-150 # Smooth transition
        ${className || ""}             # Append any custom classes passed via props
      `}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};