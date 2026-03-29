import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { exportHistoryAsCsv } from '../services/csvService'
import { useScientificCalculator } from '../hooks/useScientificCalculator'
import CalculatorDisplay from './CalculatorDisplay'
import CalculatorKeypad from './CalculatorKeypad'
import HistoryPanel from './HistoryPanel'

// Composes calculator UI with memory, history, and keyboard controls.
function CalculatorPanel() {
  const inputRef = useRef(null)
  const caretRef = useRef(0)
  const [isHistoryVisible, setIsHistoryVisible] = useState(false)

  const {
    state,
    append,
    setExpression,
    clear,
    removeLast,
    evaluateCurrent,
    toggleAngle,
    runMemory,
    clearHistory,
  } = useScientificCalculator()

  // Keep history hidden by default after reloads/hot updates.
  useEffect(() => {
    setIsHistoryVisible(false)
  }, [])

  const syncCaret = useCallback(() => {
    const input = inputRef.current
    if (!input) {
      return
    }

    caretRef.current = input.selectionStart ?? state.expression.length
  }, [state.expression])

  const insertTemplate = useCallback(
    (button) => {
      const insertIndex = caretRef.current ?? state.expression.length
      const template = button.template ?? ''
      const nextExpression = `${state.expression.slice(0, insertIndex)}${template}${state.expression.slice(insertIndex)}`
      const nextCaretStart = insertIndex + template.length - (button.cursorOffsetFromEnd ?? 0)
      const nextCaretEnd = nextCaretStart + (button.selectionLength ?? 0)

      setExpression(nextExpression)

      requestAnimationFrame(() => {
        const input = inputRef.current
        if (!input) {
          return
        }

        input.focus()
        input.setSelectionRange(nextCaretStart, nextCaretEnd)
        caretRef.current = nextCaretStart
      })
    },
    [setExpression, state.expression],
  )

  const handleKeyAction = useCallback(
    (button) => {
      if (button.template) {
        insertTemplate(button)
        return
      }

      if (button.value) {
        append(button.value)
        return
      }

      switch (button.action) {
        case 'CLEAR':
          clear()
          break
        case 'CLEAR_ENTRY':
          setExpression('')
          break
        case 'DELETE':
          removeLast()
          break
        case 'EVALUATE':
          evaluateCurrent()
          break
        case 'TOGGLE_ANGLE':
          toggleAngle()
          break
        case 'MEMORY_CLEAR':
          runMemory('CLEAR')
          break
        case 'MEMORY_RECALL':
          runMemory('RECALL')
          break
        case 'MEMORY_ADD':
          runMemory('ADD')
          break
        case 'MEMORY_SUBTRACT':
          runMemory('SUBTRACT')
          break
        default:
          break
      }
    },
    [append, clear, evaluateCurrent, insertTemplate, removeLast, runMemory, setExpression, toggleAngle],
  )

  // Writes current result to clipboard with browser API fallback checks.
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(state.result)
    } catch {
      // Keep UI silent on copy failure to avoid interrupting workflow.
    }
  }

  return (
    <section
      className={`mobile-calc-section grid h-full min-h-0 gap-1.5 xl:gap-2 ${isHistoryVisible ? 'xl:grid-cols-[1fr_280px]' : ''}`.trim()}
    >
      <div className="min-h-0">
        <div className="mobile-calc-shell glass-panel flex h-full min-h-0 flex-col p-2 xl:p-3">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
            <p className="badge">Angle: {state.angleMode}</p>
            <div className="flex items-center gap-1.5">
              <p className="badge">Memory: {state.memory}</p>
              <button
                type="button"
                className="neumorph-btn inline-flex h-7 w-7 items-center justify-center rounded-full"
                onClick={() => setIsHistoryVisible((previous) => !previous)}
                title={isHistoryVisible ? 'Hide History' : 'Show History'}
                aria-label={isHistoryVisible ? 'Hide History' : 'Show History'}
                aria-expanded={isHistoryVisible}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mb-1.5">
            <input
              ref={inputRef}
              className="app-expression-input neumorph-btn w-full rounded-xl px-3 py-1 text-sm sm:text-base"
              placeholder="Type expression like 2+3*sin(45)"
              value={state.expression}
              onChange={(event) => setExpression(event.target.value)}
              onClick={syncCaret}
              onKeyUp={syncCaret}
              onSelect={syncCaret}
            />
          </div>

          <div
            className={`mobile-top-row mb-1.5 grid min-h-0 gap-1.5 xl:block xl:h-auto ${isHistoryVisible ? 'grid-cols-[minmax(0,1fr)_96px]' : 'grid-cols-1'}`.trim()}
          >
            <CalculatorDisplay
              className="h-full"
              expression={state.expression}
              preview={state.preview}
              error={state.error}
              result={state.result}
              onCopy={copyResult}
            />

            {isHistoryVisible && (
              <HistoryPanel
                compact
                className="xl:hidden"
                history={state.history}
                onReuse={setExpression}
                onClear={clearHistory}
                onExport={() => exportHistoryAsCsv(state.history)}
              />
            )}
          </div>

          <div className="mobile-keypad-wrap mt-1.5 min-h-0 flex-1 overflow-hidden">
            <CalculatorKeypad onAction={handleKeyAction} />
          </div>
        </div>
      </div>

      {isHistoryVisible && (
        <HistoryPanel
          className="hidden xl:flex"
          history={state.history}
          onReuse={setExpression}
          onClear={clearHistory}
          onExport={() => exportHistoryAsCsv(state.history)}
        />
      )}
    </section>
  )
}

export default CalculatorPanel
