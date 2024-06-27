import { FC, useEffect, useRef, useState } from "react";
import { EdgeProps, getSmoothStepPath, useReactFlow } from "reactflow";

const ManyToOneEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const { setEdges } = useReactFlow();
  const pathRef = useRef<SVGPathElement>(null);
  const [adjustedSource, setAdjustedSource] = useState({
    x: sourceX,
    y: sourceY,
  });

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    if (pathRef.current) {
      const offset = 10; // Adjust this value to move the crow's foot further from the source
      const point = pathRef.current.getPointAtLength(offset);
      setAdjustedSource({ x: point.x, y: point.y });
    }
  }, [edgePath]);

  // Calculate the direction from the source point to the adjusted source point
  const dx = adjustedSource.x - sourceX;
  const dy = adjustedSource.y - sourceY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = length ? dx / length : 0;
  const uy = length ? dy / length : 0;

  // Coordinates for the crow's foot
  const footSpread = 10; // Horizontal spread
  const legLength = 5;

  const leg1X = sourceX - uy * footSpread - ux * legLength;
  const leg1Y = sourceY + ux * footSpread - uy * legLength;
  const leg2X = sourceX + uy * footSpread - ux * legLength;
  const leg2Y = sourceY - ux * footSpread - uy * legLength;

  const isValidCoordinate = (value: number) => !isNaN(value) && isFinite(value);

  const footPath = `
    M${adjustedSource.x},${adjustedSource.y}
    ${isValidCoordinate(leg1X) && isValidCoordinate(leg1Y) ? `L${leg1X},${leg1Y}` : ""}
    M${adjustedSource.x},${adjustedSource.y}
    ${isValidCoordinate(leg2X) && isValidCoordinate(leg2Y) ? `L${leg2X},${leg2Y}` : ""}
  `;

  return (
    <>
      <path
        // Make the invisible path thicker for a larger clickable area
        ref={pathRef}
        id={id}
        d={edgePath}
        stroke="transparent"
        fill="none"
        strokeWidth={10}
        onDoubleClick={() =>
          setEdges((edges) =>
            edges.map((edge) =>
              edge.id === id ? { ...edge, type: "oneToOne" } : edge,
            ),
          )
        }
      />
      <path
        ref={pathRef}
        id={id}
        stroke="#000"
        fill="none"
        strokeWidth={1}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path d={footPath} stroke="#000" fill="none" strokeWidth={1} />
    </>
  );
};

export default ManyToOneEdge;
