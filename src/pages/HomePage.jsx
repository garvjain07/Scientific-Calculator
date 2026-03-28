import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftRight, Calculator } from 'lucide-react'
import brandLogo from '../assets/logo.jpg'
import CalculatorPanel from '../components/CalculatorPanel'
import ThemeControls from '../components/ThemeControls'
import UnitConverter from '../components/UnitConverter'
import { getSavedPreference, savePreference } from '../services/storageService'

const views = [
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'converter', label: 'Converter', icon: ArrowLeftRight },
]

// Hosts top-level navigation between calculator, graph, and converter tools.
function HomePage() {
  const [activeView, setActiveView] = useState('calculator')
  const [theme, setTheme] = useState(() => getSavedPreference('theme', 'dark'))
  const [accent, setAccent] = useState(() => getSavedPreference('accent', '#2dd4bf'))

  // Sync theme and accent to CSS variables and persistent storage.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.setProperty('--accent-color', accent)
    savePreference('theme', theme)
    savePreference('accent', accent)
  }, [theme, accent])

  const activeContent = useMemo(() => {
    if (activeView === 'converter') {
      return <UnitConverter />
    }

    return <CalculatorPanel />
  }, [activeView])

  return (
    <main className="min-h-screen overflow-y-auto px-1.5 py-1.5 md:h-screen md:overflow-hidden sm:px-2 sm:py-2">
      <div className="mx-auto flex min-h-screen w-full max-w-none flex-col gap-1 md:h-full md:min-h-0">
        <motion.header
          className="glass-panel relative z-40 flex items-center justify-between gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={brandLogo}
              alt="Adinath Group logo"
              className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            />
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.18em] text-(--muted-text)">Adinath Group</p>
              <h1 className="truncate text-base font-semibold sm:text-lg">Scientific Calculator</h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-xl border border-white/20 bg-white/10 p-0.5 dark:border-white/10 dark:bg-black/20">
              {views.map((view) => {
                const Icon = view.icon

                return (
                  <button
                    key={view.id}
                    className={`tab-button ${activeView === view.id ? 'active' : ''}`}
                    onClick={() => setActiveView(view.id)}
                    type="button"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{view.label}</span>
                  </button>
                )
              })}
            </div>
            <ThemeControls theme={theme} onThemeChange={setTheme} accent={accent} onAccentChange={setAccent} />
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.section
            key={activeView}
            className="flex-1 md:min-h-0 md:overflow-hidden"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeContent}
          </motion.section>
        </AnimatePresence>

        <footer className="glass-panel px-3 py-1.5 text-center text-xs text-(--muted-text)">
          <p>
            &copy; 2026 Adinath Group. All rights are reserved | Contact{' '}
            <a className="text-(--accent-color) underline" href="mailto:jaingroup008@gmail.com">
              jaingroup008@gmail.com
            </a>
          </p>
          <p className="mt-0.5">Made with &hearts; in India</p>
        </footer>
      </div>
    </main>
  )
}

export default HomePage
