export default function LearningModeSwitch({ value, onChange, disabled = false }) {
  const enabled = value === "spaced-repetition";

  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Spaced Repetition</p>
          <p className="mt-1 text-sm text-sand/70">
            Bewertete Karten werden zeitgesteuert erneut vorgelegt.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={disabled}
          onClick={() => onChange(enabled ? "standard" : "spaced-repetition")}
          className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${
            enabled ? "border-brass bg-brass/80" : "border-white/20 bg-white/10"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <span
            className={`inline-block h-6 w-6 rounded-full bg-white transition ${
              enabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {disabled ? (
        <p className="mt-3 text-sm text-sand/70">
          Im Organigramm-Modus ist Spaced Repetition deaktiviert.
        </p>
      ) : null}
    </div>
  );
}
