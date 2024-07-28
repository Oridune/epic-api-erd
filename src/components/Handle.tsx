import { HandleProps, Handle as RFHandle } from "@xyflow/react";

export function Handle(props: HandleProps) {
  return (
    <RFHandle
      {...props}
      style={{
        background: "lightGray",
        ...props.style,
      }}
    />
  );
}
