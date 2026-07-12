import ChatChart from './ChatChart.jsx'

/**
 * ChatRichText — renders a Goaty reply as text plus optional graphics.
 *
 * Goaty can embed a chart with a fenced block:
 *   ```chart
 *   { "type": "bar", "title": "Demand at each price", "data": [{"label":"$5","value":90}, ...] }
 *   ```
 * and an image with markdown: ![alt](https://...)
 * Everything else renders as plain paragraphs (blank line = new paragraph).
 */
const CHART_RE = /```chart\s*([\s\S]*?)```/g
const IMG_RE = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g

export default function ChatRichText({ text = '' }) {
  const nodes = []
  let last = 0
  let key = 0

  // Pull out ```chart blocks first, in order.
  let m
  CHART_RE.lastIndex = 0
  while ((m = CHART_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push({ kind: 'text', value: text.slice(last, m.index) })
    let spec = null
    try { spec = JSON.parse(m[1].trim()) } catch { /* ignore malformed chart */ }
    if (spec) nodes.push({ kind: 'chart', value: spec, key: key++ })
    else nodes.push({ kind: 'text', value: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push({ kind: 'text', value: text.slice(last) })

  // When a chart is present, present each part as its own light-blue block
  // (matching the reference); plain text messages stay in the single bubble.
  const hasChart = nodes.some(n => n.kind === 'chart')

  return (
    <div className={`cv2-rich${hasChart ? ' has-chart' : ''}`}>
      {nodes.map((node, i) => {
        if (node.kind === 'chart') return <ChatChart key={`c${node.key}`} spec={node.value} />
        const block = <TextBlock key={`t${i}`} value={node.value} />
        return hasChart ? <div key={`a${i}`} className="cv2-answer">{block}</div> : block
      })}
    </div>
  )
}

function TextBlock({ value }) {
  const trimmed = value.replace(/^\n+|\n+$/g, '')
  if (!trimmed) return null

  // Split into paragraphs on blank lines.
  return (
    <>
      {trimmed.split(/\n{2,}/).map((para, i) => {
        // A paragraph that is only an image → render the image.
        IMG_RE.lastIndex = 0
        const only = para.trim().match(/^!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)$/)
        if (only) {
          return <img key={i} className="cv2-rich-img" src={only[1]} alt="" loading="lazy" />
        }
        return (
          <p key={i} className="cv2-rich-p">
            {para.split('\n').map((line, j) => (
              <span key={j}>{line}{j < para.split('\n').length - 1 && <br />}</span>
            ))}
          </p>
        )
      })}
    </>
  )
}
