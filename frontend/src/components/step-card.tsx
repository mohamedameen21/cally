import React from "react";
import { cn } from "@/lib/utils";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({
  number,
  title,
  description,
  className,
}: StepCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-all",
        className
      )}
    >
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg mr-3">
          {number}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
