import React from 'react'
import './MetricsCard.css'

const STAT_CONFIG = [
  {
    key: 'avgWT',
    label: 'Avg Waiting Time',
    unit: 'units',
    color: '--accent-amber',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    key: 'avgTAT',
    label: 'Avg Turnaround Time',
    unit: 'units',
    color: '--accent-violet',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
  },
  {
    key: 'cpuUtilization',
    label: 'CPU Utilization',
    unit: '%',
    color: '--accent-emerald',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    key: 'throughput',
    label: 'Throughput',
    unit: 'proc/unit',
    color: '--accent-blue',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

export default function MetricsCard({ stats }) {
  return (
    <div className="metrics-grid animate-in">
      {STAT_CONFIG.map((cfg) => {
        const raw = stats[cfg.key]
        const formatted =
          cfg.key === 'throughput'
            ? raw.toFixed(4)
            : cfg.key === 'cpuUtilization'
            ? raw.toFixed(1)
            : raw.toFixed(2)

        return (
          <div key={cfg.key} className="metric-tile card" style={{ '--tile-color': `var(${cfg.color})` }}>
            <div className="metric-icon">{cfg.icon}</div>
            <div className="metric-body">
              <div className="metric-value">
                {formatted}
                <span className="metric-unit">{cfg.unit}</span>
              </div>
              <div className="metric-label">{cfg.label}</div>
            </div>
            {cfg.key === 'cpuUtilization' && (
              <div className="cpu-bar-wrap">
                <div
                  className="cpu-bar-fill"
                  style={{ width: `${Math.min(raw, 100)}%` }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
