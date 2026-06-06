import React from 'react'
import { ALGORITHMS } from '../../hooks/useScheduler'
import './AlgorithmSelector.css'

export default function AlgorithmSelector({ algorithm, setAlgorithm, quantum, setQuantum }) {
  const current = ALGORITHMS.find((a) => a.id === algorithm)

  return (
    <div className="card algo-card">
      <div className="card-title">Algorithm</div>

      <div className="algo-list">
        {ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            className={`algo-btn ${algorithm === algo.id ? 'active' : ''}`}
            onClick={() => setAlgorithm(algo.id)}
          >
            <span className="algo-dot" />
            {algo.label}
          </button>
        ))}
      </div>

      {current?.needsQuantum && (
        <div className="quantum-row">
          <label className="quantum-label" htmlFor="quantum-input">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Time Quantum
          </label>
          <div className="quantum-ctrl">
            <button className="quantum-btn" onClick={() => setQuantum(Math.max(1, quantum - 1))}>−</button>
            <input
              id="quantum-input"
              type="number"
              className="input quantum-input"
              min="1"
              max="99"
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button className="quantum-btn" onClick={() => setQuantum(Math.min(99, quantum + 1))}>+</button>
          </div>
        </div>
      )}

      {current?.needsPriority && (
        <div className="priority-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Lower number = Higher priority
        </div>
      )}
    </div>
  )
}
