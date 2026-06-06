import React, { useRef, useEffect } from 'react'
import './GanttChart.css'

const COLORS = [
  '#38bdf8','#818cf8','#34d399','#fbbf24','#fb7185',
  '#c084fc','#22d3ee','#a3e635','#f472b6','#fd8a5e',
]

/** Build a consistent color map from pid → color */
function buildColorMap(gantt) {
  const map = {}
  let idx = 0
  for (const seg of gantt) {
    if (seg.pid !== 'IDLE' && !(seg.pid in map)) {
      map[seg.pid] = COLORS[idx % COLORS.length]
      idx++
    }
  }
  return map
}

export default function GanttChart({ gantt }) {
  const scrollRef = useRef(null)

  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0
  const colorMap = buildColorMap(gantt)

  // Auto-scroll to show full chart on update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
    }
  }, [gantt])

  if (!gantt || gantt.length === 0) return null

  const MIN_SEG_WIDTH = 48
  const scale = Math.max(MIN_SEG_WIDTH, 700 / totalTime) // px per time unit

  return (
    <div className="card gantt-card animate-in">
      <div className="card-title">
        Gantt Chart
        <span className="gantt-total-time">Total: {totalTime} units</span>
      </div>

      <div className="gantt-scroll" ref={scrollRef}>
        <div className="gantt-track" style={{ width: totalTime * scale + 'px' }}>
          {gantt.map((seg, i) => {
            const w = (seg.end - seg.start) * scale
            const isIdle = seg.pid === 'IDLE'
            return (
              <div
                key={i}
                className={`gantt-seg ${isIdle ? 'idle' : ''}`}
                style={{
                  width: w + 'px',
                  '--seg-color': isIdle ? 'transparent' : colorMap[seg.pid],
                }}
                title={`${seg.pid}: ${seg.start} → ${seg.end} (${seg.end - seg.start} units)`}
              >
                <div className="gantt-seg-inner">
                  <span className="gantt-pid">{seg.pid}</span>
                  {w >= 40 && (
                    <span className="gantt-duration">{seg.end - seg.start}u</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Timeline ticks */}
        <div className="gantt-timeline" style={{ width: totalTime * scale + 'px' }}>
          {gantt.map((seg, i) => (
            <div
              key={`tick-s-${i}`}
              className="gantt-tick"
              style={{ left: seg.start * scale + 'px' }}
            >
              <span className="gantt-tick-label">{seg.start}</span>
            </div>
          ))}
          {/* Final tick */}
          <div className="gantt-tick" style={{ left: totalTime * scale + 'px' }}>
            <span className="gantt-tick-label">{totalTime}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="gantt-legend">
        {Object.entries(colorMap).map(([pid, color]) => (
          <div key={pid} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            <span>{pid}</span>
          </div>
        ))}
        <div className="legend-item">
          <span className="legend-dot idle-legend" />
          <span>IDLE</span>
        </div>
      </div>
    </div>
  )
}
