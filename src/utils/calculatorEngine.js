import { all, create } from 'mathjs'

const math = create(all, {})

// Converts UI symbols into math.js friendly tokens.
export function normalizeExpression(rawExpression = '') {
  const subscriptMap = {
    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9',
    'ₓ': 'x',
    'ₙ': 'n',
  }

  const normalized = rawExpression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/π/g, 'pi')
    .replace(/\s+/g, '')
    .replace(/[₀₁₂₃₄₅₆₇₈₉ₓₙ]/g, (char) => subscriptMap[char] ?? char)
    .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')

  // Convert log base notation like log2(8) or logx(100) into log(8,2) / log(100,x).
  const withLogBase = normalized.replace(/log([a-zA-Z0-9.]+)\(([^()]+)\)/g, 'log($2,$1)')

  // Convert root base notation like root2(8) or rooty(x) into root(8,2) / root(x,y).
  return withLogBase.replace(/root([a-zA-Z0-9.]+)\(([^()]+)\)/gi, 'root($2,$1)')
}

// Auto-closes unbalanced opening parentheses for forgiving calculator input.
function autoCloseParentheses(expression) {
  let openCount = 0

  for (const char of expression) {
    if (char === '(') {
      openCount += 1
    } else if (char === ')' && openCount > 0) {
      openCount -= 1
    }
  }

  return openCount > 0 ? `${expression}${')'.repeat(openCount)}` : expression
}

// Provides angle-aware trigonometric functions for expression evaluation.
function getScopedFunctions(angleMode) {
  const inRadians = (value) => (angleMode === 'DEG' ? (value * Math.PI) / 180 : value)
  const toDegrees = (value) => (angleMode === 'DEG' ? (value * 180) / Math.PI : value)

  return {
    sin: (x) => Math.sin(inRadians(x)),
    cos: (x) => Math.cos(inRadians(x)),
    tan: (x) => Math.tan(inRadians(x)),
    asin: (x) => toDegrees(Math.asin(x)),
    acos: (x) => toDegrees(Math.acos(x)),
    atan: (x) => toDegrees(Math.atan(x)),
    log: (value, base) => (base === undefined ? Math.log10(value) : Math.log(value) / Math.log(base)),
    ln: (x) => Math.log(x),
    root: (x, y) => Math.pow(x, 1 / y),
    sqrt: (x) => Math.sqrt(x),
    cbrt: (x) => Math.cbrt(x),
  }
}

// Evaluates a calculator expression and returns a normalized numeric/string result.
export function evaluateExpression(rawExpression, angleMode = 'DEG') {
  const expression = normalizeExpression(autoCloseParentheses(rawExpression))

  if (!expression) {
    return { ok: false, error: 'Enter an expression.' }
  }

  try {
    const result = math.evaluate(expression, getScopedFunctions(angleMode))

    if (!Number.isFinite(Number(result)) && typeof result !== 'bigint') {
      return { ok: false, error: 'Math error.' }
    }

    return {
      ok: true,
      value: typeof result === 'number' ? Number(result.toPrecision(12)).toString() : String(result),
    }
  } catch {
    return { ok: false, error: 'Invalid expression.' }
  }
}

// Generates x-y points for plotting graph functions.
export function generateGraphPoints(rawExpression, angleMode = 'DEG') {
  const expression = normalizeExpression(autoCloseParentheses(rawExpression))

  if (!expression) {
    return []
  }

  const points = []
  const scoped = getScopedFunctions(angleMode)

  for (let x = -10; x <= 10; x += 0.2) {
    try {
      const y = math.evaluate(expression, { ...scoped, x })
      const numericY = Number(y)

      if (Number.isFinite(numericY)) {
        points.push({ x: Number(x.toFixed(2)), y: Number(numericY.toFixed(5)) })
      }
    } catch {
      // Skip invalid plot points so the graph remains interactive.
    }
  }

  return points
}
