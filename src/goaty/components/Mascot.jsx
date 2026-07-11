import { useState } from 'react'
import goatyImg from '../images/goaty.png'

export default function Mascot({ size = 'md', speech, showNote = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`g-mascot ${size}`} style={{ position: 'relative' }}>
      {!failed ? (
        <img
          src={goatyImg}
          alt="Goaty the mascot"
          onError={() => setFailed(true)}
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <div className="fallback" aria-label="Goaty placeholder">
          <span style={{ fontSize: '50%' }}>🐐</span>
        </div>
      )}
      {failed && showNote && (
        <div className="drop-note">Add your Goaty PNG at src/goaty/images/goaty.png</div>
      )}
      {speech && (
        <div
          className="g-bubble goaty g-fade-up"
          style={{
            position: 'absolute',
            top: '-8px',
            left: '105%',
            width: 'max-content',
            maxWidth: 280,
            boxShadow: 'var(--shadow-1)',
          }}
        >
          {speech}
        </div>
      )}
    </div>
  )
}
