const HISTORY_KEY = 'scicalc_history_v1'

// Reads generic UI preference by key with fallback.
export function getSavedPreference(key, fallback) {
  try {
    const value = localStorage.getItem(`scicalc_pref_${key}`)
    return value ?? fallback
  } catch {
    return fallback
  }
}

// Stores generic UI preference by key.
export function savePreference(key, value) {
  try {
    localStorage.setItem(`scicalc_pref_${key}`, value)
  } catch {
    // Ignore storage failures to keep app interactive.
  }
}

// Loads calculator history from localStorage.
export function getStoredHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

// Persists calculator history in localStorage.
export function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Ignore storage failures to avoid blocking calculations.
  }
}
