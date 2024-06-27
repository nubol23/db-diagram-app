import React from 'react';
import './App.css';
import Diagram from "./pages/Diagram.tsx";
import {ReactFlowProvider} from "reactflow";

const App: React.FC = () => {
    return (
        <ReactFlowProvider>
            <Diagram/>
        </ReactFlowProvider>
    );
};

export default App;