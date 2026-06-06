import React, { useState } from 'react'
import './ProcessInput.css'

/** Palette for assigning process colors consistently */
const COLORS = [
  '#38bdf8','#818cf8','#34d399','#fbbf24','#fb7185',
  '#c084fc','#22d3ee','#a3e635','#f472b6','#fd8a5e',
]

export default function ProcessInput({ processes, setProcesses, needsPriority, onRun, onReset, hasResult }) {
  const [nextId, setNextId] = useState(processes.length + 1)

  const addProcess = () => {
    if (processes.length >= 10) return
    const id = nextId
    setProcesses([
      ...processes,
      { id, pid: `P${id}`, arrivalTime: 0, burstTime: 1, priority: 1 },
    ])
    setNextId(id + 1)
  }

  const removeProcess = (id) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  const updateProcess = (id, field, value) => {
    setProcesses(
      processes.map((p) =>
        p.id === id ? { ...p, [field]: field === 'pid' ? value : Number(value) } : p
      )
    )
  }

  const loadPreset = (preset) => {
    const presets = {
      basic: [
        { id: 1, pid: 'P1', arrivalTime: 0, burstTime: 6, priority: 2 },
        { id: 2, pid: 'P2', arrivalTime: 2, burstTime: 4, priority: 1 },
        { id: 3, pid: 'P3', arrivalTime: 4, burstTime: 2, priority: 3 },
        { id: 4, pid: 'P4', arrivalTime: 6, burstTime: 5, priority: 2 },
      ],
      burst: [
        { id: 1, pid: 'P1', arrivalTime: 0, burstTime: 8, priority: 3 },
        { id: 2, pid: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
        { id: 3, pid: 'P3', arrivalTime: 2, burstTime: 9, priority: 4 },
        { id: 4, pid: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
        { id: 5, pid: 'P5', arrivalTime: 4, burstTime: 2, priority: 5 },
      ],
      simultaneous: [
        { id: 1, pid: 'P1', arrivalTime: 0, burstTime: 5, priority: 3 },
        { id: 2, pid: 'P2', arrivalTime: 0, burstTime: 3, priority: 1 },
        { id: 3, pid: 'P3', arrivalTime: 0, burstTime: 7, priority: 2 },
      ],
    }
    setProcesses(presets[preset])
    setNextId(presets[preset].length + 1)
  }

  return (
    <div className="card process-card">
      <div className="card-title">Processes</div>

      {/* Presets */}
      <div className="preset-row">
        <span className="preset-label">Presets:</span>
        <button className="btn btn-secondary preset-btn" onClick={() => loadPreset('basic')}>Basic</button>
        <button className="btn btn-secondary preset-btn" onClick={() => loadPreset('burst')}>Burst</button>
        <button className="btn btn-secondary preset-btn" onClick={() => loadPreset('simultaneous')}>Simultaneous</button>
      </div>

      {/* Column headers */}
      <div className={`process-header ${needsPriority ? 'with-priority' : ''}`}>
        <span>PID</span>
        <span>Arrival</span>
        <span>Burst</span>
        {needsPriority && <span>Priority</span>}
        <span></span>
      </div>

      {/* Process rows */}
      <div className="process-list">
        {processes.map((p, idx) => (
          <div key={p.id} className={`process-row ${needsPriority ? 'with-priority' : ''}`}>
            <div className="pid-cell">
              <span className="pid-dot" style={{ background: COLORS[idx % COLORS.length] }} />
              <input
                className="input pid-input"
                type="text"
                value={p.pid}
                maxLength={4}
                onChange={(e) => updateProcess(p.id, 'pid', e.target.value)}
              />
            </div>
            <input
              className="input num-input"
              type="number"
              min="0"
              value={p.arrivalTime}
              onChange={(e) => updateProcess(p.id, 'arrivalTime', e.target.value)}
            />
            <input
              className="input num-input"
              type="number"
              min="1"
              value={p.burstTime}
              onChange={(e) => updateProcess(p.id, 'burstTime', e.target.value)}
            />
            {needsPriority && (
              <input
                className="input num-input"
                type="number"
                min="1"
                value={p.priority}
                onChange={(e) => updateProcess(p.id, 'priority', e.target.value)}
              />
            )}
            <button
              className="btn btn-danger"
              onClick={() => removeProcess(p.id)}
              disabled={processes.length <= 1}
              title="Remove process"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add row */}
      <button
        className="btn btn-secondary add-btn"
        onClick={addProcess}
        disabled={processes.length >= 10}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Process {processes.length >= 10 && '(max 10)'}
      </button>

      <div className="divider" />

      {/* Actions */}
      <div className="action-row">
        <button className="btn btn-primary run-btn" onClick={onRun}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Simulate
        </button>
        {hasResult && (
          <button className="btn btn-secondary" onClick={onReset}>
            Reset
          </button>
        )}
      </div>

      <p className="process-count">{processes.length}/10 processes</p>
    </div>
  )
}
