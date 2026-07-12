/**
 * ChatChart — a small, self-contained SVG chart Goaty can drop into the chat
 * when a visual explains something better than words.
 *
 * Expected shape (parsed from a ```chart ... ``` block in a reply):
 *   { type: 'bar' | 'line', title?: string, xlabel?: string, ylabel?: string,
 *     data: [{ label: string, value: number }, ...] }
 */
export default function ChatChart({ spec }) {
  if (!spec || !Array.isArray(spec.data) || spec.data.length === 0) return null

  const type = spec.type === 'line' ? 'line' : 'bar'
  const data = spec.data
    .filter(d => d && typeof d.value === 'number' && isFinite(d.value))
    .slice(0, 12)
  if (data.length === 0) return null

  const W = 460
  const H = 230
  const padL = 26
  const padR = 20
  const padT = 22
  const padB = 34
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const axisY = padT + plotH

  const maxV = Math.max(...data.map(d => d.value), 0)
  const minV = Math.min(...data.map(d => d.value), 0)
  const span = maxV - minV || 1
  const y = v => padT + plotH - ((v - minV) / span) * plotH
  const n = data.length

  // Faint horizontal gridlines behind the plot (no numeric labels)
  const gridRows = 3
  const gridYs = Array.from({ length: gridRows }, (_, i) => padT + (plotH * (i + 1)) / (gridRows + 1))

  const AXIS = 'rgba(31, 41, 55, 0.18)'
  const GRID = 'rgba(31, 41, 55, 0.07)'

  return (
    <figure className="cv2-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title || 'chart'} style={{ width: '100%', height: 'auto' }}>
        {/* faint horizontal gridlines */}
        {gridYs.map((gy, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={gy} y2={gy} stroke={GRID} strokeWidth="1" />
        ))}

        {/* L-shaped axis "back lines" */}
        <line x1={padL} x2={padL} y1={padT} y2={axisY} stroke={AXIS} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={padL} x2={W - padR} y1={axisY} y2={axisY} stroke={AXIS} strokeWidth="1.5" strokeLinecap="round" />

        {type === 'bar' && data.map((d, i) => {
          const bw = (plotW / n) * 0.62
          const gap = (plotW / n - bw) / 2
          const bx = padL + i * (plotW / n) + gap
          const by = y(Math.max(d.value, 0))
          const bh = Math.abs(y(d.value) - y(0))
          return (
            <g key={i}>
              <rect x={bx} y={by} width={bw} height={bh} rx="5" fill="var(--blue)">
                <title>{`${d.label}: ${d.value}`}</title>
              </rect>
              <text x={bx + bw / 2} y={axisY + 20} textAnchor="middle" fontSize="12" fill="var(--muted)">
                {String(d.label).slice(0, 8)}
              </text>
            </g>
          )
        })}

        {type === 'line' && (
          <>
            <polyline
              fill="none"
              stroke="var(--blue)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={data.map((d, i) => `${padL + (i * plotW) / Math.max(n - 1, 1)},${y(d.value)}`).join(' ')}
            />
            {data.map((d, i) => {
              const cx = padL + (i * plotW) / Math.max(n - 1, 1)
              return (
                <g key={i}>
                  <circle cx={cx} cy={y(d.value)} r="6" fill="var(--orange)">
                    <title>{`${d.label}: ${d.value}`}</title>
                  </circle>
                  <text x={cx} y={axisY + 20} textAnchor="middle" fontSize="12" fill="var(--muted)">
                    {String(d.label).slice(0, 8)}
                  </text>
                </g>
              )
            })}
          </>
        )}
      </svg>
    </figure>
  )
}
