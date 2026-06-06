/**
 * CPU Scheduling Algorithms
 * Each function takes an array of process objects and returns:
 *   { gantt: [{pid, start, end}], metrics: [{pid, at, bt, ct, tat, wt}] }
 */

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Deep-clone processes and attach mutable fields */
function prepare(processes) {
  return processes.map((p) => ({ ...p, remaining: p.burstTime }))
}

/** Build metrics from completed array */
function buildMetrics(processes) {
  return processes.map((p) => ({
    pid: p.pid,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority ?? '-',
    completionTime: p.completionTime,
    turnaroundTime: p.completionTime - p.arrivalTime,
    waitingTime: p.completionTime - p.arrivalTime - p.burstTime,
  }))
}

/** Aggregate stats from metrics */
export function computeStats(metrics, totalTime, idleTime = 0) {
  const n = metrics.length
  const avgWT = metrics.reduce((s, m) => s + m.waitingTime, 0) / n
  const avgTAT = metrics.reduce((s, m) => s + m.turnaroundTime, 0) / n
  const cpuUtilization = ((totalTime - idleTime) / totalTime) * 100
  const throughput = n / totalTime
  return { avgWT, avgTAT, cpuUtilization, throughput }
}

// ─── FCFS ──────────────────────────────────────────────────────────────────

export function fcfs(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const gantt = []
  const completed = []
  let time = 0
  let idleTime = 0

  for (const p of sorted) {
    if (time < p.arrivalTime) {
      gantt.push({ pid: 'IDLE', start: time, end: p.arrivalTime })
      idleTime += p.arrivalTime - time
      time = p.arrivalTime
    }
    gantt.push({ pid: p.pid, start: time, end: time + p.burstTime })
    time += p.burstTime
    completed.push({ ...p, completionTime: time })
  }

  const metrics = buildMetrics(completed)
  const stats = computeStats(metrics, time, idleTime)
  return { gantt, metrics, stats }
}

// ─── SJF Non-Preemptive ────────────────────────────────────────────────────

export function sjfNonPreemptive(processes) {
  const procs = prepare(processes)
  const gantt = []
  const completed = []
  let time = 0
  let idleTime = 0
  const remaining = [...procs]

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= time)

    if (available.length === 0) {
      const next = remaining.reduce((a, b) => (a.arrivalTime < b.arrivalTime ? a : b))
      gantt.push({ pid: 'IDLE', start: time, end: next.arrivalTime })
      idleTime += next.arrivalTime - time
      time = next.arrivalTime
      continue
    }

    available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime)
    const p = available[0]
    remaining.splice(remaining.indexOf(p), 1)

    gantt.push({ pid: p.pid, start: time, end: time + p.burstTime })
    time += p.burstTime
    completed.push({ ...p, completionTime: time })
  }

  const metrics = buildMetrics(completed)
  const stats = computeStats(metrics, time, idleTime)
  return { gantt, metrics, stats }
}

// ─── SJF Preemptive (SRTF) ─────────────────────────────────────────────────

export function srtf(processes) {
  const procs = prepare(processes)
  const gantt = []
  const completionTimes = {}
  let time = 0
  let idleTime = 0
  let current = null
  let segStart = 0

  const maxTime = processes.reduce((s, p) => s + p.burstTime, 0) + Math.max(...processes.map((p) => p.arrivalTime)) + 1

  while (procs.some((p) => p.remaining > 0)) {
    const available = procs.filter((p) => p.arrivalTime <= time && p.remaining > 0)

    if (available.length === 0) {
      if (current !== null) {
        gantt.push({ pid: current.pid, start: segStart, end: time })
        current = null
      }
      const nextArrival = procs.filter((p) => p.remaining > 0).reduce((a, b) => (a.arrivalTime < b.arrivalTime ? a : b)).arrivalTime
      gantt.push({ pid: 'IDLE', start: time, end: nextArrival })
      idleTime += nextArrival - time
      time = nextArrival
      segStart = time
      continue
    }

    available.sort((a, b) => a.remaining - b.remaining || a.arrivalTime - b.arrivalTime)
    const shortest = available[0]

    if (current === null || current.pid !== shortest.pid) {
      if (current !== null) {
        gantt.push({ pid: current.pid, start: segStart, end: time })
      }
      current = shortest
      segStart = time
    }

    current.remaining--
    time++

    if (current.remaining === 0) {
      completionTimes[current.pid] = time
      gantt.push({ pid: current.pid, start: segStart, end: time })
      current = null
      segStart = time
    }

    if (time > maxTime) break
  }

  // Merge consecutive same-pid gantt segments
  const mergedGantt = []
  for (const seg of gantt) {
    if (mergedGantt.length > 0 && mergedGantt[mergedGantt.length - 1].pid === seg.pid) {
      mergedGantt[mergedGantt.length - 1].end = seg.end
    } else {
      mergedGantt.push({ ...seg })
    }
  }

  const metrics = processes.map((p) => ({
    pid: p.pid,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority ?? '-',
    completionTime: completionTimes[p.pid],
    turnaroundTime: completionTimes[p.pid] - p.arrivalTime,
    waitingTime: completionTimes[p.pid] - p.arrivalTime - p.burstTime,
  }))

  const stats = computeStats(metrics, time, idleTime)
  return { gantt: mergedGantt, metrics, stats }
}

