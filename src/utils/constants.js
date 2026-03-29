// Defines left-side advanced scientific controls.
export const scientificButtons = [
  { label: 'MC', action: 'MEMORY_CLEAR', kind: 'memory' },
  { label: 'MR', action: 'MEMORY_RECALL', kind: 'memory' },
  { label: 'M+', action: 'MEMORY_ADD', kind: 'memory' },
  { label: 'M-', action: 'MEMORY_SUBTRACT', kind: 'memory' },
  { label: '(', value: '(', kind: 'operator' },
  { label: ')', value: ')', kind: 'operator' },
  { label: 'AC', action: 'CLEAR', kind: 'danger' },
  { label: 'CE', action: 'CLEAR_ENTRY', kind: 'danger' },
  { label: 'sin', value: 'sin(', kind: 'science' },
  { label: 'cos', value: 'cos(', kind: 'science' },
  { label: 'tan', value: 'tan(', kind: 'science' },
  { label: 'log', value: 'log(', kind: 'science' },
  { label: 'logₓ', value: 'logₓ(', kind: 'science' },
  { label: 'ln x', value: 'ln(', kind: 'science' },
  { label: 'sin⁻¹', value: 'asin(', kind: 'science' },
  { label: 'cos⁻¹', value: 'acos(', kind: 'science' },
  { label: 'tan⁻¹', value: 'atan(', kind: 'science' },
  { label: 'x²', value: '^2', kind: 'science' },
  { label: 'x³', value: '^3', kind: 'science' },
  { label: 'xʸ', value: '^', kind: 'science' },
  { label: 'ⁿ√x', template: 'root2(', cursorOffsetFromEnd: 2, selectionLength: 1, kind: 'science' },
  { label: '√', value: 'sqrt(', kind: 'science' },
  { label: '∛', value: 'cbrt(', kind: 'science' },
  { label: '1/x', value: '1/(', kind: 'science' },
  { label: '10ˣ', value: '10^(', kind: 'science' },
  { label: 'n!', value: '!', kind: 'science' },
  { label: 'π', value: 'π', kind: 'science' },
  { label: 'e', value: 'e', kind: 'science' },
  { label: 'Deg/Rad', action: 'TOGGLE_ANGLE', kind: 'memory' },
  { label: '⌫', action: 'DELETE', kind: 'danger', span2: true },
]

// Defines right-side basic keypad as requested: symbols and 123/456/789/0.
export const basicPadRows = [
  [
    { label: '%', value: '%', kind: 'operator' },
    { label: '×', value: '×', kind: 'operator' },
    { label: '/', value: '/', kind: 'operator' },
    { label: '+', value: '+', kind: 'operator' },
    { label: '−', value: '-', kind: 'operator' },
  ],
  [
    { label: '1', value: '1', kind: 'number' },
    { label: '2', value: '2', kind: 'number' },
    { label: '3', value: '3', kind: 'number' },
  ],
  [
    { label: '4', value: '4', kind: 'number' },
    { label: '5', value: '5', kind: 'number' },
    { label: '6', value: '6', kind: 'number' },
  ],
  [
    { label: '7', value: '7', kind: 'number' },
    { label: '8', value: '8', kind: 'number' },
    { label: '9', value: '9', kind: 'number' },
  ],
  [
    { label: '00', value: '00', kind: 'number' },
    { label: '0', value: '0', kind: 'number' },
    { label: '.', value: '.', kind: 'number' },
  ],
  [
    { label: '=', action: 'EVALUATE', kind: 'equal', fullRow: true },
  ],
]

export const accentPalette = ['#2dd4bf', '#ef4444', '#f59e0b', '#22c55e', '#0ea5e9', '#d946ef']
