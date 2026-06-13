import React from 'react'
import './MetricsCard.css'

const statList = [
  {
    key: 'avgWT',
    label: 'Avg Waiting Time',
    unit: 'units',
    color: '--yellow',
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
    color: '--violet',
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
    color: '--green',
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
    color: '--blue',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

// throughput needs more decimal places since it's usually a small fraction
function formatStat(key, value) {
  if (key === 'throughput') return value.toFixed(4)
  if (key === 'cpuUtilization') return value.toFixed(1)
  return value.toFixed(2)
}

export default function MetricsCard({ stats }) {
  return (
    <div className="metrics-grid animate-in">
      {statList.map((s) => {
        const value = stats[s.key]
        return (
          <div key={s.key} className="metric-tile card" style={{ '--tile-color': `var(${s.color})` }}>
            <div className="metric-icon">{s.icon}</div>
            <div className="metric-body">
              <div className="metric-value">
                {formatStat(s.key, value)}
                <span className="metric-unit">{s.unit}</span>
              </div>
              <div className="metric-label">{s.label}</div>
            </div>
            {s.key === 'cpuUtilization' && (
              <div className="cpu-bar-wrap">
                <div className="cpu-bar-fill" style={{ width: `${Math.min(value, 100)}%` }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}