import React from "react";
import { Position, type NodeProps, type Node } from "@xyflow/react";
import { Handle } from "./Handle";
import { IEntity } from "../types";
import { cn } from "../lib/utils";
import { KeyIcon } from "./svg/KeyIcon";
import { LinkIcon } from "./svg/LinkIcon";

export function EntityField(props: {
  entity: IEntity;
  field: IEntity["fields"][number];
  editable?: boolean;
}) {
  const field = props.field;

  const fieldParts = field.id.split(".");
  const fieldLast = fieldParts.pop();

  const subTypes = field.choices ?? field.patterns ?? field.types;
  const subType = subTypes.join(field.isAllOf ? " & " : " | ");

  const fullType =
    subTypes.length > 1
      ? field.isArray
        ? `(${subType})[]`
        : subType
      : field.isArray
        ? subType + "[]"
        : subType;
  const type = field.patterns ? "pattern" : field.choices ? "enum" : fullType;

  return (
    <div className="relative">
      <Handle
        id={`source-${props.entity.id}-${field.id}-left`}
        type="source"
        position={Position.Left}
        style={{ top: 15, left: "0%" }}
        disabled={!props.editable}
      />
      <Handle
        id={`target-${props.entity.id}-${field.id}-left`}
        type="target"
        position={Position.Left}
        style={{ top: 15, left: "0%" }}
        disabled={!props.editable}
      />
      <div
        className="grid grid-cols-12 gap-2 px-2 pt-1"
        title={[field.description, field.optional ? "(Optional)" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="col-span-1">
          {field.isPrimary && (
            <KeyIcon className="h-5 w-5 fill-amber-500" title="Primary Key" />
          )}
          {!field.isPrimary && field.types.includes("object") && (
            <LinkIcon
              className="h-5 w-5 fill-amber-500"
              title="Embedded Document"
            />
          )}
        </div>
        <p
          className="col-span-6 text-sm"
          dangerouslySetInnerHTML={{
            __html:
              (fieldParts.length
                ? `<span class="text-gray-500"><i>${fieldParts.join(".")}</i></span>.${fieldLast}`
                : fieldLast) +
              (field.optional ? `<span class="text-red-500">?</span>` : ""),
          }}
        />
        <p
          className="col-span-5 text-right text-sm text-gray-400"
          title={[
            fullType,
            field.minLength && `minLength: ${field.minLength}`,
            field.maxLength && `maxLength: ${field.maxLength}`,
            field.minAmount && `minAmount: ${field.minAmount}`,
            field.maxAmount && `maxAmount: ${field.maxAmount}`,
            field.startsAt &&
              `startsAt: ${new Date(field.startsAt).toLocaleString()}`,
            field.endsAt &&
              `endsAt: ${new Date(field.endsAt).toLocaleString()}`,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {field.expected ?? type}
        </p>
      </div>
      <Handle
        id={`source-${props.entity.id}-${field.id}-right`}
        type="source"
        position={Position.Right}
        style={{ top: 15, left: "100%" }}
        disabled={!props.editable}
      />
      <Handle
        id={`target-${props.entity.id}-${field.id}-right`}
        type="target"
        position={Position.Right}
        style={{ top: 15, left: "100%" }}
        disabled={!props.editable}
      />
    </div>
  );
}

export function Entity(
  props: NodeProps<
    Node<{
      entity: IEntity;
      colorClass: string;
      editable?: boolean;
    }>
  >,
) {
  const entityRef = React.useRef(null);

  React.useEffect(() => {
    if (entityRef.current) {
      window._nodeRenderCount ??= 0;
      window._nodeRenderCount += 1;
    }
  }, [props.id]);

  return (
    <div ref={entityRef} className="rounded-md border bg-white font-mono">
      <Handle
        id={`source-${props.data.entity.id}-top`}
        type="source"
        position={Position.Top}
        disabled={!props.data.editable}
      />
      <Handle
        id={`target-${props.data.entity.id}-top`}
        type="target"
        position={Position.Top}
        disabled={!props.data.editable}
      />
      <div className={cn("rounded-t-md", props.data.colorClass)}>
        <h1 className="text-center text-white">{props.data.entity.id}</h1>
      </div>
      {props.data.entity.fields.map((field, index) => (
        <EntityField
          key={"field-" + index}
          entity={props.data.entity}
          field={field}
          editable={props.data.editable}
        />
      ))}
      <div className="pt-1"></div>
      <Handle
        id={`source-${props.data.entity.id}-bottom`}
        type="source"
        position={Position.Bottom}
        disabled={!props.data.editable}
      />
      <Handle
        id={`target-${props.data.entity.id}-bottom`}
        type="target"
        position={Position.Bottom}
        disabled={!props.data.editable}
      />
    </div>
  );
}
