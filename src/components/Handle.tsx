import { HandleProps, Handle as RFHandle } from "@xyflow/react";

export function Handle(props: HandleProps & { disabled?: boolean }) {
  return (
    <RFHandle
      {...props}
      isConnectable={!props.disabled}
      style={{
        background: props.disabled ? "transparent" : "lightGray",
        border: props.disabled ? "none" : "1px solit white",
        ...props.style,
      }}
    />
  );
}
