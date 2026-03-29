import { useEffect, useMemo, useReducer } from 'react'
import { evaluateExpression } from '../utils/calculatorEngine'
import { getStoredHistory, saveHistory } from '../services/storageService'

const initialState = {
  expression: '',
  result: '0',
  preview: '',
  error: '',
  angleMode: 'DEG',
  memory: 0,
  history: getStoredHistory(),
}

// Formats large/small numeric values into scientific notation for compact preview display.
function formatPreviewValue(value) {
  const numeric = Number(value)

  if (!Number.isFinite(numeric)) {
    return value
  }

  const absValue = Math.abs(numeric)
  const shouldUseScientific = String(value).replace('-', '').length > 14 || (absValue !== 0 && (absValue >= 1e12 || absValue < 1e-6))

  return shouldUseScientific ? numeric.toExponential(8) : value
}

// Handles scientific calculator state transitions in one reducer.
function reducer(state, action) {
  switch (action.type) {
    case 'APPEND':
      return {
        ...state,
        expression: `${state.expression}${action.payload}`,
        error: '',
      }

    case 'SET_EXPRESSION':
      return {
        ...state,
        expression: action.payload,
        error: '',
      }

    case 'DELETE':
      return {
        ...state,
        expression: state.expression.slice(0, -1),
        error: '',
      }

    case 'CLEAR':
      return {
        ...state,
        expression: '',
        result: '0',
        preview: '',
        error: '',
        memory: 0,
      }

    case 'CLEAR_ENTRY':
      return {
        ...state,
        expression: '',
        preview: '',
        error: '',
      }

    case 'SET_PREVIEW':
      return {
        ...state,
        preview: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        preview: '',
      }

    case 'EVALUATE_SUCCESS':
      return {
        ...state,
        expression: action.payload,
        result: action.payload,
        preview: formatPreviewValue(action.payload),
        error: '',
      }

    case 'TOGGLE_ANGLE':
      return {
        ...state,
        angleMode: state.angleMode === 'DEG' ? 'RAD' : 'DEG',
      }

    case 'MEMORY_SET':
      return {
        ...state,
        memory: action.payload,
      }

    case 'PUSH_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 100),
      }

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      }

    default:
      return state
  }
}

// Encapsulates calculator business logic and interaction handlers.
export function useScientificCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const expressionToEvaluate = useMemo(() => state.expression || state.result, [state.expression, state.result])

  // Auto-preview gives instant result feedback while typing.
  useEffect(() => {
    if (!state.expression) {
      dispatch({ type: 'SET_PREVIEW', payload: '' })
      return
    }

    const evaluated = evaluateExpression(state.expression, state.angleMode)

    if (evaluated.ok) {
      dispatch({ type: 'SET_PREVIEW', payload: formatPreviewValue(evaluated.value) })
    }
  }, [state.expression, state.angleMode])

  // Persist history after every update.
  useEffect(() => {
    saveHistory(state.history)
  }, [state.history])

  // Keyboard support mirrors physical scientific calculator behavior.
  useEffect(() => {
    const keyMap = {
      '*': '×',
      '/': '÷',
    }

    const handleKeyDown = (event) => {
      const target = event.target
      const isEditableTarget =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

      // Let native editing keys work inside form fields to avoid double-deletes.
      if (isEditableTarget) {
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        evaluateCurrent()
        return
      }

      if (event.key === 'Backspace') {
        dispatch({ type: 'DELETE' })
        return
      }

      if (event.key === 'Escape') {
        dispatch({ type: 'CLEAR' })
        return
      }

      if (/^[0-9()+\-.%^*/]$/.test(event.key)) {
        dispatch({ type: 'APPEND', payload: keyMap[event.key] ?? event.key })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.expression, state.angleMode])

  // Runs expression parsing and pushes successful calculations into history.
  function evaluateCurrent() {
    const evaluated = evaluateExpression(expressionToEvaluate, state.angleMode)

    if (!evaluated.ok) {
      dispatch({ type: 'SET_ERROR', payload: evaluated.error })
      return
    }

    const historyItem = {
      id: crypto.randomUUID(),
      expression: expressionToEvaluate,
      result: evaluated.value,
      timestamp: new Date().toLocaleString(),
    }

    dispatch({ type: 'EVALUATE_SUCCESS', payload: evaluated.value })
    dispatch({ type: 'PUSH_HISTORY', payload: historyItem })
  }

  // Executes memory operations equivalent to handheld calculators.
  function runMemory(action) {
    const evaluated = evaluateExpression(expressionToEvaluate, state.angleMode)
    const currentValue = evaluated.ok ? Number(evaluated.value) : Number(state.result)

    if (Number.isNaN(currentValue)) {
      return
    }

    if (action === 'CLEAR') {
      dispatch({ type: 'MEMORY_SET', payload: 0 })
      return
    }

    if (action === 'RECALL') {
      dispatch({ type: 'APPEND', payload: String(state.memory) })
      return
    }

    const newMemory = action === 'ADD' ? state.memory + currentValue : state.memory - currentValue
    dispatch({ type: 'MEMORY_SET', payload: Number(newMemory.toFixed(8)) })
  }

  return {
    state,
    append: (value) => dispatch({ type: 'APPEND', payload: value }),
    setExpression: (value) => dispatch({ type: 'SET_EXPRESSION', payload: value }),
    clear: () => dispatch({ type: 'CLEAR' }),
    removeLast: () => dispatch({ type: 'DELETE' }),
    evaluateCurrent,
    toggleAngle: () => dispatch({ type: 'TOGGLE_ANGLE' }),
    runMemory,
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
  }
}
