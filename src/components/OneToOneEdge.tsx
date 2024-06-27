import { FC, useRef } from "react";
import { EdgeProps, getSmoothStepPath, useReactFlow } from "reactflow";

const OneToOneEdge: FC<EdgeProps> = ({
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

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        ref={pathRef}
        id={id}
        stroke="transparent"
        fill="none"
        strokeWidth={10}
        d={edgePath}
        markerEnd={markerEnd}
        onDoubleClick={() =>
          setEdges((edges) =>
            edges.map((edge) =>
              edge.id === id ? { ...edge, type: "manyToOne" } : edge,
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
    </>
  );
};

export default OneToOneEdge;
