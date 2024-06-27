import {FC, useEffect, useRef, useState} from 'react';
import {EdgeProps, getSmoothStepPath} from 'reactflow';

const CrowsFootEdge: FC<EdgeProps> = ({
                                          id,
                                          sourceX,
                                          sourceY,
                                          targetX,
                                          targetY,
                                          sourcePosition,
                                          targetPosition,
                                          markerEnd,
                                      }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [adjustedSource, setAdjustedSource] = useState({ x: sourceX, y: sourceY });

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
    const ux = dx / length;
    const uy = dy / length;

    // Coordinates for the crow's foot
    const footSpread = 10; // Horizontal spread
    const legLength = 5; // Length of the legs

    const leg1X = sourceX - uy * footSpread - ux * legLength;
    const leg1Y = sourceY + ux * footSpread - uy * legLength;
    const leg2X = sourceX + uy * footSpread - ux * legLength;
    const leg2Y = sourceY - ux * footSpread - uy * legLength;

    const footPath = `
    M${adjustedSource.x},${adjustedSource.y}
    L${leg1X},${leg1Y}
    M${adjustedSource.x},${adjustedSource.y}
    L${leg2X},${leg2Y}
  `;

    return (
        <>
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

export default CrowsFootEdge;
