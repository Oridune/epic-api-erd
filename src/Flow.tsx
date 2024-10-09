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
import { Markers } from "./components/svg/Markers";

const fetchData = async (): Promise<IRawData> => {
  return await fetch(import.meta.env.BASE_URL + "data.json").then((_) =>
    _.json(),
  );
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

let colorIndex = 0;

export function Flow() {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [ready, setReady] = React.useState(false);
  const [editable] = React.useState(false);

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

  const strokeColorClasses = React.useMemo(
    () => ({
      "bg-indigo-600": ["!stroke-indigo-500", "!stroke-indigo-900"],
      "bg-blue-600": ["!stroke-blue-500", "!stroke-blue-900"],
      "bg-red-600": ["!stroke-red-500", "!stroke-red-900"],
      "bg-green-600": ["!stroke-green-500", "!stroke-green-900"],
      "bg-yellow-600": ["!stroke-yellow-500", "!stroke-yellow-900"],
      "bg-slate-600": ["!stroke-slate-500", "!stroke-slate-900"],
      "bg-cyan-600": ["!stroke-cyan-500", "!stroke-cyan-900"],
      "bg-teal-600": ["!stroke-teal-500", "!stroke-teal-900"],
      "bg-orange-600": ["!stroke-orange-500", "!stroke-orange-900"],
      "bg-amber-600": ["!stroke-amber-500", "!stroke-amber-900"],
      "bg-lime-600": ["!stroke-lime-500", "!stroke-lime-900"],
      "bg-violet-600": ["!stroke-violet-500", "!stroke-violet-900"],
      "bg-fuchsia-600": ["!stroke-fuchsia-500", "!stroke-fuchsia-900"],
      "bg-pink-600": ["!stroke-pink-500", "!stroke-pink-900"],
      "bg-rose-600": ["!stroke-rose-500", "!stroke-rose-900"],
    }),
    [],
  );

  const colorClasses = React.useMemo(
    () => Object.keys(strokeColorClasses),
    [strokeColorClasses],
  );

  const getColorClass = React.useCallback(() => {
    colorIndex++;
    const index = colorIndex % colorClasses.length;
    return colorClasses[index];
  }, [colorIndex]);

  const getNodeColorClass = (nodes: Node[], nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.data.colorClass
      ? (node.data.colorClass as string)
      : "bg-indigo-600";
  };

  React.useEffect(() => {
    fetchData().then((data) => {
      const nodes = (data.entities ?? []).map((entity) => ({
        id: entity.id,
        type: "entity",
        label: entity.id,
        data: {
          entity,
          colorClass: getColorClass(),
          editable,
        },
        position: { x: 0, y: 0 },
      }));

      setNodes(nodes);

      const edges = (data.references ?? []).map((reference) => {
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
            colorClasses:
              strokeColorClasses[
                getNodeColorClass(
                  nodes,
                  reference.source,
                ) as keyof typeof strokeColorClasses
              ],
          },
          markerStart: "hasOne",
          markerEnd: reference.relationType === "many" ? "hasMany" : "hasOne",
        };
      });

      setEdges(edges);
    });
  }, []);

  if (!ready && (window._nodeRenderCount ?? 0) > 0) {
    calcLayout("LR");
    setReady(true);
  }

  return (
    <div className={cn(`block h-[100dvh] w-screen`)}>
      <Markers />
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
        minZoom={0.1}
        maxZoom={4}
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
