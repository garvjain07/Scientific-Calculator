import { motion } from 'framer-motion'
import { basicPadRows, scientificButtons } from '../utils/constants'

const kindStyles = {
  number: 'text-[var(--text-main)]',
  operator: 'text-cyan-500 dark:text-cyan-300',
  science: 'text-amber-500 dark:text-amber-300',
  memory: 'text-emerald-500 dark:text-emerald-300',
  danger: 'text-rose-500 dark:text-rose-300',
  equal: 'calc-equal-btn font-bold',
}

// Renders responsive scientific keypad and forwards button actions.
function CalculatorKeypad({ onAction }) {
  const allButtons = [...scientificButtons, ...basicPadRows.flat()]
  const labelToButton = Object.fromEntries(allButtons.map((button) => [button.label, button]))

  const mobileRows = [
    ['MC', 'MR', 'M+', 'M-', 'Deg/Rad', 'AC'],
    ['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'],
    ['x²', 'x³', 'xʸ', '1/x', '10ˣ', '⌫'],
    ['CE', 'e', '(', ')', '%', '/'],
    ['logₓ', 'π', '7', '8', '9', '×'],
    ['ln x', '√', '4', '5', '6', '−'],
    ['log', '∛', '1', '2', '3', '+'],
    ['n!', 'ⁿ√x', '00', '0', '.', '='],
  ]

  const desktopRows = [
    ['Deg/Rad', 'sin', 'sin⁻¹', 'x²', 'n!', 'AC', '×', '1', '2', '3'],
    ['MC', 'cos', 'cos⁻¹', 'x³', '(', ')', '/', '4', '5', '6'],
    ['MR', 'tan', 'tan⁻¹', 'xʸ', 'ⁿ√x', 'CE', '+', '7', '8', '9'],
    ['M+', 'log', 'ln x', '1/x', '√', 'π', '−', '00', '0', '.'],
    ['M-', 'logₓ', 'e', '10ˣ', '∛', '⌫', '%', { label: '=', span: 3 }],
  ]

  const renderButton = (button, key, extraClass = '') => (
    <motion.button
      key={key}
      type="button"
      className={`neumorph-btn calc-key-btn rounded-md font-semibold ${extraClass} ${['+', '−', '×', '/', '%'].includes(button.label) ? 'calc-key-op font-extrabold' : ''} ${kindStyles[button.kind]}`}
      onClick={() => onAction(button)}
      whileTap={{ scale: 0.96 }}
    >
      {button.label}
    </motion.button>
  )

  const renderRow = (row, rowIndex, prefix) =>
    row.map((cell, buttonIndex) => {
      if (!cell) {
        return <div key={`${prefix}-empty-${rowIndex}-${buttonIndex}`} aria-hidden="true" />
      }

      const label = typeof cell === 'string' ? cell : cell.label
      const span = typeof cell === 'string' ? 1 : cell.span ?? 1
      const spanClass = span === 3 ? 'col-span-3' : span === 2 ? 'col-span-2' : ''
      const button = labelToButton[label]

      if (!button) {
        return <div key={`${prefix}-missing-${rowIndex}-${buttonIndex}`} aria-hidden="true" />
      }

      return renderButton(button, `${prefix}-${rowIndex}-${buttonIndex}-${label}`, spanClass)
    })

  return (
    <div className="grid gap-1.5 xl:h-full">
      <div className="grid grid-cols-6 gap-1.5 xl:hidden">
        {mobileRows.map((row, rowIndex) => (
          <div key={`mobile-row-${rowIndex}`} className="contents">
            {renderRow(row, rowIndex, 'mobile')}
          </div>
        ))}
      </div>

      <div className="calc-key-grid-desktop hidden xl:grid xl:grid-cols-10 xl:h-full xl:auto-rows-fr gap-1.5">
        {desktopRows.map((row, rowIndex) => (
          <div key={`desktop-row-${rowIndex}`} className="contents">
            {renderRow(row, rowIndex, 'desktop')}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalculatorKeypad
