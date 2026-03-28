import { MODES } from "../data/ranks";

export default function ModeSelector({ value, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {MODES.map((mode, index) => {
        const selected = value === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={`group relative overflow-hidden rounded-[1.75rem] border p-5 text-left transition duration-200 ${
              selected
                ? "border-transparent bg-[linear-gradient(135deg,rgba(255,18,8,0.22),rgba(176,176,180,0.2))] text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                : "border-white/15 bg-white/10 text-sand/85 hover:border-brass/45 hover:bg-white/14"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 ${
                selected
                  ? "bg-[linear-gradient(90deg,rgba(255,18,8,0.95),rgba(176,176,180,0.85))]"
                  : "bg-transparent group-hover:bg-[linear-gradient(90deg,rgba(255,18,8,0.7),rgba(176,176,180,0.5))]"
              }`}
            />
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-sand/55">
                    Modus {index + 1}
                  </p>
                  <div className="mt-3 text-base font-semibold leading-6">{mode.label}</div>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold ${
                    selected
                      ? "border-white/20 bg-white/12 text-white"
                      : "border-white/10 bg-black/15 text-sand/75"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
              <div className="mt-4 text-sm leading-6 text-sand/70">{mode.description}</div>
              <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sand/55">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    selected ? "bg-brass shadow-[0_0_14px_rgba(255,18,8,0.45)]" : "bg-signal/80"
                  }`}
                />
                {selected ? "Aktiv" : "Auswählbar"}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
