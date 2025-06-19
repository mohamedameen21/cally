import * as React from "react";
import { cn } from "@/lib/utils";

interface TimePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (time: string) => void;
}

export function TimePicker({ className, onChange, value, ...props }: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type="time"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}