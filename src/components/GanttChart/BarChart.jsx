import React from 'react'
import './BarChart.css'

const COLORS = [
  '#38bdf8','#818cf8','#34d399','#fbbf24','#fb7185',
  '#c084fc','#22d3ee','#a3e635','#f472b6','#fd8a5e',
]

export default function BarChart({ metrics }) {
  const maxVal = Math.max(
    ...metrics.map((m) => Math.max(m.waitingTime, m.turnaroundTime))
  ) || 1

  return (
    <div className="card barchart-card animate-in">
      <div className="card-title">
        Waiting vs Turnaround Time
        <div className="bc-legend">
          <span className="bc-legend-item">
            <span className="bc-dot wt-color" />WT
          </span>
          <span className="bc-legend-item">
            <span className="bc-dot tat-color" />TAT
          </span>
        </div>
      </div>
      <div className="barchart-body">
        {metrics.map((m, idx) => (
          <div key={m.pid} className="bc-row">
            <div
              className="bc-pid"
              style={{ color: COLORS[idx % COLORS.length] }}
            >
              {m.pid}
            </div>
            <div className="bc-bars">
              {/* Waiting Time bar */}
              <div className="bc-bar-wrap" title={`Waiting: ${m.waitingTime}`}>
                <div
                  className="bc-bar wt-bar"
                  style={{ width: `${(m.waitingTime / maxVal) * 100}%` }}
                />
                <span className="bc-bar-label">{m.waitingTime}</span>
              </div>
              {/* Turnaround bar */}
              <div className="bc-bar-wrap" title={`Turnaround: ${m.turnaroundTime}`}>
                <div
                  className="bc-bar tat-bar"
                  style={{ width: `${(m.turnaroundTime / maxVal) * 100}%` }}
                />
                <span className="bc-bar-label">{m.turnaroundTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
