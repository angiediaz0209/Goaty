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
  const H = 240
  const padL = 42
  const padR = 16
  const padT = 16
  const padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const maxV = Math.max(...data.map(d => d.value), 0)
  const minV = Math.min(...data.map(d => d.value), 0)
  const span = maxV - minV || 1
  const y = v => padT + plotH - ((v - minV) / span) * plotH
  const n = data.length

  // gridlines
  const ticks = 4
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => minV + (span * i) / ticks)

  return (
    <figure className="cv2-chart">
      {spec.title && <figcaption className="cv2-chart-title">{spec.title}</figcaption>}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title || 'chart'} style={{ width: '100%', height: 'auto' }}>
        {/* gridlines + y labels */}
        {gridVals.map((gv, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(gv)} y2={y(gv)} stroke="var(--border-strong)" strokeWidth="1" opacity="0.35" />
            <text x={padL - 8} y={y(gv) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
              {Math.round(gv)}
            </text>
          </g>
        ))}

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
              <text x={bx + bw / 2} y={H - padB + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">
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
                  <circle cx={cx} cy={y(d.value)} r="4" fill="var(--orange)">
                    <title>{`${d.label}: ${d.value}`}</title>
                  </circle>
                  <text x={cx} y={H - padB + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">
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
