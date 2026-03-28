import { CATEGORIES } from "../data/ranks";

export default function CategorySelector({ value, onChange, lockToStandard = false }) {
  const toggle = (id) => {
    if (lockToStandard) {
      onChange(["standard"]);
      return;
    }

    if (value.includes(id)) {
      if (value.length === 1) {
        return;
      }
      onChange(value.filter((entry) => entry !== id));
      return;
    }

    onChange([...value, id]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((category) => {
          const selected = lockToStandard ? category.id === "standard" : value.includes(category.id);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggle(category.id)}
              disabled={lockToStandard && category.id !== "standard"}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "border-brass bg-brass/15 text-white"
                  : "border-white/15 bg-white/10 text-sand/85 hover:border-brass/40"
              } ${lockToStandard && category.id !== "standard" ? "cursor-not-allowed opacity-45" : ""}`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
      {lockToStandard ? (
        <p className="text-sm text-sand/70">
          Im Organigramm werden nur Standardränge verwendet. Spezialkategorien bleiben in den
          anderen Lernmodi verfügbar.
        </p>
      ) : null}
    </div>
  );
}
