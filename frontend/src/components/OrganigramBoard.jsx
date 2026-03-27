import { useState } from "react";

function RankChip({ rank, selected, onSelect, draggable = true }) {
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", rank.id);
      }}
      onClick={() => onSelect(rank.id)}
      className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
        selected ? "border-brass bg-brass/15 text-white" : "border-white/10 bg-white/5 text-sand/80"
      }`}
    >
      {rank.name}
    </button>
  );
}

export default function OrganigramBoard({
  task,
  feedback,
  onPlace,
  onHint,
  onAutoSolve,
}) {
  const [selectedRankId, setSelectedRankId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onHint}
          className="rounded-full border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-white"
        >
          Nächsten richtigen Platz zeigen
        </button>
        <button
          type="button"
          onClick={onAutoSolve}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
        >
          Nächsten Rang automatisch einsetzen
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {task.groups.map((group) => (
            <section key={group.branch} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                <span className="text-sm text-sand/60">{group.ranks.length} Dienstgrade</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.ranks.map((rank) => {
                  const slotKey = `${rank.branch}-${rank.order}`;
                  const placedRankId = task.placements[slotKey];
                  const isHint = feedback?.slotKey === slotKey;
                  return (
                    <button
                      key={slotKey}
                      type="button"
                      onClick={() => selectedRankId && onPlace(selectedRankId, slotKey)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        onPlace(event.dataTransfer.getData("text/plain"), slotKey);
                      }}
                      className={`min-h-28 rounded-2xl border p-4 text-left transition ${
                        isHint
                          ? "border-brass bg-brass/10"
                          : placedRankId
                            ? "border-signal/35 bg-signal/10"
                            : "border-dashed border-white/15 bg-black/10"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-sand/50">{rank.group}</p>
                      <p className="mt-2 text-sm text-sand/65">Position {rank.order}</p>
                      <p className="mt-3 font-medium text-white">
                        {placedRankId ? rank.name : "Karte hier platzieren"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-lg font-semibold text-white">Kartenpool</h3>
          <p className="mt-1 text-sm text-sand/65">
            Desktop: ziehen. Mobil: Karte antippen, danach Ziel antippen.
          </p>
          <div className="mt-4 grid gap-3">
            {task.remaining.map((rank) => (
              <RankChip
                key={rank.id}
                rank={rank}
                selected={selectedRankId === rank.id}
                onSelect={setSelectedRankId}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
