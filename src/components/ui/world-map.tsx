"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";

export interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  className?: string;
  activeLocationLabel?: string;
  onSelectCity?: (city: string) => void;
  countries?: string[];
  aspectRatio?: string;
}

export function WorldMap({
  dots = [],
  lineColor = "#C47B52",
  className,
  activeLocationLabel,
  onSelectCity,
  countries,
  aspectRatio,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  let theme = "dark";
  try {
    const themeContext = useTheme();
    if (themeContext?.theme) {
      theme = themeContext.theme;
    }
  } catch {
    theme = "dark";
  }

  const isIndiaOnly = Boolean(countries?.includes("IND") && countries.length === 1);

  const { svgMap, mapInstance, viewBox } = useMemo(() => {
    // Instantiate dotted map with or without country filter
    const map = new DottedMap({
      height: 100,
      grid: "diagonal",
      ...(countries && countries.length > 0 ? { countries } : {}),
    });

    const generatedSvg = map.getSVG({
      radius: isIndiaOnly ? 0.32 : 0.22,
      color: theme === "dark" ? "#FFFFFF40" : "#00000040",
      shape: "circle",
      backgroundColor: "transparent",
    });

    const vbMatch = generatedSvg.match(/viewBox="([^"]+)"/);
    const vb = vbMatch ? vbMatch[1] : (isIndiaOnly ? "0 0 98 100" : "0 0 198 100");

    return {
      svgMap: generatedSvg,
      mapInstance: map,
      viewBox: isIndiaOnly ? "0 0 98 100" : "0 0 800 400",
    };
  }, [theme, countries, isIndiaOnly]);

  const projectPoint = (lat: number, lng: number) => {
    if (isIndiaOnly && mapInstance) {
      try {
        const pin = mapInstance.getPin({ lat, lng });
        if (pin && typeof pin.x === "number" && typeof pin.y === "number") {
          return { x: pin.x, y: pin.y };
        }
      } catch {
        // fallback to equirectangular calculation
      }
    }
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    if (isIndiaOnly) {
      // Offset curved control point in 0-100 coordinate space
      const midX = (start.x + end.x) / 2 + (start.x > end.x ? 4 : -4);
      const midY = (start.y + end.y) / 2;
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    }
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div
      className={`w-full ${
        aspectRatio || (isIndiaOnly ? "aspect-[98/100]" : "aspect-[2/1]")
      } relative font-sans overflow-hidden select-none ${className || ""}`}
    >
      {/* Background Dotted Map */}
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none object-contain"
        alt="Dotted Architectural Map"
        height={isIndiaOnly ? 500 : 495}
        width={isIndiaOnly ? 490 : 1056}
        draggable={false}
      />

      {/* Foreground SVG for Trajectories, Rings, and Pins */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full absolute inset-0 select-none pointer-events-auto"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="10%" stopColor={lineColor} stopOpacity="0.9" />
            <stop offset="90%" stopColor={lineColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Subtle grid crosshair if zoomed into India */}
        {isIndiaOnly && (
          <g opacity="0.12" pointerEvents="none">
            <line x1="0" y1="50" x2="98" y2="50" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="1,1" />
            <line x1="49" y1="0" x2="49" y2="100" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="1,1" />
          </g>
        )}

        {/* Curved animated arc paths */}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`} pointerEvents="none">
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth={isIndiaOnly ? "0.6" : "1.5"}
                strokeDasharray={isIndiaOnly ? "1.5,1" : "none"}
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1.4,
                  delay: 0.25 * i,
                  ease: "easeInOut",
                }}
              />
            </g>
          );
        })}

        {/* Studio Dots, Pulsing Radar Rings, and City Labels */}
        {dots.map((dot, i) => {
          const startPt = projectPoint(dot.start.lat, dot.start.lng);
          const endPt = projectPoint(dot.end.lat, dot.end.lng);
          const isStartActive =
            activeLocationLabel &&
            dot.start.label?.toLowerCase() === activeLocationLabel.toLowerCase();
          const isEndActive =
            activeLocationLabel &&
            dot.end.label?.toLowerCase() === activeLocationLabel.toLowerCase();

          const dotRadius = isIndiaOnly ? 1.6 : 2.5;
          const activeRadius = isIndiaOnly ? 2.4 : 4.2;
          const pulseFrom = isIndiaOnly ? "2" : "3";
          const pulseTo = isIndiaOnly ? "8" : "16";
          const fontSize = isIndiaOnly ? "3.8" : "8";

          return (
            <g key={`points-group-${i}`}>
              {/* Start Point (e.g. Gurugram HQ) */}
              <g
                key={`start-${i}`}
                className={dot.start.label && onSelectCity ? "cursor-pointer group" : ""}
                onClick={() => dot.start.label && onSelectCity?.(dot.start.label)}
              >
                {/* Active Outer Halo Circle */}
                {isStartActive && (
                  <circle
                    cx={startPt.x}
                    cy={startPt.y}
                    r={isIndiaOnly ? 5.5 : 9}
                    fill="#C47B52"
                    fillOpacity="0.25"
                  />
                )}

                {/* Pulsing Radar Ring */}
                <circle
                  cx={startPt.x}
                  cy={startPt.y}
                  r={isStartActive ? activeRadius : dotRadius}
                  fill={isStartActive ? "#EED77A" : lineColor}
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from={pulseFrom}
                    to={pulseTo}
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Core Pin Dot */}
                <circle
                  cx={startPt.x}
                  cy={startPt.y}
                  r={isStartActive ? activeRadius : dotRadius}
                  fill={isStartActive ? "#FFFFFF" : lineColor}
                  stroke={isStartActive ? "#C47B52" : "#FFFFFF"}
                  strokeWidth={isIndiaOnly ? "0.4" : "0.8"}
                />

                {/* Label */}
                {dot.start.label && (
                  <text
                    x={startPt.x + (isIndiaOnly ? 3.2 : 6)}
                    y={startPt.y + (isIndiaOnly ? 1.2 : 3)}
                    fill={isStartActive ? "#FFFFFF" : "#E5E0D8"}
                    fontSize={fontSize}
                    fontFamily="monospace"
                    fontWeight={isStartActive ? "bold" : "500"}
                    className="select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {dot.start.label}
                  </text>
                )}
              </g>

              {/* End Point (Regional Studios: Dehradun, Varanasi, Hyderabad, Madurai) */}
              <g
                key={`end-${i}`}
                className={dot.end.label && onSelectCity ? "cursor-pointer group" : ""}
                onClick={() => dot.end.label && onSelectCity?.(dot.end.label)}
              >
                {/* Active Outer Halo Circle */}
                {isEndActive && (
                  <circle
                    cx={endPt.x}
                    cy={endPt.y}
                    r={isIndiaOnly ? 5.5 : 9}
                    fill="#C47B52"
                    fillOpacity="0.25"
                  />
                )}

                {/* Pulsing Radar Ring */}
                <circle
                  cx={endPt.x}
                  cy={endPt.y}
                  r={isEndActive ? activeRadius : dotRadius}
                  fill={isEndActive ? "#EED77A" : lineColor}
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from={pulseFrom}
                    to={pulseTo}
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Core Pin Dot */}
                <circle
                  cx={endPt.x}
                  cy={endPt.y}
                  r={isEndActive ? activeRadius : dotRadius}
                  fill={isEndActive ? "#FFFFFF" : lineColor}
                  stroke={isEndActive ? "#C47B52" : "#FFFFFF"}
                  strokeWidth={isIndiaOnly ? "0.4" : "0.8"}
                />

                {/* Label */}
                {dot.end.label && (
                  <text
                    x={endPt.x + (isIndiaOnly ? 3.2 : 6)}
                    y={endPt.y + (isIndiaOnly ? 1.2 : 3)}
                    fill={isEndActive ? "#FFFFFF" : "#E5E0D8"}
                    fontSize={fontSize}
                    fontFamily="monospace"
                    fontWeight={isEndActive ? "bold" : "500"}
                    className="select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {dot.end.label}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default WorldMap;
