import {addEdge, Background, ReactFlow, useEdgesState, useNodesState} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback } from "react";
import TableNode, {TableNodeProps} from "../components/TableNode.tsx";

const initialNodes: Array<TableNodeProps> = [
    {
        id: '1',
        type: 'tableNode',
        data: {
            tableName: 'Teachers',
            attributes: [
                {id: 1, fieldType: "PK", name: 'teacherID', type: 'int'},
                {id: 2, fieldType: null, name: 'name', type: 'varchar'},
            ],
        },
        position: {x: 250, y: 0},
        selected: false,
        zIndex: 0,
        isConnectable: false,
        xPos: 0,
        yPos: 0,
        dragging: false
    },
    {
        id: '2',
        type: 'tableNode',
        data: {
            tableName: 'Classes',
            attributes: [
                {id: 1, fieldType: "PK", name: 'classID', type: 'int'},
                {id: 2, fieldType: null, name: 'courseCode', type: 'varchar'},
                {id: 3, fieldType: "FK", name: "teacherID", type: "int"}
            ],
        },
        position: {x: 100, y: 100},
        selected: false,
        zIndex: 0,
        isConnectable: false,
        xPos: 0,
        yPos: 0,
        dragging: false
    },
];

const nodeTypes = { tableNode: TableNode };

function Diagram() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            style={{ width: '100vw', height: '100vh' }}
        >
            <Background />
        </ReactFlow>
    );
}

export default Diagram;
