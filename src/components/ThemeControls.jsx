import { useEffect, useRef, useState } from 'react'
import { Moon, Palette, Sun } from 'lucide-react'
import { accentPalette } from '../utils/constants'

// Controls dark-light mode and accent color personalization.
function ThemeControls({ theme, onThemeChange, accent, onAccentChange }) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const paletteRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!paletteRef.current?.contains(event.target)) {
        setIsPaletteOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
        className="tab-button rounded-lg border border-white/20 bg-white/10 p-1.5 dark:border-white/10 dark:bg-black/20"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>

      <div ref={paletteRef} className="relative">
        <button
          type="button"
          onClick={() => setIsPaletteOpen((current) => !current)}
          className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-1.5 py-1 dark:border-white/10 dark:bg-black/20"
          title="Choose accent color"
          aria-expanded={isPaletteOpen}
          aria-label="Choose accent color"
        >
          <Palette className="h-3.5 w-3.5" />
          <span
            className="h-4 w-4 rounded-full border border-white/70"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
        </button>

        {isPaletteOpen ? (
          <div className="absolute right-0 top-full z-80 mt-1.5 flex items-center gap-1 rounded-lg border border-white/20 bg-white/95 p-1.5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
            {accentPalette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onAccentChange(color)
                  setIsPaletteOpen(false)
                }}
                className={`h-4 w-4 rounded-full border ${accent === color ? 'border-white ring-1 ring-black/35 dark:ring-white/35' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                title={`Accent ${color}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ThemeControls
