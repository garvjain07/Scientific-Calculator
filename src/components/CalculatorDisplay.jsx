import { motion } from 'framer-motion'
import { Copy, Mic, MicOff } from 'lucide-react'

// Shows expression, result preview, and quick actions.
function CalculatorDisplay({ expression, preview, error, result, onCopy, onVoiceToggle, isVoiceActive }) {
  return (
    <motion.section
      className="glass-panel flex min-h-24 flex-col justify-between gap-1.5 p-2.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="max-w-[80%]">
          <p className="text-xs uppercase tracking-[0.25em] text-(--muted-text)">Expression</p>
          <p className="mt-1 wrap-break-word text-sm font-semibold sm:text-base">{expression || '0'}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="neumorph-btn rounded-xl p-1.5" onClick={onCopy} title="Copy Result">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="neumorph-btn rounded-xl p-1.5" onClick={onVoiceToggle} title="Voice Input">
            {isVoiceActive ? <MicOff className="h-3.5 w-3.5 text-red-400" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div>
        {error ? <p className="text-xs font-semibold text-red-400">{error}</p> : <p className="text-xs text-(--muted-text)">Preview: {preview || '-'}</p>}
        <p className="mt-1 text-right text-xl font-bold sm:text-2xl">{result}</p>
      </div>
    </motion.section>
  )
}

export default CalculatorDisplay
