import React from 'react';

const SIZE = 120;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Arc spans 270 degrees (from 135° to 405°), leaving a 90° gap at the bottom
const ARC_LENGTH = CIRCUMFERENCE * 0.75;

export default function TelemetryModule({ value, max, unit, label, icon: Icon, isAlert }) {
  const hasValue = value != null;
  const percent = hasValue ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  const arcFill = (percent / 100) * ARC_LENGTH;
  const dashOffset = ARC_LENGTH - arcFill;

  const accentColor = isAlert ? 'var(--color-accent-orange)' : 'var(--color-accent-green)';
  const glowFilter = isAlert
    ? 'drop-shadow(0 0 6px var(--color-accent-orange))'
    : 'drop-shadow(0 0 6px var(--color-accent-green))';

  return (
    <div className="telemetry-module">
      {/* SVG radial arc */}
      <div className="telemetry-arc-wrap">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: 'rotate(135deg)' }}
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={accentColor}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 600ms ease, stroke 600ms ease',
              filter: glowFilter,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="telemetry-center">
          {Icon && (
            <span className="sensor-icon-pulse" style={{ color: accentColor }}>
              <Icon size={18} />
            </span>
          )}
          <span
            className="telemetry-value"
            style={{ fontFamily: 'var(--font-hud)', fontSize: '2rem' }}
          >
            {hasValue ? `${value}${unit}` : '--'}
          </span>
        </div>
      </div>

      {/* Label */}
      <div
        className="telemetry-label"
        style={{
          fontFamily: 'var(--font-hud)',
          color: 'var(--color-accent-cyan)',
          fontSize: '0.75rem',
        }}
      >
        {label}
      </div>
    </div>
  );
}
