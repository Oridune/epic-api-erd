/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import dagre from "@dagrejs/dagre";
import { cn } from "./lib/utils";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  addEdge,
  useReactFlow,
  Panel,
} from "@xyflow/react";
import { IRawData, GraphDirection } from "./types";
import { Entity } from "./components/Entity";
import { Relation } from "./components/Relation";

const fetchData = async (): Promise<IRawData> => {
  return await fetch("data.json").then((_) => _.json());
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: GraphDirection },
) => {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export function Flow() {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [ready, setReady] = React.useState(false);

  const calcLayout = React.useCallback(
    (direction: GraphDirection) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

  React.useEffect(() => {
    fetchData().then((data) => {
      setNodes(() =>
        data.entities.map((entity) => ({
          id: entity.id,
          type: "entity",
          label: entity.id,
          data: { entity },
          position: { x: 0, y: 0 },
        })),
      );

      setEdges(() =>
        data.references.map((reference) => {
          const sourceHandle = [
            "source",
            reference.source,
            reference.sourceField,
            reference.sourcePosition ?? "top",
          ]
            .filter(Boolean)
            .join("-");
          const targetHandle = [
            "target",
            reference.target,
            reference.targetField,
            reference.targetPosition ?? "top",
          ]
            .filter(Boolean)
            .join("-");

          return {
            id: `${sourceHandle}-${targetHandle}`,
            type: "relation",
            source: reference.source,
            sourceHandle,
            target: reference.target,
            targetHandle,
            animated: reference.type === "relation",
            data: {
              label: `${reference.source}-${reference.relationType ?? "one"}-${reference.target}`,
            },
          };
        }),
      );
    });
  }, []);

  if (!ready && (window._nodeRenderCount ?? 0) > 0) {
    calcLayout("LR");
    setReady(true);
  }

  return (
    <div className={cn(`block h-[100dvh] w-screen`)}>
      <ReactFlow
        nodeTypes={{
          entity: Entity,
        }}
        edgeTypes={{
          relation: Relation,
        }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((e) => addEdge(params, e))}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <button className="btn mx-2" onClick={() => calcLayout("TB")}>
            Vertical Layout
          </button>
          <button className="btn mx-2" onClick={() => calcLayout("LR")}>
            Horizontal Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
