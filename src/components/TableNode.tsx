import React, {
  ChangeEvent,
  CSSProperties,
  FC,
  useEffect,
  useState,
} from "react";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodeId,
  useReactFlow,
} from "reactflow";
import EditableComboBox from "./EditableComboBox";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

const tableStyle: CSSProperties = {
  border: "1px solid black",
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  minWidth: "100px",
  minHeight: "1em",
};

const thStyle: CSSProperties = {
  border: "1px solid black",
  padding: "4px",
  background: "#f2f2f2",
  height: "100%",
  minHeight: "0.85em",
};

const tdStyle: CSSProperties = {
  border: "1px solid black",
  padding: "6px",
  height: "100%",
  minHeight: "0.85em",
};

const cellDefaultStyle: CSSProperties = {
  height: "100%",
  width: "100%",
  minHeight: "0.85em",
  minWidth: "1em",
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

const databaseTypes = [
  "CHAR(size)",
  "VARCHAR(size)",
  "BINARY(size)",
  "VARBINARY(size)",
  "TEXT(size)",
  "BLOB(size)",
  "SERIAL",
  "BIT(size)",
  "BOOL",
  "INT(size)",
  "INTEGER(size)",
  "BIGINT(size)",
  "DOUBLE()",
  "DOUBLE(size, d)",
  "DECIMAL(size, d)",
  "DATE",
  "DATETIME",
  "TIMESTAMP",
  "TIME",
];

const TableNode: FC<NodeProps<TableNodeProps>> = ({ data }) => {
  const [tableName, setTableName] = useState(data.tableName);
  const [tableNameEditing, setTableNameEditing] = useState<boolean>(false);
  const [tableNameInputValue, setTableNameInputValue] = useState<string>("");

  const [attributes, setAttributes] = useState<Attribute[]>(data.attributes);
  const [attributesEditing, setAttributesEditing] = useState<Cell | null>(null);
  const [attributesInputValue, setAttributesInputValue] = useState("");

  const [hovered, setHovered] = useState(false);
  const [hoveredAttrIds, setHoveredAttrIds] = useState<Set<number>>(new Set());

  const { setNodes, getEdges } = useReactFlow();
  const nodeId = useNodeId();

  useEffect(() => {
    // Reflect any updates in the attributes, up to the parent component
    setNodes((nodes: Node<TableNodeProps>[]) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, tableName, attributes } }
          : node,
      ),
    );
  }, [tableName, nodeId, setNodes, attributes]);

  const edgeExists = (attributeId: number) => {
    const attribute = attributes.find((attr) => attr.id === attributeId);
    if (!attribute) return false;
    const edges = getEdges();

    switch (attribute.fieldType) {
      case "PK":
        return (
          edges.find(
            (edge) =>
              edge.target === nodeId &&
              edge.targetHandle ===
                `${attribute.fieldType?.toLowerCase()}-${attribute.name}`,
          ) !== undefined
        );
      case "FK":
        return (
          edges.find(
            (edge) =>
              edge.source === nodeId &&
              edge.sourceHandle ===
                `${attribute.fieldType?.toLowerCase()}-${attribute.name}`,
          ) !== undefined
        );
      default:
        return false;
    }
  };

  const handleAttributeDoubleClick = (id: number, field: AttributeNames) => {
    if (edgeExists(id)) {
      alert("Cannot change attribute key, remove the relation first.");
    } else {
      setAttributesEditing({ index: id, field });
      const attribute = attributes.find((attr) => attr.id === id);
      if (attribute) setAttributesInputValue(attribute[field] as string);
    }
  };

  const handleTableNameDoubleClick = () => {
    setTableNameEditing(true);
    setTableNameInputValue(tableName);
  };

  const handleAttributeChange = (value: string) => {
    setAttributesInputValue(value);
  };

  const handleTableNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTableNameInputValue(e.target.value);
  };

  const handleAttributeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    field: AttributeNames,
  ) => {
    if (e.key === "Enter") {
      const newAttributes = [...attributes];
      const index = newAttributes.findIndex((attr) => attr.id === id);
      if (index !== -1) {
        newAttributes[index] = {
          ...newAttributes[index],
          [field]: attributesInputValue,
        };
        setAttributes(newAttributes);
        setAttributesEditing(null);
      }
    }
  };

  const handleAttributeTypeSave = () => {
    if (attributesEditing) {
      const { index, field } = attributesEditing;
      const newAttributes = [...attributes];
      const attrIndex = newAttributes.findIndex((attr) => attr.id === index);
      if (attrIndex !== -1) {
        newAttributes[attrIndex] = {
          ...newAttributes[attrIndex],
          [field]: attributesInputValue,
        };
        setAttributes(newAttributes);
        setAttributesEditing(null);
      }
    }
  };

  const handleTableNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setTableName(tableNameInputValue);
      setTableNameEditing(false);
    }
  };

  const handleAttributeBlur = () => {
    setAttributesEditing(null);
  };

  const handleTableNameBlur = () => {
    setTableNameEditing(false);
  };

  const handleAddRow = () => {
    const newId =
      attributes.length > 0
        ? Math.max(...attributes.map((attr) => attr.id)) + 1
        : 0;
    setAttributes([
      ...attributes,
      { id: newId, fieldType: null, name: "", type: "" },
    ]);
  };

  const handleRemoveRow = (attributeId: number) => {
    if (edgeExists(attributeId)) {
      alert(
        "Cannot delete an attribute with an existing relation, remove the relation first.",
      );
    } else {
      setAttributes(attributes.filter((attr) => attr.id !== attributeId));
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
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
                  name="table-name-edit"
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
          {attributes.map((attr: Attribute) => (
            <tr
              key={attr.id}
              style={{ position: "relative" }}
              onMouseEnter={() =>
                setHoveredAttrIds((prev) => new Set(prev).add(attr.id))
              }
              onMouseLeave={() =>
                setHoveredAttrIds((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(attr.id);
                  return newSet;
                })
              }
            >
              <td style={tdStyle}>
                {attributesEditing?.index === attr.id &&
                attributesEditing.field === "fieldType" ? (
                  <EditableComboBox
                    options={["PK", "FK", ""]}
                    value={attr.fieldType || ""}
                    onChange={handleAttributeChange}
                    onSave={handleAttributeTypeSave}
                    onCancel={handleAttributeBlur}
                    editable={false}
                  />
                ) : (
                  <div
                    onDoubleClick={() =>
                      handleAttributeDoubleClick(attr.id, "fieldType")
                    }
                    style={cellDefaultStyle}
                  >
                    {attr.fieldType && (
                      <Handle
                        type={attr.fieldType === "PK" ? "target" : "source"}
                        position={Position.Left}
                        id={`${attr.fieldType.toLowerCase()}-${attr.name}`}
                        style={{ position: "absolute", top: "50%" }}
                      />
                    )}
                    {attr.fieldType || ""}
                  </div>
                )}
              </td>
              <td
                style={{ ...tdStyle, borderRight: "none" }}
                onDoubleClick={() =>
                  handleAttributeDoubleClick(attr.id, "name")
                }
              >
                {attributesEditing?.index === attr.id &&
                attributesEditing.field === "name" ? (
                  <input
                    name="name-edit"
                    value={attributesInputValue}
                    onChange={(e) => handleAttributeChange(e.target.value)}
                    onKeyDown={(e) =>
                      handleAttributeKeyDown(e, attr.id, "name")
                    }
                    onBlur={handleAttributeBlur}
                    autoFocus
                  />
                ) : (
                  <div style={cellDefaultStyle}>{attr.name}</div>
                )}
              </td>
              <td style={{ ...tdStyle, borderLeft: "none" }}>
                {attributesEditing?.index === attr.id &&
                attributesEditing.field === "type" ? (
                  <EditableComboBox
                    options={databaseTypes}
                    value={attributesInputValue}
                    onChange={handleAttributeChange}
                    onSave={handleAttributeTypeSave}
                    onCancel={handleAttributeBlur}
                    editable={true}
                  />
                ) : (
                  <div
                    onDoubleClick={() =>
                      handleAttributeDoubleClick(attr.id, "type")
                    }
                    style={cellDefaultStyle}
                  >
                    {attr.type}
                  </div>
                )}
                {hoveredAttrIds.has(attr.id) && (
                  <IoIosRemove
                    onClick={() => handleRemoveRow(attr.id)}
                    style={{
                      position: "absolute",
                      right: -20,
                      top: 3,
                      background: "white",
                      border: "1px solid black",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hovered && (
        <IoIosAdd
          onClick={handleAddRow}
          style={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            border: "1px solid black",
            borderRadius: "50%",
            width: 24,
            height: 24,
            cursor: "pointer",
          }}
        />
      )}
    </div>
  );
};

export default TableNode;
