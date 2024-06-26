import React, {ChangeEvent, CSSProperties, FC, useEffect, useState} from 'react';
import {Handle, Node, NodeProps, Position, useNodeId, useReactFlow} from 'reactflow';

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

export interface TableNodeProps {
    tableName: string;
    attributes: Attribute[];
}

interface Cell {
    index: number;
    field: AttributeNames;
}

const TableNode: FC<NodeProps<TableNodeProps>> = ({data}) => {
    const [tableName, setTableName] = useState(data.tableName);
    const [tableNameEditing, setTableNameEditing] = useState<boolean>(false);
    const [tableNameInputValue, setTableNameInputValue] = useState<string>("");

    const [attributes, setAttributes] = useState<Attribute[]>(data.attributes);
    const [attributesEditing, setAttributesEditing] = useState<Cell | null>(null);
    const [attributesInputValue, setAttributesInputValue] = useState("");

    const [hovered, setHovered] = useState(false);
    const [hoveredAttr, setHoveredAttr] = useState(Array(data.attributes.length).fill(false));

    const {setNodes} = useReactFlow();
    const nodeId = useNodeId();

    useEffect(() => {
        // Reflect any updates in the attributes, up to the parent component
        setNodes(
            (
                nodes: Node<TableNodeProps>[]
            ) => nodes.map(
                node => node.id === nodeId
                    ? {...node, data: {...node.data, tableName, attributes}}
                    : node
            )
        )
    }, [tableName, nodeId, setNodes, attributes]);

    const handleAttributeDoubleClick = (index: number, field: AttributeNames) => {
        setAttributesEditing({index, field});
        setAttributesInputValue(attributes[index][field] as string);
    };

    const handleTableNameDoubleClick = () => {
        setTableNameEditing(true);
        setTableNameInputValue(tableName);
    }

    const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAttributesInputValue(e.target.value);
    };

    const handleTableNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTableNameInputValue(e.target.value);
    }

    const handleAttributeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: AttributeNames) => {
        if (e.key === 'Enter') {
            const newAttributes = [...attributes];
            newAttributes[index] = {...newAttributes[index], [field]: attributesInputValue};
            setAttributes(newAttributes);
            setAttributesEditing(null);
        }
    };

    const handleTableNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setTableName(tableNameInputValue)
            setTableNameEditing(false);
        }
    }

    const handleAttributeBlur = () => {
        setAttributesEditing(null);
    };

    const handleTableNameBlur = () => {
        setTableNameEditing(false);
    }

    const handleAddRow = () => {
        const newId = attributes.length + 1;
        setAttributes([...attributes, {id: newId, fieldType: null, name: '', type: ''}]);
    };

    const handleRemoveRow = (rowId: number) => {
        setAttributes(attributes.filter(attr => attr.id !== rowId));
    }

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{position: 'relative'}}
        >
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th
                        style={thStyle}
                        colSpan={3}
                        onDoubleClick={handleTableNameDoubleClick}
                    >
                        {tableNameEditing ? (
                            <input
                                value={tableNameInputValue}
                                onChange={handleTableNameChange}
                                onKeyDown={(e) => handleTableNameKeyDown(e)}
                                onBlur={handleTableNameBlur}
                                autoFocus
                            />
                        ) : (
                            tableName
                        )}
                    </th>
                </tr>
                </thead>
                <tbody>
                {attributes.map((attr: Attribute, index: number) => (
                    <tr
                        key={attr.id}
                        style={{position: "relative"}}
                        onMouseEnter={
                            () => setHoveredAttr(hoveredAttr.map((_val, i) => i === (attr.id - 1)))
                        }
                        onMouseLeave={
                            () => setHoveredAttr(hoveredAttr.map((val, i) => i === attr.id - 1 ? false : val))
                        }
                    >
                        <td style={tdStyle}>{
                            <>
                                {
                                    attr.fieldType &&
                                    <Handle
                                        type={attr.fieldType === 'PK' ? "target" : "source"}
                                        position={Position.Left}
                                        id={`${attr.fieldType.toLowerCase()}-${index}`}
                                        style={{position: "absolute", top: "50%"}}
                                    />
                                }
                                {attr.fieldType || ""}
                            </>
                        }</td>
                        <td
                            style={{...tdStyle, borderRight: "none"}}
                            onDoubleClick={() => handleAttributeDoubleClick(index, 'name')}
                        >
                            {attributesEditing?.index === index && attributesEditing.field === 'name' ? (
                                <input
                                    value={attributesInputValue}
                                    onChange={handleAttributeChange}
                                    onKeyDown={(e) => handleAttributeKeyDown(e, index, 'name')}
                                    onBlur={handleAttributeBlur}
                                    autoFocus
                                />
                            ) : (
                                attr.name
                            )}
                        </td>
                        <td
                            style={{...tdStyle, borderLeft: "none"}}
                            onDoubleClick={() => handleAttributeDoubleClick(index, 'type')}
                        >
                            {attributesEditing?.index === index && attributesEditing.field === 'type' ? (
                                <input
                                    value={attributesInputValue}
                                    onChange={handleAttributeChange}
                                    onKeyDown={(e) => handleAttributeKeyDown(e, index, 'type')}
                                    onBlur={handleAttributeBlur}
                                    autoFocus
                                />
                            ) : (
                                attr.type
                            )}
                            {hoveredAttr[attr.id - 1] && <button
                                onClick={() => handleRemoveRow(attr.id)}
                                style={{
                                    position: 'absolute',
                                    right: -20,
                                    background: 'white',
                                    border: '1px solid black',
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    cursor: 'pointer'
                                }}
                            >
                                -
                            </button>}
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
