import { useMemo, useState } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { Line } from 'react-chartjs-2'
import { generateGraphPoints } from '../utils/calculatorEngine'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, zoomPlugin)

// Renders an interactive function plotter with zoom and pan.
function GraphingPanel() {
  const [functionInput, setFunctionInput] = useState('x^2')
  const [angleMode, setAngleMode] = useState('RAD')

  const points = useMemo(() => generateGraphPoints(functionInput, angleMode), [functionInput, angleMode])

  const data = {
    labels: points.map((point) => point.x),
    datasets: [
      {
        label: `y = ${functionInput}`,
        data: points.map((point) => point.y),
        borderColor: 'rgba(45, 212, 191, 1)',
        backgroundColor: 'rgba(45, 212, 191, 0.25)',
        tension: 0.23,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      zoom: {
        pan: { enabled: true, mode: 'xy' },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
        },
      },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 10 } },
      y: { ticks: { maxTicksLimit: 8 } },
    },
  }

  return (
    <section className="glass-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-55 flex-1">
          <label className="text-sm font-medium">Function (use x)</label>
          <input
            className="neumorph-btn mt-1 w-full rounded-xl px-3 py-2"
            value={functionInput}
            onChange={(event) => setFunctionInput(event.target.value)}
            placeholder="sin(x), x^2 + 3*x"
          />
        </div>

        <button
          type="button"
          className="neumorph-btn rounded-xl px-4 py-2 text-sm font-semibold"
          onClick={() => setAngleMode((mode) => (mode === 'DEG' ? 'RAD' : 'DEG'))}
        >
          Angle: {angleMode}
        </button>
      </div>

      <div className="h-105 rounded-2xl border border-white/20 bg-white/10 p-2 dark:border-white/10 dark:bg-black/20">
        <Line data={data} options={options} />
      </div>
    </section>
  )
}

export default GraphingPanel
