export default function Section({ title, subtitle, right, children }) {
  return (
    <section style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 className="g-section-title" style={{ margin: 0 }}>{title}</h2>
          {subtitle && <div style={{ color: 'var(--muted)', marginTop: 6 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}
