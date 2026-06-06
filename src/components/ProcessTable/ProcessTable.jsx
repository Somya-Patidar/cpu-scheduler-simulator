import React, { useState } from 'react'
import './ProcessTable.css'

const COLORS = [
  '#38bdf8','#818cf8','#34d399','#fbbf24','#fb7185',
  '#c084fc','#22d3ee','#a3e635','#f472b6','#fd8a5e',
]

const COLUMNS = [
  { key: 'pid',            label: 'PID' },
  { key: 'arrivalTime',    label: 'Arrival' },
  { key: 'burstTime',      label: 'Burst' },
  { key: 'priority',       label: 'Priority' },
  { key: 'completionTime', label: 'Completion' },
  { key: 'turnaroundTime', label: 'Turnaround' },
  { key: 'waitingTime',    label: 'Waiting' },
]

export default function ProcessTable({ metrics }) {
  const [sortKey, setSortKey] = useState('pid')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const pidIndex = {}
  metrics.forEach((m, i) => { pidIndex[m.pid] = i })

  const sorted = [...metrics].sort((a, b) => {
    const va = a[sortKey]
    const vb = b[sortKey]
    if (va === '-' && vb === '-') return 0
    if (va === '-') return 1
    if (vb === '-') return -1
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortIcon = ({ col }) => (
    <span className={`sort-icon ${sortKey === col ? 'active' : ''}`}>
      {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="card table-card animate-in">
      <div className="card-title">Process Metrics</div>
      <div className="table-scroll">
        <table className="process-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="sortable-th"
                >
                  {col.label} <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.pid}>
                <td>
                  <div className="pid-display">
                    <span
                      className="pid-color-bar"
                      style={{ background: COLORS[pidIndex[m.pid] % COLORS.length] }}
                    />
                    <span className="pid-text">{m.pid}</span>
                  </div>
                </td>
                <td className="num-cell">{m.arrivalTime}</td>
                <td className="num-cell">{m.burstTime}</td>
                <td className="num-cell">{m.priority}</td>
                <td className="num-cell">{m.completionTime}</td>
                <td className="num-cell highlight-tat">{m.turnaroundTime}</td>
                <td className="num-cell highlight-wt">{m.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
