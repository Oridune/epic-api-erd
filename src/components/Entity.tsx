import React from "react";
import { Position, type NodeProps, type Node } from "@xyflow/react";
import { Handle } from "./Handle";
import { IEntity } from "../types";

export function Entity(props: NodeProps<Node<{ entity: IEntity }>>) {
  const entityRef = React.useRef(null);

  React.useEffect(() => {
    if (entityRef.current) {
      window._nodeRenderCount ??= 0;
      window._nodeRenderCount += 1;
    }
  }, [props.id]);

  return (
    <div ref={entityRef} className="rounded-md border bg-white">
      <Handle
        id={`source-${props.data.entity.id}-top`}
        type="source"
        position={Position.Top}
      />
      <Handle
        id={`target-${props.data.entity.id}-top`}
        type="target"
        position={Position.Top}
      />
      <div className="rounded-t-md bg-indigo-600">
        <h1 className="text-center text-white">{props.data.entity.id}</h1>
      </div>
      {props.data.entity.fields.map((field, index) => (
        <div key={"field-" + index} className="relative">
          <Handle
            id={`source-${props.data.entity.id}-${field.id}-left`}
            type="source"
            position={Position.Left}
            style={{ top: 15 }}
          />
          <Handle
            id={`target-${props.data.entity.id}-${field.id}-left`}
            type="target"
            position={Position.Left}
            style={{ top: 15 }}
          />
          <div
            className="grid grid-cols-2 gap-2 px-2 pt-1"
            title={field.description}
          >
            <p className="text-sm">{field.id}</p>
            <p className="text-right text-sm text-gray-500">{field.type}</p>
          </div>
          <Handle
            id={`source-${props.data.entity.id}-${field.id}-right`}
            type="source"
            position={Position.Right}
            style={{ top: 15 }}
          />
          <Handle
            id={`target-${props.data.entity.id}-${field.id}-right`}
            type="target"
            position={Position.Right}
            style={{ top: 15 }}
          />
        </div>
      ))}
      <div className="pt-1"></div>
      <Handle
        id={`source-${props.data.entity.id}-bottom`}
        type="source"
        position={Position.Bottom}
      />
      <Handle
        id={`target-${props.data.entity.id}-bottom`}
        type="target"
        position={Position.Bottom}
      />
    </div>
  );
}
