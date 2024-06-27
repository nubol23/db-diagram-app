import {addEdge, Background, Connection, Edge, Node, ReactFlow, useEdgesState, useNodesState} from "reactflow";
import "reactflow/dist/style.css";
import {useCallback} from "react";
import TableNode, {TableNodeProps} from "../components/TableNode.tsx";
import ManyToOneEdge from "../components/ManyToOneEdge.tsx";
import OneToOneEdge from "../components/OneToOneEdge.tsx";

const initialNodes: Node<TableNodeProps>[] = [
    {
        id: '1',
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
        id: '2',
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

function Diagram() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (connection: Connection | Edge) => {
            const edge = {...connection, type: "manyToOne"};
            setEdges((eds) => addEdge(edge, eds))
        },
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
            edgeTypes={edgeTypes}
            fitView
            style={{width: '100vw', height: '100vh'}}
        >
            <Background/>
        </ReactFlow>
    );
}

export default Diagram;
