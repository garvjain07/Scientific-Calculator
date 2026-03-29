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
    <main className="h-dvh min-h-dvh overflow-hidden px-0 py-0 xl:min-h-screen xl:overflow-y-auto xl:px-2 xl:py-2">
      <div className="mobile-calc-frame mx-auto flex h-full min-h-0 w-full flex-col gap-0 xl:gap-1 xl:max-w-none">
        <motion.header
          className="app-header glass-panel relative z-40 flex items-center justify-between gap-1.5 px-1.5 py-1 xl:gap-2 xl:px-2.5 xl:py-1.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex min-w-0 items-center gap-1.5 xl:gap-2">
            <img
              src={brandLogo}
              alt="Adinath Group logo"
              className="app-header-logo h-7 w-7 rounded-full object-cover xl:h-9 xl:w-9"
            />
            <div className="min-w-0">
              <p className="app-header-brand text-[8px] uppercase tracking-[0.14em] text-(--muted-text) xl:text-[9px] xl:tracking-[0.18em]">Adinath Group</p>
              <h1 className="app-header-title truncate text-sm font-semibold xl:text-lg">Scientific Calculator</h1>
            </div>
          </div>

          <div className="flex items-center gap-1 xl:gap-1.5">
            <div className="flex items-center gap-0.5 rounded-xl border border-white/20 bg-white/10 p-0.5 xl:gap-1 dark:border-white/10 dark:bg-black/20">
              {views.map((view) => {
                const Icon = view.icon

                return (
                  <button
                    key={view.id}
                    className={`tab-button ${activeView === view.id ? 'active' : ''}`}
                    onClick={() => setActiveView(view.id)}
                    type="button"
                  >
                    <Icon className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
                    <span className="hidden xl:inline">{view.label}</span>
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
            className="flex-1 min-h-0 overflow-hidden"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeContent}
          </motion.section>
        </AnimatePresence>

        <footer className="glass-panel hidden px-3 py-1.5 text-center text-xs text-(--muted-text) xl:block">
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
