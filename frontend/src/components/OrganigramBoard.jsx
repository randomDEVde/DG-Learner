import { useState } from "react";
import ShortcutButton from "./ShortcutButton";

function RankChip({ rank, selected, onSelect, draggable = true }) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", rank.id);
      }}
      onClick={() => onSelect(rank.id)}
      className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
        selected ? "border-brass bg-brass/15 text-white" : "border-white/15 bg-white/10 text-sand/85"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-sand">
          {!hasImageError && rank.image ? (
            <img
              src={rank.image}
              alt={rank.name}
              className="h-full w-full object-contain p-1"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="h-8 w-5 rounded-t-full border-[3px] border-ink-950 border-b-0 bg-ink-800/70" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{rank.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sand/55">{rank.branch}</p>
        </div>
      </div>
    </button>
  );
}

function SlotPreview({ rank }) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-sand">
        {!hasImageError && rank.image ? (
          <img
            src={rank.image}
            alt={rank.name}
            className="h-full w-full object-contain p-1"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="h-8 w-5 rounded-t-full border-[3px] border-ink-950 border-b-0 bg-ink-800/70" />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-white">{rank.name}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sand/55">{rank.branch}</p>
      </div>
    </div>
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
        <ShortcutButton
          type="button"
          shortcut="L"
          tooltipLabel="Nächsten Lösungsschritt mit L zeigen"
          onClick={onHint}
          className="rounded-full border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-white"
        >
          Nächsten richtigen Platz zeigen
        </ShortcutButton>
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
            <section key={group.branch} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                <span className="text-sm text-sand/60">{group.ranks.length} Dienstgrade</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.ranks.map((rank) => {
                  const slotKey = `${rank.branch}-${rank.order}`;
                  const placedRankId = task.placements[slotKey];
                  const placedRank = placedRankId
                    ? group.ranks.find((entry) => entry.id === placedRankId) ?? rank
                    : null;
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
                            ? "border-brass bg-brass/15"
                          : placedRankId
                            ? "border-signal/40 bg-white/10"
                            : "border-dashed border-white/20 bg-black/20"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-sand/50">{rank.group}</p>
                      <p className="mt-2 text-sm text-sand/65">Position {rank.order}</p>
                      {placedRank ? (
                        <SlotPreview rank={placedRank} />
                      ) : (
                        <p className="mt-3 font-medium text-white">Karte hier platzieren</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Kartenpool</h3>
          <p className="mt-1 text-sm text-sand/65">
            Desktop: Karte ziehen oder erst anklicken und dann einen Zielslot wählen.
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
