// Starts speech recognition and streams transcript text through callbacks.
export function startVoiceCapture(onText, onError) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!Recognition) {
    onError?.('Voice input is not supported in this browser.')
    return null
  }

  const recognition = new Recognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript ?? ''
    onText?.(transcript)
  }

  recognition.onerror = () => {
    onError?.('Voice recognition failed. Try again.')
  }

  recognition.start()

  return recognition
}
