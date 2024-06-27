import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface EditableComboBoxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editable: boolean;
}

const EditableComboBox: FC<EditableComboBoxProps> = ({
  options,
  value,
  onChange,
  onSave,
  onCancel,
  editable,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  useEffect(() => {
    if (!editable) {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      );
    }
  }, [inputValue, options, editable]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editable) {
      setInputValue(e.target.value);
      onChange(e.target.value);
      setHighlightedIndex(-1); // Reset highlighted index when typing
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        const selectedOption = filteredOptions[highlightedIndex];
        setInputValue(selectedOption);
        onChange(selectedOption);
      }
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex(
        (prevIndex) => (prevIndex + 1) % filteredOptions.length,
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(
        (prevIndex) =>
          (prevIndex - 1 + filteredOptions.length) % filteredOptions.length,
      );
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        name="combo-box-edit"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={editable}
        disabled={!editable}
      />
      {filteredOptions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: "white",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={option}
              onClick={() => {
                setInputValue(option);
                onChange(option);
                inputRef.current?.focus();
              }}
              onDoubleClick={() => onSave()}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              style={{
                padding: "4px",
                cursor: "pointer",
                backgroundColor:
                  highlightedIndex === index ? "#bde4ff" : "transparent",
                minHeight: "0.85em",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableComboBox;
