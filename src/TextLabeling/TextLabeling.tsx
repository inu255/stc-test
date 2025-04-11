import { useState, useRef, useEffect } from "react";
import { Label, TextLabel, TextLabelingProps } from "./Types";

import "./TextLabeling.css";

const TextLabeling = ({ labels, text, labeling, onChange }: TextLabelingProps) => {
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleLabelClick = (label: Label) => {
    setSelectedLabel(label === selectedLabel ? null : label);
  };

  const handleTextMouseUp = () => {
    if (!selectedLabel || !textRef.current) return;

    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(textRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + selection.toString().length;

    const newLabel: TextLabel = {
      start,
      end,
      label: selectedLabel.label,
    };
    onChange([...labeling, newLabel]);

    selection.removeAllRanges();
  };

  useEffect(() => {
    if (!textRef.current) return;

    const textNode = textRef.current;
    textNode.innerHTML = text.replace(/\n/g, "<br>");

    labeling.forEach((label, index) => {
      const { start, end, label: labelText } = label;
      const labelConfig = labels.find((l) => l.label === labelText);
      if (!labelConfig) return;

      const range = document.createRange();
      let startNode: Node = textNode;
      let startOffset = 0;
      let endNode: Node = textNode;
      let endOffset = 0;

      let charCount = 0;
      const walker = document.createTreeWalker(textNode, NodeFilter.SHOW_TEXT, null);

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const nodeLength = node.textContent?.length || 0;

        if (charCount <= start && charCount + nodeLength > start) {
          startNode = node;
          startOffset = start - charCount;
        }

        if (charCount <= end && charCount + nodeLength >= end) {
          endNode = node;
          endOffset = end - charCount;
          break;
        }

        charCount += nodeLength;
      }

      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);

      const span = document.createElement("span");
      span.className = "highlight";
      span.style.backgroundColor = labelConfig.color;
      span.dataset.labelIndex = index.toString();
      span.title = labelText;

      try {
        range.surroundContents(span);
      } catch (e) {
        console.error("Error highlighting text:", e);
      }
    });
  }, [text, labeling, labels]);

  return (
    <div className="text-labeling-container">
      <div className="document-panel panel">
        <h2>Документ</h2>
        <div className="document-text" ref={textRef} onMouseUp={handleTextMouseUp} />
      </div>
      <div className="labels-panel panel">
        <h2>Метки</h2>
        <div className="labels-list">
          {labels.map((label, index) => (
            <div
              key={index}
              className={`label-item ${selectedLabel === label ? "selected" : ""}`}
              onClick={() => handleLabelClick(label)}
            >
              <span className="label-color" style={{ backgroundColor: label.color }} />
              <span className="label-text">{label.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextLabeling;
