import React, { useEffect, useState } from "react";
import "./App.css";
import Diagram from "./pages/Diagram.tsx";
import { Edge, Node, ReactFlowProvider } from "reactflow";
import { fieldTypes, TableNodeProps } from "./components/TableNode.tsx";

export interface DiagramState {
  nodes: Node<TableNodeProps>[];
  edges: Edge[];
}

interface ComparableAttribute {
  fieldType: fieldTypes;
  name: string;
  type: string;
}

export interface ComparableTableNodeProps {
  tableName: string;
  attributes: ComparableAttribute[];
}

interface ComparableEdge {
  sourceTableName: string;
  targetTableName: string;
  sourceHandle: string;
  targetHandle: string;
  type: "manyToOne" | "oneToOne";
}

export interface ComparableDiagram {
  nodes: ComparableTableNodeProps[];
  edges: ComparableEdge[];
}

const App: React.FC = () => {
  const [clickTrigger, setClickTrigger] = useState<boolean>(false);
  const [comparableDiagram, setComparableDiagram] = useState<ComparableDiagram>(
    { nodes: [], edges: [] },
  );

  useEffect(() => {
    if (clickTrigger) {
      // Run your comparison here either in web or with an API Call
      console.log(JSON.stringify(comparableDiagram, null, 2));

      setClickTrigger(false);
    }
  }, [comparableDiagram, clickTrigger]);

  return (
    <ReactFlowProvider>
      <Diagram
        handleDiagramState={setComparableDiagram}
        handleExportTrigger={setClickTrigger}
      />
    </ReactFlowProvider>
  );
};

export default App;
