import { useEffect, useRef, useState } from "react";

const GaugeChart = ({ percentage }: { percentage: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);
  return (
    <>
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#fca5a5" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d="M10,50 A40,40 0 0,1 90,50"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Foreground arc with rounded ends */}
        <path
          ref={pathRef}
          d="M10,50 A40,40 0 0,1 90,50"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - percentage)}
        />
      </svg>
    </>
  );
};

export default GaugeChart;
