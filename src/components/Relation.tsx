import { EdgeProps, SmoothStepEdge } from "@xyflow/react";
import React from "react";

export function Relation(props: EdgeProps) {
  React.useEffect(() => {
    const el = document.getElementById(props.id);

    if (el) {
      let ignoreHover = false;

      const onMouseEnter = () => {
        if (!ignoreHover) {
          el.classList.remove(colorClasses[0]);
          el.classList.add(colorClasses[1]);
        }
      };

      const onMouseLeave = () => {
        if (!ignoreHover) {
          el.classList.remove(colorClasses[1]);
          el.classList.add(colorClasses[0]);
        }
      };

      const onClick = () => {
        if (ignoreHover) {
          el.classList.remove(colorClasses[1]);
          el.classList.add(colorClasses[0]);
          ignoreHover = false;
        } else {
          el.classList.remove(colorClasses[0]);
          el.classList.add(colorClasses[1]);
          ignoreHover = true;
        }
      };

      const colorClasses = (props.data?.colorClasses as string[]) ?? [];

      el.classList.add("transition-all");
      el.classList.add(colorClasses[0]);

      el.parentNode?.addEventListener("mouseenter", onMouseEnter);
      el.parentNode?.addEventListener("mouseleave", onMouseLeave);
      el.parentNode?.addEventListener("click", onClick);

      return () => {
        el.parentNode?.removeEventListener("mouseenter", onMouseEnter);
        el.parentNode?.removeEventListener("mouseleave", onMouseLeave);
        el.parentNode?.removeEventListener("click", onClick);
      };
    }
  }, [props.data?.colorClasses, props.id]);

  return (
    <>
      <SmoothStepEdge {...props} />
      {/* <EdgeLabelRenderer>
        <p
          className="absolute bg-white text-xs text-gray-500"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {props.data?.label as string}
        </p>
      </EdgeLabelRenderer> */}
    </>
  );
}
