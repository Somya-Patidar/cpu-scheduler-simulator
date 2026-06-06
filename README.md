# CPU Scheduler Simulator

> An interactive, visual simulator for CPU scheduling algorithms — built with React + Vite, deployed on Vercel/Netlify.

![CPU Scheduler Simulator](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Netlify-black)

---

## Overview

CPU Scheduler Simulator is a fully client-side web application that visualizes how different CPU scheduling algorithms allocate processor time to processes. It computes and displays Gantt charts, per-process metrics (waiting time, turnaround time, completion time), and aggregate statistics (average WT, average TAT, CPU utilization, throughput) — all interactively in the browser.

**Designed for**: CS/CSE students, OS course revision, placement/internship portfolio projects, and anyone who wants to deeply understand process scheduling.

---

## Screenshots

> _Add screenshots here after first run_

| Dark Mode | Light Mode |
|-----------|------------|
| `screenshots/dark-dashboard.png` | `screenshots/light-dashboard.png` |

| Gantt Chart | Process Table |
|-------------|---------------|
| `screenshots/gantt.png` | `screenshots/table.png` |

---

## Features

- **6 Scheduling Algorithms** — FCFS, SJF (Non-Preemptive), SRTF, Round Robin, Priority (NP & P)
- **Interactive Gantt Chart** — scaled timeline with IDLE segments, tooltips, and color-coded processes
- **Per-Process Metrics Table** — sortable by any column; highlights WT and TAT
- **Aggregate Statistics Tiles** — Avg WT, Avg TAT, CPU Utilization (with progress bar), Throughput
- **Comparative Bar Chart** — side-by-side WT vs TAT visualization per process
- **Dark / Light Mode Toggle** — persisted in `localStorage`, respects OS preference
- **Process Presets** — load example process sets (Basic, Burst, Simultaneous) in one click
- **Input Validation** — meaningful error messages for all invalid inputs
- **Responsive Design** — works on desktop, tablet, and mobile
- **Zero Dependencies** — pure React + Vite; no chart library needed

---

## Project Structure

```
cpu-scheduler-sim/
├── public/
│   └── favicon.svg
├── src/
│   ├── algorithms/
│   │   └── index.js          # All 6 scheduling algorithm implementations
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── AlgorithmSelector/
│   │   │   ├── AlgorithmSelector.jsx
│   │   │   └── AlgorithmSelector.css
│   │   ├── ProcessInput/
│   │   │   ├── ProcessInput.jsx
│   │   │   └── ProcessInput.css
│   │   ├── GanttChart/
│   │   │   ├── GanttChart.jsx
│   │   │   ├── GanttChart.css
│   │   │   ├── BarChart.jsx
│   │   │   └── BarChart.css
│   │   ├── MetricsCard/
│   │   │   ├── MetricsCard.jsx
│   │   │   └── MetricsCard.css
│   │   └── ProcessTable/
│   │       ├── ProcessTable.jsx
│   │       └── ProcessTable.css
│   ├── hooks/
│   │   ├── useScheduler.js   # Orchestration hook; calls algorithm functions
│   │   └── useTheme.js       # Dark/light theme persistence
│   ├── styles/
│   │   ├── global.css        # Design tokens, typography, layout utilities
│   │   └── App.css           # App-level layout styles
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Algorithms Explained

### 1. FCFS — First Come First Served
Non-preemptive. Processes are executed in order of arrival. Simple but can suffer from the **convoy effect** where short processes wait behind long ones.

### 2. SJF — Shortest Job First (Non-Preemptive)
Non-preemptive. Among available processes, the one with the shortest burst time is selected. Minimizes average waiting time among non-preemptive algorithms. May cause **starvation** of long processes.

### 3. SRTF — Shortest Remaining Time First (Preemptive SJF)
Preemptive version of SJF. When a new process arrives with a shorter remaining burst than the running process, it preempts the CPU. Optimal average waiting time but complex to implement.

### 4. Round Robin
Preemptive. Each process gets a fixed time quantum. After the quantum expires, the CPU is given to the next process in the ready queue. Fair allocation, widely used in time-sharing systems.

### 5. Priority Scheduling (Non-Preemptive)
Each process has a priority (lower number = higher priority). The highest-priority available process runs to completion. May lead to **starvation** of low-priority processes.

### 6. Priority Scheduling (Preemptive)
Preemptive version. When a higher-priority process arrives, it immediately preempts the current process. More responsive but more context-switch overhead.

---

## Metrics Explained

| Metric | Formula |
|--------|---------|
| **Completion Time (CT)** | Time at which process finishes execution |
| **Turnaround Time (TAT)** | CT − Arrival Time |
| **Waiting Time (WT)** | TAT − Burst Time |
| **CPU Utilization** | (Busy Time / Total Time) × 100% |
| **Throughput** | Number of processes / Total Time |

---

## Installation & Local Setup

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x (or pnpm/yarn)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/cpu-scheduler-sim.git
cd cpu-scheduler-sim

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → Open http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## Usage Guide

1. **Select Algorithm** — Click an algorithm in the left panel. The active selection is highlighted.
2. **Set Time Quantum** (Round Robin only) — Use the +/− controls or type directly.
3. **Configure Processes** — Edit PID, Arrival Time, Burst Time (and Priority for priority algorithms).
4. **Load a Preset** — Click Basic / Burst / Simultaneous to load example process sets.
5. **Click Simulate** — Results appear instantly: metrics tiles, Gantt chart, table, and bar chart.
6. **Sort the table** — Click any column header to sort ascending/descending.
7. **Toggle Theme** — Click the Dark/Light button in the top-right corner.

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) → New Project → Import from GitHub.

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Or drag-and-drop the `dist/` folder at [app.netlify.com/drop](https://app.netlify.com/drop).

---

## Git Setup

```bash
# Initialize repository
git init
git add .
git commit -m "feat: initial CPU scheduler simulator"

# Add remote and push
git remote add origin https://github.com/<your-username>/cpu-scheduler-sim.git
git branch -M main
git push -u origin main
```

---

## Future Enhancements

- [ ] **Multilevel Queue Scheduling** (MLQ)
- [ ] **Multilevel Feedback Queue** (MLFQ)
- [ ] **Animation mode** — step-through execution with timeline playback
- [ ] **Algorithm comparison mode** — run all algorithms on the same process set side-by-side
- [ ] **Export** — download Gantt chart as PNG, metrics as CSV
- [ ] **Process arrival animation** in Gantt timeline
- [ ] **Starvation detection** and aging simulation
- [ ] **Unit tests** with Vitest

---

## Resume Description

> **CPU Scheduling Algorithm Visualizer** | React, Vite, JavaScript
>
> Built an interactive web simulator implementing 6 CPU scheduling algorithms (FCFS, SJF, SRTF, Round Robin, Priority Preemptive/Non-Preemptive) from scratch without external chart libraries. Engineered a real-time Gantt chart renderer, sortable process metrics table, and aggregate performance statistics dashboard. Implemented persistent dark/light theming, input validation, and responsive layout. Deployed on Vercel.

---

## Skills Demonstrated

- **Data Structures & Algorithms** — priority queues, simulation loops, greedy scheduling
- **Operating Systems** — deep understanding of CPU scheduling theory
- **React** — hooks (useState, useCallback, useEffect, useRef), component architecture
- **CSS** — custom design system with CSS variables, responsive grid, dark/light theming
- **Software Engineering** — separation of concerns (algorithm logic vs UI), reusable components
- **Deployment** — Vite build pipeline, Vercel/Netlify CI/CD

---

## License

MIT © 2024 — Feel free to use, modify, and distribute.
