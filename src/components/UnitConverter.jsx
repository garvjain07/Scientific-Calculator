import { useEffect, useMemo, useState } from 'react'
import { Eraser } from 'lucide-react'
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
  const [toValue, setToValue] = useState(() => convertValue(defaultCategory, defaultUnits[0], defaultUnits[1], '1'))
  const [lastEdited, setLastEdited] = useState('from')
  const [history, setHistory] = useState([])

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

  useEffect(() => {
    if (lastEdited === 'to') {
      setFromValue(convertValue(category, toUnit, fromUnit, toValue))
      return
    }

    setToValue(convertValue(category, fromUnit, toUnit, fromValue))
  }, [category, fromUnit, toUnit, fromValue, toValue, lastEdited])

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory)
    const [first, second] = converterOptions[nextCategory]
    setFromUnit(first)
    setToUnit(second)
  }

  function handleFromValueChange(nextValue) {
    const convertedValue = convertValue(category, fromUnit, toUnit, nextValue)

    setLastEdited('from')
    setFromValue(nextValue)
    setToValue(convertedValue)

    if (nextValue.trim() && convertedValue !== '') {
      appendHistory(`${nextValue} ${fromUnit}`, `${convertedValue} ${toUnit}`)
    }
  }

  function handleToValueChange(nextValue) {
    const convertedValue = convertValue(category, toUnit, fromUnit, nextValue)

    setLastEdited('to')
    setToValue(nextValue)
    setFromValue(convertedValue)

    if (nextValue.trim() && convertedValue !== '') {
      appendHistory(`${nextValue} ${toUnit}`, `${convertedValue} ${fromUnit}`)
    }
  }

  function handleSwapUnits() {
    appendHistory(`${fromValue} ${fromUnit}`, `${toValue} ${toUnit}`)
    setLastEdited('from')
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
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
    <section className="grid h-full gap-2 md:min-h-0 xl:grid-cols-[1fr_280px]">
      <div className="min-h-0">
        <div className="glass-panel flex h-full min-h-0 flex-col p-4 sm:p-6">
          <h2 className="text-2xl font-semibold">Unit Converter</h2>
          <p className="mt-1 text-sm text-(--muted-text)">Live conversion for angle, area, data, energy, and more.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              className="neumorph-btn accent-dropdown w-full rounded-xl px-3 py-2"
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
          </div>

          <div />

          <div className="md:col-span-2 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                className="neumorph-btn accent-dropdown w-full rounded-xl px-3 py-2"
                value={fromUnit}
                onChange={(event) => {
                  setLastEdited('from')
                  setFromUnit(event.target.value)
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
              className="neumorph-btn h-11 rounded-xl px-4 text-lg font-semibold"
              onClick={handleSwapUnits}
              aria-label="Swap units"
              title="Swap units"
            >
              ⇄
            </button>

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                className="neumorph-btn accent-dropdown w-full rounded-xl px-3 py-2"
                value={toUnit}
                onChange={(event) => {
                  setLastEdited('to')
                  setToUnit(event.target.value)
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

          <div className="md:col-span-2 grid gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input ({fromUnit})</label>
              <input
                className="neumorph-btn w-full rounded-xl px-3 py-2"
                value={fromValue}
                onChange={(event) => handleFromValueChange(event.target.value)}
                placeholder={`Enter ${fromUnit} value`}
              />
            </div>

            <div className="hidden md:block" aria-hidden="true" />

            <div className="space-y-2">
              <label className="text-sm font-medium">Output ({toUnit})</label>
              <input
                className="neumorph-btn w-full rounded-xl px-3 py-2"
                value={toValue}
                onChange={(event) => handleToValueChange(event.target.value)}
                placeholder={`Enter ${toUnit} value`}
              />
            </div>
          </div>

          </div>
        </div>
      </div>

      <aside className="glass-panel flex h-full min-h-0 flex-col p-3">
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
      </aside>
    </section>
  )
}

export default UnitConverter
