import React from 'react'
import Header from './components/Header/Header'
import AlgorithmSelector from './components/AlgorithmSelector/AlgorithmSelector'
import ProcessInput from './components/ProcessInput/ProcessInput'
import GanttChart from './components/GanttChart/GanttChart'
import BarChart from './components/GanttChart/BarChart'
import MetricsCard from './components/MetricsCard/MetricsCard'
import ProcessTable from './components/ProcessTable/ProcessTable'
import { useScheduler } from './hooks/useScheduler'
import { useTheme } from './hooks/useTheme'
import './styles/App.css'

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme()

  const {
    processes, setProcesses,
    algorithm, setAlgorithm,
    quantum, setQuantum,
    result, error,
    currentAlgo,
    run, reset,
  } = useScheduler()

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="main-content">
        <div className="hero-row">
          <div>
            <h2 className="hero-title">Scheduling Simulator</h2>
            <p className="hero-subtitle">
              Configure processes, select an algorithm, and visualize execution in real time.
            </p>
          </div>
          <div className="algo-badge-wrap">
            <span className="algo-active-badge">{currentAlgo?.label}</span>
          </div>
        </div>

        <div className="panel-grid">
          <div className="config-col">
            <AlgorithmSelector
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              quantum={quantum}
              setQuantum={setQuantum}
            />
            <ProcessInput
              processes={processes}
              setProcesses={setProcesses}
              needsPriority={currentAlgo?.needsPriority}
              onRun={run}
              onReset={reset}
              hasResult={!!result}
            />
          </div>

          <div className="results-col">
            {error && (
              <div className="error-banner animate-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {!result && !error && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="20" width="8" height="16" rx="2" fill="var(--blue)" opacity="0.3"/>
                    <rect x="16" y="12" width="8" height="24" rx="2" fill="var(--violet)" opacity="0.3"/>
                    <rect x="28" y="24" width="8" height="12" rx="2" fill="var(--green)" opacity="0.3"/>
                    <rect x="40" y="16" width="4" height="20" rx="2" fill="var(--yellow)" opacity="0.3"/>
                    <line x1="4" y1="38" x2="44" y2="38" stroke="var(--border2)" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h3 className="empty-title">Ready to Simulate</h3>
                <p className="empty-text">
                  Select an algorithm, configure your processes,<br />
                  then click <strong>Simulate</strong> to visualize execution.
                </p>
              </div>
            )}

            {result && (
              <>
                <MetricsCard stats={result.stats} />
                <GanttChart gantt={result.gantt} />
                <div className="dual-grid">
                  <ProcessTable metrics={result.metrics} />
                  <BarChart metrics={result.metrics} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <span>CPU Scheduler Simulator</span>
        <span className="footer-sep">·</span>
        <span>FCFS · SJF · SRTF · RR · Priority</span>
        <span className="footer-sep">·</span>
        <span>Built with React + Vite</span>
      </footer>
    </div>
  )
}