import { BRANCHES } from "../data/ranks";

export default function BranchSelector({ value, onChange }) {
  const toggle = (id) => {
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
    <div className="flex flex-wrap gap-3">
      {BRANCHES.map((branch) => (
        <button
          key={branch.id}
          type="button"
          onClick={() => toggle(branch.id)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            value.includes(branch.id)
              ? "border-signal bg-signal/15 text-white"
              : "border-white/10 bg-white/5 text-sand/80"
          }`}
        >
          {branch.label}
        </button>
      ))}
    </div>
  );
}
