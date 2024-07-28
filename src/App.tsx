import { cn } from "./lib/utils";
import { ReactFlowProvider } from "@xyflow/react";
import { Flow } from "./Flow";

export function App() {
  return (
    <div className={cn(`block h-[100dvh] w-screen`)}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
