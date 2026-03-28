export default function ShortcutButton({
  children,
  shortcut,
  className = "",
  tooltipLabel,
  ...props
}) {
  const tooltipText = tooltipLabel ?? `Tastenkürzel: ${shortcut}`;

  return (
    <div className="group relative inline-flex">
      <button {...props} className={className}>
        {children}
      </button>
      {shortcut ? (
        <div className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/15 bg-ink-950 px-3 py-2 text-xs text-sand shadow-panel group-hover:hidden lg:group-hover:block">
          {tooltipText}
        </div>
      ) : null}
    </div>
  );
}
