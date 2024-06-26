import {CSSProperties, FC } from 'react';
import {Handle, NodeProps, Position } from 'reactflow';

const tableStyle: CSSProperties = {
    border: '1px solid black',
    width: '100%',
    borderCollapse: 'collapse'
};

const thStyle: CSSProperties = {
    border: '1px solid black',
    padding: '4px',
    background: '#f2f2f2',
};

const tdStyle: CSSProperties = {
    border: '1px solid black',
    padding: '6px',
};

type fieldTypes = "PK" | "FK" | null;

interface Attribute {
    fieldType: fieldTypes;
    name: string;
    type: string;
}

export interface TableNodeProps extends NodeProps {
    data: {
        tableName: string;
        attributes: Attribute[];
    };
    position: { x: number; y: number };
}


const TableNode: FC<TableNodeProps> = ({ data}) => {
    return (
        <>
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle} colSpan={3}>{data.tableName}</th>
                </tr>
                </thead>
                <tbody>
                {data.attributes.map((attr: Attribute, index: number) => (
                    <tr key={attr.name} style={{position: "relative"}}>
                        <td style={tdStyle}>{
                            <>
                                {
                                    attr.fieldType &&
                                    <Handle
                                        type={attr.fieldType === 'PK' ? "target" : "source"}
                                        position={Position.Left}
                                        id={`${attr.fieldType.toLowerCase()}-${index}`}
                                        style={{ position: "absolute", top: "50%" }}
                                    />
                                }
                                {attr.fieldType || ""}
                            </>
                        }</td>
                        <td style={{...tdStyle, borderRight: "none"}}>{attr.name}</td>
                        <td style={{...tdStyle, borderLeft: "none"}}>{attr.type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default TableNode;
