import {
  EdgeProps,
  BezierEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";

export function Relation(props: EdgeProps) {
  const [, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <p
          className="absolute bg-white text-xs text-gray-500"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {props.data?.label as string}
        </p>
      </EdgeLabelRenderer>
    </>
  );
}
