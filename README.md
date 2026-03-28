# Advanced Scientific Calculator Web Application

Modern scientific calculator built with React and Tailwind on Vite, featuring scientific operations, expression parsing, graph plotting, memory controls, history management, CSV export, and a real-time unit converter.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Framer Motion
- math.js
- Chart.js + react-chartjs-2 + chartjs-plugin-zoom

## Features

- Basic arithmetic: +, -, x, /, %, ( )
- Scientific functions: sin, cos, tan, asin, acos, atan, log, ln, sqrt, cbrt, power, factorial
- Degree/Radian mode toggle
- Expression parser for input like 2+3*sin(45)
- Memory system: MC, MR, M+, M-
- Calculation history with reuse, clear, and CSV export
- Result copy to clipboard
- Keyboard support: Enter, Escape, Backspace, number/operator keys
- Optional voice input using browser speech recognition
- Graphing mode with function plotting, zoom, and pan
- Unit converter for length, weight, and temperature
- Dark/Light mode and custom accent colors
- Glassmorphism + neumorphism responsive UI

## Folder Structure

src/
	components/
	hooks/
	pages/
	services/
	styles/
	utils/

## Run Locally

npm install
npm run dev

## Build

npm run build

## Notes

- Voice input depends on browser SpeechRecognition support.
- History and UI preferences are stored in localStorage.
