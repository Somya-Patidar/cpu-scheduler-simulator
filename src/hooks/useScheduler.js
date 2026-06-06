import { useState, useCallback } from 'react'
import {
  fcfs,
  sjfNonPreemptive,
  srtf,
  roundRobin,
  priorityNonPreemptive,
  priorityPreemptive,
} from '../algorithms'

export const ALGORITHMS = [
  { id: 'fcfs',      label: 'FCFS',                    needsPriority: false, needsQuantum: false },
  { id: 'sjf',       label: 'SJF (Non-Preemptive)',    needsPriority: false, needsQuantum: false },
  { id: 'srtf',      label: 'SRTF (Preemptive SJF)',   needsPriority: false, needsQuantum: false },
  { id: 'rr',        label: 'Round Robin',              needsPriority: false, needsQuantum: true  },
  { id: 'pnp',       label: 'Priority (Non-Preemptive)', needsPriority: true, needsQuantum: false },
  { id: 'pp',        label: 'Priority (Preemptive)',    needsPriority: true,  needsQuantum: false },
]

const DEFAULT_PROCESSES = [
  { id: 1, pid: 'P1', arrivalTime: 0, burstTime: 6, priority: 2 },
  { id: 2, pid: 'P2', arrivalTime: 2, burstTime: 4, priority: 1 },
  { id: 3, pid: 'P3', arrivalTime: 4, burstTime: 2, priority: 3 },
  { id: 4, pid: 'P4', arrivalTime: 6, burstTime: 5, priority: 2 },
]

export function useScheduler() {
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES)
  const [algorithm, setAlgorithm] = useState('fcfs')
  const [quantum, setQuantum] = useState(2)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const currentAlgo = ALGORITHMS.find((a) => a.id === algorithm)

  const run = useCallback(() => {
    setError(null)
    setIsRunning(true)

    try {
      if (processes.length === 0) throw new Error('Add at least one process.')
      if (processes.length > 10) throw new Error('Maximum 10 processes allowed.')

      // Validate
      for (const p of processes) {
        if (!p.pid.trim()) throw new Error(`Process ID cannot be empty.`)
        if (p.arrivalTime < 0) throw new Error(`${p.pid}: Arrival time must be ≥ 0.`)
        if (p.burstTime <= 0) throw new Error(`${p.pid}: Burst time must be > 0.`)
        if (currentAlgo.needsPriority && (p.priority === undefined || p.priority < 1))
          throw new Error(`${p.pid}: Priority must be ≥ 1.`)
      }
      if (currentAlgo.needsQuantum && quantum < 1)
        throw new Error('Time quantum must be ≥ 1.')

      // Unique PIDs
      const pids = processes.map((p) => p.pid)
      if (new Set(pids).size !== pids.length) throw new Error('Process IDs must be unique.')

      let res
      switch (algorithm) {
        case 'fcfs': res = fcfs(processes); break
        case 'sjf':  res = sjfNonPreemptive(processes); break
        case 'srtf': res = srtf(processes); break
        case 'rr':   res = roundRobin(processes, quantum); break
        case 'pnp':  res = priorityNonPreemptive(processes); break
        case 'pp':   res = priorityPreemptive(processes); break
        default: throw new Error('Unknown algorithm.')
      }

      setResult(res)
    } catch (e) {
      setError(e.message)
      setResult(null)
    } finally {
      setIsRunning(false)
    }
  }, [processes, algorithm, quantum, currentAlgo])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    processes, setProcesses,
    algorithm, setAlgorithm,
    quantum, setQuantum,
    result, error, isRunning,
    currentAlgo,
    run, reset,
  }
}