// ─── Round Robin ───────────────────────────────────────────────────────────

export function roundRobin(processes, quantum) {
  const procs = prepare(processes).sort((a, b) => a.arrivalTime - b.arrivalTime)
  const gantt = []
  const completionTimes = {}
  const queue = []
  let time = 0
  let idleTime = 0
  let idx = 0

  // Enqueue processes that arrive at time 0
  while (idx < procs.length && procs[idx].arrivalTime <= time) {
    queue.push(procs[idx++])
  }

  while (queue.length > 0 || idx < procs.length) {
    if (queue.length === 0) {
      const next = procs[idx]
      gantt.push({ pid: 'IDLE', start: time, end: next.arrivalTime })
      idleTime += next.arrivalTime - time
      time = next.arrivalTime
      while (idx < procs.length && procs[idx].arrivalTime <= time) {
        queue.push(procs[idx++])
      }
    }

    const p = queue.shift()
    const execTime = Math.min(quantum, p.remaining)
    gantt.push({ pid: p.pid, start: time, end: time + execTime })
    time += execTime
    p.remaining -= execTime

    // Enqueue newly arrived processes
    while (idx < procs.length && procs[idx].arrivalTime <= time) {
      queue.push(procs[idx++])
    }

    if (p.remaining > 0) {
      queue.push(p)
    } else {
      completionTimes[p.pid] = time
    }
  }

  const metrics = processes.map((p) => ({
    pid: p.pid,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority ?? '-',
    completionTime: completionTimes[p.pid],
    turnaroundTime: completionTimes[p.pid] - p.arrivalTime,
    waitingTime: completionTimes[p.pid] - p.arrivalTime - p.burstTime,
  }))

  const stats = computeStats(metrics, time, idleTime)
  return { gantt, metrics, stats }
}

// ─── Priority Non-Preemptive ───────────────────────────────────────────────

export function priorityNonPreemptive(processes) {
  const procs = prepare(processes)
  const gantt = []
  const completed = []
  let time = 0
  let idleTime = 0
  const remaining = [...procs]

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= time)

    if (available.length === 0) {
      const next = remaining.reduce((a, b) => (a.arrivalTime < b.arrivalTime ? a : b))
      gantt.push({ pid: 'IDLE', start: time, end: next.arrivalTime })
      idleTime += next.arrivalTime - time
      time = next.arrivalTime
      continue
    }

    // Lower priority number = higher priority
    available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime)
    const p = available[0]
    remaining.splice(remaining.indexOf(p), 1)

    gantt.push({ pid: p.pid, start: time, end: time + p.burstTime })
    time += p.burstTime
    completed.push({ ...p, completionTime: time })
  }

  const metrics = buildMetrics(completed)
  const stats = computeStats(metrics, time, idleTime)
  return { gantt, metrics, stats }
}

// ─── Priority Preemptive ───────────────────────────────────────────────────

export function priorityPreemptive(processes) {
  const procs = prepare(processes)
  const gantt = []
  const completionTimes = {}
  let time = 0
  let idleTime = 0
  let current = null
  let segStart = 0

  while (procs.some((p) => p.remaining > 0)) {
    const available = procs.filter((p) => p.arrivalTime <= time && p.remaining > 0)

    if (available.length === 0) {
      if (current !== null) {
        gantt.push({ pid: current.pid, start: segStart, end: time })
        current = null
      }
      const nextArrival = procs.filter((p) => p.remaining > 0).reduce((a, b) => (a.arrivalTime < b.arrivalTime ? a : b)).arrivalTime
      gantt.push({ pid: 'IDLE', start: time, end: nextArrival })
      idleTime += nextArrival - time
      time = nextArrival
      segStart = time
      continue
    }

    available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime)
    const highest = available[0]

    if (current === null || current.pid !== highest.pid) {
      if (current !== null) {
        gantt.push({ pid: current.pid, start: segStart, end: time })
      }
      current = highest
      segStart = time
    }

    current.remaining--
    time++

    if (current.remaining === 0) {
      completionTimes[current.pid] = time
      gantt.push({ pid: current.pid, start: segStart, end: time })
      current = null
      segStart = time
    }
  }

  // Merge consecutive segments
  const mergedGantt = []
  for (const seg of gantt) {
    if (mergedGantt.length > 0 && mergedGantt[mergedGantt.length - 1].pid === seg.pid) {
      mergedGantt[mergedGantt.length - 1].end = seg.end
    } else {
      mergedGantt.push({ ...seg })
    }
  }

  const metrics = processes.map((p) => ({
    pid: p.pid,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority ?? '-',
    completionTime: completionTimes[p.pid],
    turnaroundTime: completionTimes[p.pid] - p.arrivalTime,
    waitingTime: completionTimes[p.pid] - p.arrivalTime - p.burstTime,
  }))

  const stats = computeStats(metrics, time, idleTime)
  return { gantt: mergedGantt, metrics, stats }
}
