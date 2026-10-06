// Decorative animated "neural network" backdrop (pure SVG + CSS, no JS, SSR-safe).
const NODES = [
  [8, 20], [22, 55], [18, 85], [38, 30], [50, 70], [62, 18], [75, 48], [88, 25], [92, 78], [55, 92], [32, 8], [70, 85],
]
const LINKS = [
  [0, 1], [1, 2], [0, 3], [1, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [6, 8], [4, 9], [9, 11], [8, 11], [10, 3], [10, 0], [5, 7],
]

export default function NeuralBg({ className = '' }) {
  return (
    <svg className={`neural-bg ${className}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {LINKS.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
          className="neural-line"
          style={{ animationDelay: `${(i % 6) * 0.6}s` }}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.35" className="neural-node" style={{ animationDelay: `${(i % 5) * 0.5}s` }} />
      ))}
    </svg>
  )
}
