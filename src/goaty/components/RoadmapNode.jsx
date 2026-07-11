const ICONS = {
  lesson: '📘',
  quiz: '🎯',
  project: '🛠️',
  milestone: '🏆',
}

export default function RoadmapNode({ node, isCurrent, onClick }) {
  const cls = ['g-node', node.status, isCurrent ? 'current' : ''].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={cls}
      onClick={() => node.status !== 'locked' && onClick && onClick(node)}
      aria-label={node.title}
      title={node.title}
    >
      <span>{node.status === 'complete' ? '✓' : ICONS[node.kind] || '⭐'}</span>
    </button>
  )
}
