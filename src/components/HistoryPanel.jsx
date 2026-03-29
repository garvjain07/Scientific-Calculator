import { Download, Eraser } from 'lucide-react'

// Displays stored calculations with reuse and export actions.
function HistoryPanel({ history, onReuse, onClear, onExport, compact = false, className = '' }) {
  if (compact) {
    return (
      <aside className={`glass-panel flex h-full min-h-0 flex-col overflow-hidden p-1.5 ${className}`.trim()}>
        <div className="mb-1 flex items-center justify-between gap-1">
          <h3 className="text-xs font-semibold">History</h3>
          <button
            type="button"
            className="neumorph-btn rounded-md px-1.5 py-0.5 text-[10px]"
            onClick={onClear}
            title="Clear History"
          >
            Clear
          </button>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5">
          {history.length === 0 && <p className="text-[10px] text-(--muted-text)">No entries yet.</p>}

          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              className="neumorph-btn w-full rounded-lg px-1.5 py-1 text-left"
              onClick={() => onReuse(item.expression)}
              title={`${item.expression} = ${item.result}`}
            >
              <p className="truncate text-[10px] text-(--muted-text)">{item.expression}</p>
              <p className="truncate text-[11px] font-semibold text-(--accent-color)">= {item.result}</p>
            </button>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className={`glass-panel flex h-full min-h-0 flex-col p-3 ${className}`.trim()}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">History</h3>
        <div className="flex gap-2">
          <button type="button" className="neumorph-btn rounded-lg p-2" onClick={onExport} title="Export CSV">
            <Download className="h-4 w-4" />
          </button>
          <button type="button" className="neumorph-btn rounded-lg p-2" onClick={onClear} title="Clear History">
            <Eraser className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {history.length === 0 && <p className="text-sm text-(--muted-text)">No calculations yet.</p>}

        {history.map((item) => (
          <button
            key={item.id}
            type="button"
            className="neumorph-btn w-full rounded-xl p-3 text-left"
            onClick={() => onReuse(item.expression)}
          >
            <p className="truncate text-xs text-(--muted-text)">{item.timestamp}</p>
            <p className="mt-1 truncate text-sm font-medium">{item.expression}</p>
            <p className="truncate text-base font-semibold text-(--accent-color)">= {item.result}</p>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default HistoryPanel
