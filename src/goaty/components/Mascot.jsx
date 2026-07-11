import { useEffect, useState } from 'react'
import goatyImg from '../images/goaty.png'
import pose1 from '../images/goaty_pose_1.png'
import pose2 from '../images/goaty_pose_2.png'
import pose3 from '../images/goaty_pose_3.png'

// Ordered poses used for the animated "thinking" loop and celebrations.
// idle -> pose1 (wave) -> pose2 (happy hands) -> pose3 (thumbs-up) -> pose1
const POSES = [goatyImg, pose1, pose2, pose3, pose1]

export { goatyImg, pose1, pose2, pose3 }

/**
 * Mascot — renders Goaty in a size variant.
 *
 * Props
 *  - size:      "sm" | "md" | "lg" | "xl" | "hero"
 *  - speech:    optional text bubble next to the mascot
 *  - showNote:  fallback hint when the image fails
 *  - pose:      "idle" | "wave" | "happy" | "thumbs" | number index
 *  - animate:   "none" | "thinking" | "celebrate"
 *               • "thinking"   → cycles through POSES to feel like Goaty is reacting while loading
 *               • "celebrate"  → quick 3-frame flourish (great for correct answers / XP gain)
 *  - speed:     ms between frames when animating (default 350)
 */
export default function Mascot({
  size = 'md',
  speech,
  showNote = false,
  pose,
  animate = 'none',
  speed = 350,
}) {
  const [failed, setFailed] = useState(false)
  const [idx, setIdx] = useState(0)

  // Resolve the requested pose to an index once (for static usage)
  const staticIdx =
    typeof pose === 'number'
      ? pose % POSES.length
      : pose === 'wave'
        ? 1
        : pose === 'happy'
          ? 2
          : pose === 'thumbs'
            ? 3
            : 0

  useEffect(() => {
    if (animate === 'none') {
      setIdx(staticIdx)
      return
    }
    if (animate === 'celebrate') {
      // 0 -> 3 (thumbs) -> 2 (happy) -> 3 (thumbs) -> 0 idle
      const seq = [0, 3, 2, 3, 0]
      let i = 0
      setIdx(seq[0])
      const t = setInterval(() => {
        i += 1
        if (i >= seq.length) { clearInterval(t); return }
        setIdx(seq[i])
      }, Math.max(140, speed - 100))
      return () => clearInterval(t)
    }
    // "thinking" — endless cycle
    let i = 0
    setIdx(POSES.length > 0 ? 0 : 0)
    const t = setInterval(() => {
      i = (i + 1) % POSES.length
      setIdx(i)
    }, speed)
    return () => clearInterval(t)
  }, [animate, speed, staticIdx])

  const src = POSES[idx] || goatyImg

  return (
    <div className={`g-mascot ${size} ${animate !== 'none' ? 'is-animated' : ''}`} style={{ position: 'relative' }}>
      {!failed ? (
        <img
          key={src /* re-mount for smooth cross-fade via CSS animation */}
          src={src}
          alt="Goaty the mascot"
          onError={() => setFailed(true)}
          className={animate !== 'none' ? 'g-mascot-frame' : ''}
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
