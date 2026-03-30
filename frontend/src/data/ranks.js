import ranksJson from "./ranks.json";

function resolvePublicPath(path) {
  if (!path) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const basePath = import.meta.env.BASE_URL || "/";
  return `${basePath}${normalizedPath}`;
}

export const BRANCHES = [
  { id: "heer", label: "Heer", accent: "#ff1208" },
  { id: "marine", label: "Marine", accent: "#1d4ed8" },
  { id: "luftwaffe", label: "Luftwaffe", accent: "#b0b0b4" },
];

export const MODES = [
  {
    id: "image-input",
    label: "Bild mit Texteingabe",
    description: "Dienstgrade über freie Eingabe trainieren.",
  },
  {
    id: "image-choice",
    label: "Bild mit Auswahl",
    description: "Aus mehreren Antworten die passende wählen.",
  },
  {
    id: "text-choice",
    label: "Text mit Bildauswahl",
    description: "Zum Namen das richtige Abzeichen finden.",
  },
  {
    id: "organigram",
    label: "Organigramm einordnen",
    description: "Ränge im Schema korrekt zuordnen.",
  },
];

export const CATEGORIES = [
  {
    id: "standard",
    label: "Standardränge",
    description: "Normale Dienstgrade der drei Teilstreitkräfte.",
  },
  {
    id: "offizieranwärter",
    label: "Offizieranwärter",
    description: "Anwärter- und Kadettenränge für spätere Offiziere.",
  },
  {
    id: "sanitätsdienst",
    label: "Sanitätsdienst",
    description: "Dienstgrade des Sanitätsdienstes.",
  },
];

function normalizeForId(value) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ranks = ranksJson.map((rank) => ({
  ...rank,
  image: resolvePublicPath(rank.image),
  id: `${rank.branch}-${normalizeForId(rank.category)}-${normalizeForId(rank.name)}`,
}));
