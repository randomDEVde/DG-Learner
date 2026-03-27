import { MODES } from "../data/ranks";

export default function ModeSelector({ value, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`rounded-3xl border p-4 text-left transition ${
            value === mode.id
              ? "border-brass bg-brass/10 text-white"
              : "border-white/10 bg-white/5 text-sand/80 hover:border-white/30"
          }`}
        >
          <div className="text-sm font-semibold">{mode.label}</div>
          <div className="mt-1 text-sm text-sand/65">{mode.description}</div>
        </button>
      ))}
    </div>
  );
}
