export default function CompletionDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-ink-950 p-6 shadow-panel">
        <p className="text-sm uppercase tracking-[0.28em] text-sand/55">Abschluss</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-sand/80">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink-950"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
