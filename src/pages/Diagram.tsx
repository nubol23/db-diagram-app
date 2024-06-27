import {
    addEdge,
    Background,
    Connection,
    ControlButton,
    Controls,
    Edge,
    Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import React, {FC, useCallback, useState} from "react";
import TableNode, {TableNodeProps} from "../components/TableNode.tsx";
import ManyToOneEdge from "../components/ManyToOneEdge.tsx";
import OneToOneEdge from "../components/OneToOneEdge.tsx";
import {FaFileExport} from "react-icons/fa";
import {ComparableDiagram, DiagramState} from "../App.tsx";

export interface DiagramProps {
    handleDiagramState: (diagramState: ComparableDiagram) => void;
    handleExportTrigger: (exportTrigger: boolean) => void;
}

const initialNodes: Node<TableNodeProps>[] = [
    {
        id: '0',
        type: 'tableNode',
        data: {
            tableName: 'Teachers',
            attributes: [
                {id: 0, fieldType: "PK", name: 'teacherID', type: 'int'},
                {id: 1, fieldType: null, name: 'name', type: 'varchar'},
            ],
        },
        position: {x: 250, y: 0},
    },
    {
        id: '1',
        type: 'tableNode',
        data: {
            tableName: 'Classes',
            attributes: [
                {id: 0, fieldType: "PK", name: 'classID', type: 'int'},
                {id: 1, fieldType: null, name: 'courseCode', type: 'varchar'},
                {id: 2, fieldType: "FK", name: "teacherID", type: "int"}
            ],
        },
        position: {x: 100, y: 100},
    },
];

const nodeTypes = {tableNode: TableNode};
const edgeTypes = {manyToOne: ManyToOneEdge, oneToOne: OneToOneEdge};

const Diagram: FC<DiagramProps> = ({ handleDiagramState, handleExportTrigger }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [isConnecting, setIsConnecting] = useState(false);

    const {screenToFlowPosition} = useReactFlow();

    const onConnect = useCallback(
        (connection: Connection | Edge) => {
            const edge = {...connection, type: "manyToOne"};
            setEdges((eds) => addEdge(edge, eds))
        },
        [setEdges],
    );

    const handleAddNode = (e: React.MouseEvent) => {
        if (!isConnecting) {
            const newNode = {
                id: `${
                    nodes.length == 0
                        ? "0"
                        : (Math.max(...nodes.map(node => Number(node.id))) + 1).toString()
                }`,
                type: 'tableNode',
                position: screenToFlowPosition({x: e.clientX, y: e.clientY}),
                data: {tableName: "", attributes: []}
            }

            setNodes((prev) => prev.concat(newNode))
        }
    }

    const generateComparableDiagram = (diagramState: DiagramState): ComparableDiagram => {
        const exportedNodes = diagramState.nodes.map(node => node.data);

        const exportedEdges = diagramState.edges.map(edge => ({
            sourceTableName: nodes.find(node => node.id === edge.source)?.data.tableName || "",
            targetTableName: nodes.find(node => node.id === edge.target)?.data.tableName || "",
            sourceHandle: edge.sourceHandle || "",
            targetHandle: edge.targetHandle || "",
            type: edge.type as "manyToOne" | "oneToOne",
        }));

        return {
            nodes: exportedNodes,
            edges: exportedEdges,
        };
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            style={{width: '100vw', height: '100vh'}}
            onPaneClick={handleAddNode}
            onEdgeUpdateStart={() => setIsConnecting(true)}
            onEdgeUpdateEnd={() => setIsConnecting(false)}
        >
            <Background/>
            <Controls>
                <ControlButton onClick={
                    () => {
                        handleExportTrigger(true);
                        handleDiagramState(generateComparableDiagram({nodes, edges}));
                    }
                }>
                    <FaFileExport />
                </ControlButton>
            </Controls>
        </ReactFlow>
    );
}

export default Diagram;
