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
  const labelToButton = Object.fromEntries(scientificButtons.map((button) => [button.label, button]))

  const memoryButtons = ['MC', 'MR', 'M+', 'M-'].map((label) => labelToButton[label]).filter(Boolean)
  const trigButtons = ['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'].map((label) => labelToButton[label]).filter(Boolean)
  const logButtons = ['Deg/Rad', 'log', 'logₓ', 'ln x'].map((label) => labelToButton[label]).filter(Boolean)
  const xButtons = ['x²', 'x³', 'xʸ', '1/x', '10ˣ'].map((label) => labelToButton[label]).filter(Boolean)

  // Requested custom utility matrix:
  // ( ) AC
  // root1 n! CE
  // root2 pi e
  // root3 backspace(backspace takes two button spaces)
  const utilityRows = [
    ['(', ')', 'AC'],
    ['ⁿ√x', 'n!', 'CE'],
    ['√', 'π', 'e'],
    ['∛', '⌫'],
  ]

  const renderButton = (button, key) => (
    <motion.button
      key={key}
      type="button"
      className={`neumorph-btn h-7 rounded-lg px-1 text-[11px] font-semibold sm:h-full sm:min-h-11 sm:text-base ${button.fullRow ? 'col-span-3' : ''} ${button.span2 ? 'col-span-2' : ''} ${['+', '−', '×', '/', '%'].includes(button.label) ? 'text-base font-extrabold sm:text-2xl' : ''} ${kindStyles[button.kind]}`}
      onClick={() => onAction(button)}
      whileTap={{ scale: 0.96 }}
    >
      {button.label}
    </motion.button>
  )

  return (
    <div className="grid gap-1 xl:h-full xl:gap-2 xl:grid-cols-[110px_120px_1fr_340px]">
      <div className="grid auto-rows-auto grid-cols-2 gap-1 sm:auto-rows-fr sm:grid-cols-4 xl:h-full xl:grid-cols-1 sm:gap-1.5">
        {memoryButtons.map((button, index) => renderButton(button, `memory-${button.label}-${index}`))}
      </div>

      <div className="grid auto-rows-auto grid-cols-2 gap-1 sm:auto-rows-fr sm:grid-cols-3 xl:h-full xl:grid-cols-1 sm:gap-1.5">
        {trigButtons.map((button, index) => renderButton(button, `trig-${button.label}-${index}`))}
      </div>

      <div className="grid gap-1 sm:gap-1.5 md:grid-cols-[110px_110px_1fr] xl:h-full">
        <div className="grid auto-rows-auto grid-cols-1 gap-1 sm:auto-rows-fr sm:gap-1.5 xl:h-full">
          {logButtons.map((button, index) => renderButton(button, `log-${button.label}-${index}`))}
        </div>

        <div className="grid auto-rows-auto grid-cols-1 gap-1 sm:auto-rows-fr sm:gap-1.5 xl:h-full">
          {xButtons.map((button, index) => renderButton(button, `x-${button.label}-${index}`))}
        </div>

        <div className="grid grid-rows-[auto_auto_auto_auto] auto-rows-auto gap-1 sm:auto-rows-fr sm:gap-1.5 xl:h-full">
          {utilityRows.map((row, rowIndex) => (
            <div key={`utility-row-${rowIndex}`} className="grid grid-cols-3 gap-1 sm:gap-1.5">
              {row.map((label, buttonIndex) => {
                const button = labelToButton[label]

                if (!button) {
                  return <div key={`empty-${rowIndex}-${buttonIndex}`} />
                }

                return renderButton(button, `utility-${rowIndex}-${buttonIndex}-${label}`)
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid auto-rows-auto gap-1 sm:auto-rows-fr sm:gap-1.5 xl:h-full">
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 xl:h-full">
          {basicPadRows[0].map((button, index) => renderButton(button, `basic-row-0-${index}`))}
        </div>

        {basicPadRows.slice(1).map((row, rowIndex) => (
          <div
            key={`basic-row-${rowIndex + 1}`}
            className={`grid gap-1 sm:gap-1.5 ${row.length === 1 ? 'grid-cols-1' : row.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
          >
            {row.map((button, index) => renderButton(button, `basic-row-${rowIndex + 1}-${index}`))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalculatorKeypad
