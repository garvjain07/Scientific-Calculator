# Advanced Scientific Calculator Web Application

Modern scientific calculator built with React and Tailwind on Vite, featuring scientific operations, expression parsing, memory controls, history management, CSV export, and a real-time unit converter.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Local, dependency-light expression parser

## Features

- Basic arithmetic: +, -, x, /, %, ( )
- Scientific functions: sin, cos, tan, asin, acos, atan, log, ln, sqrt, cbrt, power, factorial
- Degree/Radian mode toggle
- Expression parser for input like 2+3*sin(45)
- Memory system: MC, MR, M+, M-
- Calculation history with reuse, clear, and CSV export
- Result copy to clipboard
- Keyboard support: Enter, Escape, Backspace, number/operator keys
- Unit converter for length, weight, and temperature
- Dark/Light mode and custom accent colors
- Glassmorphism + neumorphism responsive UI

## Folder Structure

```text
src/
	components/
	hooks/
	pages/
	services/
	styles/
	utils/
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- History and UI preferences are stored only in localStorage in the browser.
- Expressions are parsed with a restricted evaluator; arbitrary JavaScript and property access are not supported.
- CSV exports escape spreadsheet formula prefixes to reduce formula-injection risk.
