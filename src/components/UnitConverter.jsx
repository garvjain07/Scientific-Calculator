import { useMemo, useState } from 'react'
import { Eraser, RotateCcw } from 'lucide-react'
import { converterCategories, converterOptions, convertValue } from '../utils/converter'

const defaultCategory = 'length'
const defaultUnits = converterOptions[defaultCategory]
const commonCategoryValues = ['length', 'mass', 'temperature', 'speed', 'area', 'volume', 'time']

// Provides real-time unit conversion across all supported categories.
function UnitConverter() {
  const [category, setCategory] = useState(defaultCategory)
  const [fromUnit, setFromUnit] = useState(defaultUnits[0])
  const [toUnit, setToUnit] = useState(defaultUnits[1])
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')
  const [lastEdited, setLastEdited] = useState('from')
  const [history, setHistory] = useState([])
  const [isHistoryVisible, setIsHistoryVisible] = useState(false)

  const commonCategories = useMemo(
    () => converterCategories.filter((item) => commonCategoryValues.includes(item.value)),
    [],
  )

  const otherCategories = useMemo(
    () => converterCategories.filter((item) => !commonCategoryValues.includes(item.value)),
    [],
  )

  const categoryLabelByValue = useMemo(
    () => Object.fromEntries(converterCategories.map((item) => [item.value, item.label])),
    [],
  )

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory)
    const [first, second] = converterOptions[nextCategory]
    setFromUnit(first)
    setToUnit(second)
    setToValue('')
    setLastEdited('from')
  }

  function handleFromValueChange(nextValue) {
    setLastEdited('from')
    setFromValue(nextValue)
    setToValue('')
  }

  function handleToValueChange(nextValue) {
    setLastEdited('to')
    setToValue(nextValue)
  }

  function clearFromValue() {
    setFromValue('')
    setToValue('')
    setLastEdited('from')
  }

  function clearToValue() {
    setToValue('')
    setLastEdited('to')
  }

  function handleGetResult() {
    if (lastEdited === 'to') {
      const convertedValue = convertValue(category, toUnit, fromUnit, toValue)
      setFromValue(convertedValue)

      if (toValue.trim() && convertedValue !== '') {
        appendHistory(`${toValue} ${toUnit}`, `${convertedValue} ${fromUnit}`)
      }

      return
    }

    const convertedValue = convertValue(category, fromUnit, toUnit, fromValue)
    setToValue(convertedValue)

    if (fromValue.trim() && convertedValue !== '') {
      appendHistory(`${fromValue} ${fromUnit}`, `${convertedValue} ${toUnit}`)
    }
  }

  function handleSwapUnits() {
    const previousFromUnit = fromUnit
    const previousToUnit = toUnit
    const previousOutput = toValue

    setFromUnit(previousToUnit)
    setToUnit(previousFromUnit)
    setFromValue(previousOutput || fromValue)
    setToValue('')
    setLastEdited('from')
  }

  function appendHistory(sourceText, resultText) {
    setHistory((previous) => {
      const nextEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        category: categoryLabelByValue[category] ?? category,
        sourceText,
        resultText,
      }

      return [nextEntry, ...previous].slice(0, 12)
    })
  }

  return (
    <section className="unit-converter-section grid h-full min-h-0 gap-2 md:min-h-0">
      <div className="min-h-0">
        <div className="unit-converter-main glass-panel flex h-full min-h-0 flex-col p-4 sm:p-6">
          <h2 className="text-2xl font-semibold">Unit Converter</h2>
          <p className="unit-converter-subtitle mt-1 text-sm text-(--muted-text)">Live conversion for angle, area, data, energy, and more.</p>

          <div className="unit-converter-form mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="unit-converter-label text-sm font-medium">Category</label>
            <div className="unit-converter-category-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <select
                className="unit-converter-control neumorph-btn accent-dropdown w-full rounded-xl px-3 py-2"
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
              >
                <optgroup label="Common">
                  {commonCategories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Others">
                  {otherCategories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              </select>

              <button
                type="button"
                className="unit-converter-history-toggle neumorph-btn inline-flex items-center justify-center rounded-lg"
                onClick={() => setIsHistoryVisible((previous) => !previous)}
                title={isHistoryVisible ? 'Hide history' : 'Show history'}
                aria-label={isHistoryVisible ? 'Hide history' : 'Show history'}
                aria-expanded={isHistoryVisible}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div />

          <div className="unit-converter-units-grid md:col-span-2 grid items-end gap-2 grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] md:gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2">
              <label className="unit-converter-label text-sm font-medium">From</label>
              <select
                className="unit-converter-control neumorph-btn accent-dropdown w-full rounded-xl px-3 py-2"
                value={fromUnit}
                onChange={(event) => {
                  setFromUnit(event.target.value)
                  setToValue('')
                  setLastEdited('from')
                }}
              >
                {converterOptions[category].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="unit-converter-swap neumorph-btn h-11 rounded-xl px-4 text-lg font-semibold"
              onClick={handleSwapUnits}
              aria-label="Swap units"
              title="Swap units"
            >
              ⇄
            </button>

            <div className="space-y-2">
              <label className="unit-converter-label text-sm font-medium">To</label>
              <select
                className="unit-converter-control neumorph-btn accent-dropdown w-full rounded-xl px-3 py-2"
                value={toUnit}
                onChange={(event) => {
                  setToUnit(event.target.value)
                  setToValue('')
                  setLastEdited('from')
                }}
              >
                {converterOptions[category].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="unit-converter-values-grid md:col-span-2 grid items-end gap-2 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="space-y-2">
              <label className="unit-converter-label text-sm font-medium">Input ({fromUnit})</label>
              <div className="relative">
                <input
                  className="unit-converter-control neumorph-btn w-full rounded-xl px-3 py-2 pr-9"
                  value={fromValue}
                  onChange={(event) => handleFromValueChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleGetResult()
                    }
                  }}
                  placeholder={`Enter ${fromUnit} value`}
                />
                {fromValue && (
                  <button
                    type="button"
                    className="unit-converter-clear-btn absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold"
                    onClick={clearFromValue}
                    title="Clear input"
                    aria-label="Clear input"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              className="unit-converter-get neumorph-btn h-11 rounded-xl px-3 text-sm font-semibold"
              onClick={handleGetResult}
            >
              Get
            </button>

            <div className="space-y-2">
              <label className="unit-converter-label text-sm font-medium">Output ({toUnit})</label>
              <div className="relative">
                <input
                  className="unit-converter-control neumorph-btn w-full rounded-xl px-3 py-2 pr-9"
                  value={toValue}
                  onChange={(event) => handleToValueChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleGetResult()
                    }
                  }}
                  placeholder={`Enter ${toUnit} value`}
                />
                {toValue && (
                  <button
                    type="button"
                    className="unit-converter-clear-btn absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold"
                    onClick={clearToValue}
                    title="Clear output"
                    aria-label="Clear output"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          </div>

          {isHistoryVisible && (
            <section className="unit-converter-history mt-3 flex min-h-0 flex-col rounded-2xl border border-white/10 p-3" aria-live="polite">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">History</h3>
                <button
                  type="button"
                  className="neumorph-btn rounded-lg p-2"
                  onClick={() => setHistory([])}
                  title="Clear history"
                  aria-label="Clear history"
                >
                  <Eraser className="h-4 w-4" />
                </button>
              </div>

              <div className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {history.length === 0 && <p className="text-sm text-(--muted-text)">No conversions yet.</p>}

                {history.map((entry) => (
                  <article key={entry.id} className="neumorph-btn rounded-xl p-3">
                    <p className="text-xs text-(--muted-text)">{entry.category}</p>
                    <p className="mt-1 truncate text-sm font-medium">{entry.sourceText}</p>
                    <p className="truncate text-base font-semibold text-(--accent-color)">= {entry.resultText}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  )
}

export default UnitConverter
