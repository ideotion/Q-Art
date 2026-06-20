"use client";

import TextareaAutosize from "react-textarea-autosize";

/**
 * Auto-growing, dictation-friendly text input (react-textarea-autosize) — the
 * v1 reflection composer per design.md §4.
 */
export function AutoTextarea({
  value,
  onChange,
  placeholder,
  label,
  minRows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  minRows?: number;
}) {
  return (
    <label className="block">
      {label ? <span className="text-muted mb-1 block text-sm">{label}</span> : null}
      <TextareaAutosize
        minRows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-border bg-card focus:border-accent w-full resize-none rounded-lg border p-3 text-sm outline-none"
      />
    </label>
  );
}
