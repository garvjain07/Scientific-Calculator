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

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw new Error('Invalid factorial')
  }

  let result = 1
  for (let index = 2; index <= value; index += 1) {
    result *= index
  }
  return result
}

// Parses a deliberately small expression language; no arbitrary properties or code are evaluated.
function parseExpression(rawExpression, angleMode, variables = {}) {
  if (rawExpression.length > 500) {
    throw new Error('Expression too long')
  }

  const source = normalizeExpression(autoCloseParentheses(rawExpression))
  const tokens = []
  let index = 0

  while (index < source.length) {
    const character = source[index]
    if (/\s/.test(character)) {
      index += 1
    } else if ('+-*/^%!(),'.includes(character)) {
      tokens.push(character)
      index += 1
    } else if (/[0-9.]/.test(character)) {
      const match = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i)
      if (!match) {
        throw new Error('Invalid number')
      }
      tokens.push({ type: 'number', value: Number(match[0]) })
      index += match[0].length
    } else if (/[a-zA-Z]/.test(character)) {
      const match = source.slice(index).match(/^([a-zA-Z]+)/)
      tokens.push({ type: 'identifier', value: match[0].toLowerCase() })
      index += match[0].length
    } else {
      throw new Error('Invalid character')
    }
  }
  tokens.push({ type: 'end' })

  const scoped = getScopedFunctions(angleMode)
  const functions = {
    sin: scoped.sin,
    cos: scoped.cos,
    tan: scoped.tan,
    asin: scoped.asin,
    acos: scoped.acos,
    atan: scoped.atan,
    log: scoped.log,
    ln: scoped.ln,
    root: scoped.root,
    sqrt: scoped.sqrt,
    cbrt: scoped.cbrt,
  }
  let position = 0

  function peek() {
    return tokens[position]
  }

  function consume(value) {
    if (peek() === value) {
      position += 1
      return true
    }
    return false
  }

  function parsePrimary() {
    const token = peek()

    if (typeof token === 'object' && token.type === 'number') {
      position += 1
      return token.value
    }

    if (typeof token === 'object' && token.type === 'identifier') {
      position += 1
      if (token.value === 'pi') return Math.PI
      if (token.value === 'e') return Math.E
      if (Object.hasOwn(variables, token.value)) return variables[token.value]

      if (!consume('(')) {
        throw new Error('Invalid identifier')
      }

      const args = []
      if (peek() !== ')') {
        args.push(parseExpressionLevel())
        while (consume(',')) {
          args.push(parseExpressionLevel())
        }
      }

      if (!consume(')')) {
        throw new Error('Missing parenthesis')
      }
      if (!Object.hasOwn(functions, token.value)) {
        throw new Error('Unknown function')
      }
      return functions[token.value](...args)
    }

    if (consume('(')) {
      const value = parseExpressionLevel()
      if (!consume(')')) {
        throw new Error('Missing parenthesis')
      }
      return value
    }

    throw new Error('Invalid expression')
  }

  function parsePostfix() {
    let value = parsePrimary()
    while (true) {
      if (consume('!')) {
        value = factorial(value)
      } else if (consume('%')) {
        value /= 100
      } else {
        break
      }
    }
    return value
  }

  function parseUnary() {
    if (consume('+')) return parseUnary()
    if (consume('-')) return -parseUnary()
    return parsePower()
  }

  function parsePower() {
    const base = parsePostfix()
    if (consume('^')) {
      return Math.pow(base, parseUnary())
    }
    return base
  }

  function parseTerm() {
    let value = parseUnary()
    while (true) {
      if (consume('*')) {
        value *= parseUnary()
      } else if (consume('/')) {
        const divisor = parseUnary()
        if (divisor === 0) throw new Error('Division by zero')
        value /= divisor
      } else if (
        peek() === '(' ||
        (typeof peek() === 'object' && (peek().type === 'number' || peek().type === 'identifier'))
      ) {
        value *= parseUnary()
      } else {
        break
      }
    }
    return value
  }

  function parseExpressionLevel() {
    let value = parseTerm()
    while (true) {
      if (consume('+')) {
        value += parseTerm()
      } else if (consume('-')) {
        value -= parseTerm()
      } else {
        break
      }
    }
    return value
  }

  const value = parseExpressionLevel()
  if (peek()?.type !== 'end') {
    throw new Error('Invalid expression')
  }
  if (!Number.isFinite(value)) {
    throw new Error('Math error')
  }
  return value
}

// Evaluates a calculator expression and returns a normalized numeric/string result.
export function evaluateExpression(rawExpression, angleMode = 'DEG') {
  if (!rawExpression?.trim()) {
    return { ok: false, error: 'Enter an expression.' }
  }

  try {
    const result = parseExpression(rawExpression, angleMode)
    return { ok: true, value: Number(result.toPrecision(12)).toString() }
  } catch (error) {
    return {
      ok: false,
      error: error.message === 'Division by zero' || error.message === 'Math error' ? 'Math error.' : 'Invalid expression.',
    }
  }
}

// Generates x-y points for plotting graph functions.
export function generateGraphPoints(rawExpression, angleMode = 'DEG') {
  const points = []

  for (let x = -10; x <= 10; x += 0.2) {
    try {
      const y = parseExpression(rawExpression, angleMode, { x })
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
