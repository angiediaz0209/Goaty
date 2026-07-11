export default function InterestChip({ interest, active, onToggle }) {
  return (
    <button
      type="button"
      className={`g-chip ${active ? 'active' : ''}`}
      onClick={() => onToggle && onToggle(interest.id)}
    >
      <span style={{ fontSize: 18 }}>{interest.emoji}</span>
      <span>{interest.label}</span>
    </button>
  )
}
