import { useEffect, useState } from "react";
import { BRANCHES } from "../data/ranks";

const groupSymbols = {
  mannschaften: 1,
  unteroffiziere: 2,
  offiziere: 3,
  generale: 4,
  admirale: 4,
};

export default function RankImage({
  rank,
  highlighted = false,
  showLabel = true,
  showMeta = true,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const accent = BRANCHES.find((branch) => branch.id === rank.branch)?.accent ?? "#4a6c89";
  const stripes = Math.min(rank.order, 6);
  const stars = groupSymbols[rank.group] ?? 1;

  useEffect(() => {
    setHasImageError(false);
  }, [rank.id, rank.image]);

  const showFallback = !rank.image || hasImageError;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        highlighted ? "border-brass shadow-[0_0_0_3px_rgba(255,18,8,0.22)]" : "border-white/15"
      } bg-ink-900`}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-white/5 via-transparent to-black/25">
        <div className="absolute inset-x-0 top-0 z-10 h-3" style={{ backgroundColor: accent }} />

        {!showFallback ? (
          <img
            src={rank.image}
            alt={rank.name}
            className="h-full w-full bg-sand object-contain p-3"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_35%),linear-gradient(135deg,transparent,rgba(255,255,255,0.05))]" />
            </div>
            <div className="flex h-full flex-col justify-between p-4">
              <div className="flex justify-end gap-2">
                {Array.from({ length: stars }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 w-4 rotate-45 border border-sand/80 bg-brass/80"
                  />
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: stripes }).map((_, index) => (
                  <div
                    key={index}
                    className="h-2 rounded-full bg-sand/85"
                    style={{ width: `${100 - index * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {(showLabel || showMeta || showFallback) && (
        <div className="border-t border-white/10 px-4 py-3">
          {showMeta ? (
            <p className="text-xs uppercase tracking-[0.25em] text-sand/60">
              {rank.branch} · {rank.category}
            </p>
          ) : null}
          {showLabel ? <p className="mt-1 text-sm font-semibold text-white">{rank.name}</p> : null}
          {showFallback ? (
            <p className="mt-1 text-xs text-sand/50">Platzhalteransicht aktiv</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
