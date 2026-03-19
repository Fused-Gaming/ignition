"use client";

interface TokenSwatchProps {
  name: string;
  cssVar: string;
  hex: string;
  onChange?: (value: string) => void;
}

export default function TokenSwatch({ name, cssVar, hex, onChange }: TokenSwatchProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <label className="relative cursor-pointer" title={`Edit ${name}`}>
        <div
          className="color-swatch"
          style={{ background: hex }}
        />
        {onChange && (
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        )}
      </label>
      <div className="flex-grow min-w-0">
        <div className="text-xs font-mono" style={{ color: "var(--admin-muted)" }}>
          {cssVar}
        </div>
        <div className="text-xs font-mono" style={{ color: "var(--admin-faint)" }}>
          {hex}
        </div>
      </div>
      <div
        className="text-xs font-medium truncate max-w-[100px]"
        style={{ color: "var(--admin-text)" }}
      >
        {name}
      </div>
    </div>
  );
}
