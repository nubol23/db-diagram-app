import React, { ChangeEvent, CSSProperties, FC, useEffect, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

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
    id: number;
    fieldType: fieldTypes;
    name: string;
    type: string;
}
type AttributeNames = keyof Attribute;

export interface TableNodeProps extends NodeProps {
    data: {
        tableName: string;
        attributes: Attribute[];
    };
    position: { x: number; y: number };
}

interface Cell {
    index: number;
    field: AttributeNames;
}

const TableNode: FC<TableNodeProps> = ({ data }) => {
    const [editing, setEditing] = useState<Cell | null>(null);
    const [attributes, setAttributes] = useState<Attribute[]>(data.attributes);
    const [inputValue, setInputValue] = useState("");
    const [hovered, setHovered] = useState(false);

    const handleDoubleClick = (index: number, field: AttributeNames) => {
        setEditing({ index, field });
        setInputValue(attributes[index][field] as string);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: AttributeNames) => {
        if (e.key === 'Enter') {
            const newAttributes = [...attributes];
            newAttributes[index] = { ...newAttributes[index], [field]: inputValue };
            setAttributes(newAttributes);
            setEditing(null);
        }
    };

    const handleBlur = () => {
        setEditing(null);
    };

    const handleAddRow = () => {
        const newId = attributes.length + 1;
        setAttributes([...attributes, { id: newId, fieldType: null, name: '', type: '' }]);
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position: 'relative' }}
        >
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle} colSpan={3}>{data.tableName}</th>
                </tr>
                </thead>
                <tbody>
                {attributes.map((attr: Attribute, index: number) => (
                    <tr key={attr.id} style={{ position: "relative" }}>
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
                        <td
                            style={{ ...tdStyle, borderRight: "none" }}
                            onDoubleClick={() => handleDoubleClick(index, 'name')}
                        >
                            {editing?.index === index && editing.field === 'name' ? (
                                <input
                                    value={inputValue}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, index, 'name')}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                            ) : (
                                attr.name
                            )}
                        </td>
                        <td
                            style={{ ...tdStyle, borderLeft: "none" }}
                            onDoubleClick={() => handleDoubleClick(index, 'type')}
                        >
                            {editing?.index === index && editing.field === 'type' ? (
                                <input
                                    value={inputValue}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, index, 'type')}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                            ) : (
                                attr.type
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {hovered && (
                <button
                    onClick={handleAddRow}
                    style={{
                        position: 'absolute',
                        bottom: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'white',
                        border: '1px solid black',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        cursor: 'pointer'
                    }}
                >
                    +
                </button>
            )}
        </div>
    );
};

export default TableNode;
