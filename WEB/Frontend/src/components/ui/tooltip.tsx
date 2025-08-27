import * as React from "react";

type TooltipProps = {
  children: React.ReactNode;
};

export function TooltipProvider({ children }: TooltipProps) {
  return <>{children}</>;
}

export function Tooltip({ children }: TooltipProps) {
  return <>{children}</>;
}

export function TooltipTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  return <span>{children}</span>;
}

export function TooltipContent({ children }: TooltipProps) {
  return (
    <div style={{ position: "absolute", background: "#fff", color: "#000", padding: "8px", borderRadius: "4px", zIndex: 100, top:'470px', left:'50%', transform: 'translateX(-50%)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {children}
    </div>
  );
}