import React, { useState } from "react";
import { getBlockDefinition } from "../utils/blockTypes";

export default function Block({
  block,
  onDragStart,
  onDragEnd,
  onInputChange,
  onRemove,
  isDragging = false,
  isInPalette = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const definition = getBlockDefinition(block.type);

  if (!definition) {
    return <div className="bg-red-500 text-white p-2 rounded">Unknown block type</div>;
  }

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, block);
    }
  };

  const handleInputChange = (inputKey, value) => {
    if (onInputChange) {
      onInputChange(inputKey, value);
    }
  };

  const handleDoubleClick = () => {
    if (!isInPalette) {
      setIsEditing(true);
    }
  };

  const renderInput = (inputKey, inputDef) => {
    const value = inputDef.default;

    if (isEditing && !isInPalette) {
      if (inputDef.type === "number") {
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(inputKey, parseFloat(e.target.value) || 0)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
            className="bg-white bg-opacity-30 border border-white border-opacity-50 rounded px-2 py-1 w-16 text-center text-white placeholder-white placeholder-opacity-70"
            autoFocus
          />
        );
      } else {
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(inputKey, e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
            className="bg-white bg-opacity-30 border border-white border-opacity-50 rounded px-2 py-1 min-w-16 text-center text-white placeholder-white placeholder-opacity-70"
            autoFocus
          />
        );
      }
    }

    return (
      <span className="bg-white bg-opacity-30 border border-white border-opacity-50 rounded px-2 py-1 min-w-8 inline-block text-center font-medium">
        {value}
      </span>
    );
  };

  const renderText = () => {
    const parts = definition.text.split(/\{(\w+)\}/);
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return (
          <span key={index} className="font-medium">
            {part}
          </span>
        );
      } else {
        const inputDef = definition.inputs[part];
        if (inputDef) {
          return (
            <span key={part} className="inline-block mx-1">
              {renderInput(part, inputDef)}
            </span>
          );
        }
        return part;
      }
    });
  };

  // Scratch-like block styling with notches and shadows
  const blockClasses = `
    ${definition.color} text-white px-4 py-3 cursor-pointer select-none
    ${isDragging ? "opacity-50 scale-105" : ""}
    ${isInPalette ? "hover:brightness-110 hover:scale-105" : "hover:brightness-90"}
    transition-all duration-200 ease-out
    ${definition.isContainer ? "min-h-20" : ""}
    relative shadow-lg
    font-medium text-sm
    border-2 border-black border-opacity-20
  `;

  // Scratch-style block shape with notches
  const blockStyle = {
    borderRadius: "8px",
    background: `linear-gradient(135deg, ${
      definition.color.includes("blue")
        ? "#4F46E5, #3B82F6"
        : definition.color.includes("purple")
        ? "#7C3AED, #8B5CF6"
        : definition.color.includes("orange")
        ? "#EA580C, #F97316"
        : "#4F46E5, #3B82F6"
    })`,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
  };

  return (
    <div
      className={blockClasses}
      style={blockStyle}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={handleDoubleClick}
    >
      {/* Top notch for Scratch-like connection */}
      {!isInPalette && (
        <div className="absolute -top-1 left-4 w-6 h-2 bg-current rounded-t-sm opacity-80"></div>
      )}

      <div className="flex items-center gap-2 relative z-10">
        {renderText()}
        {!isInPalette && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-2 text-white hover:text-red-200 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {definition.isContainer && block.children && (
        <div className="mt-3 ml-6 space-y-2 min-h-12 border-l-3 border-white border-opacity-40 pl-4 relative">
          {/* Container inner area styling */}
          <div className="absolute -left-1 top-0 bottom-0 w-1 bg-white bg-opacity-20 rounded-full"></div>

          {block.children.length === 0 && (
            <div className="text-white text-opacity-60 text-sm italic py-2 px-3 bg-black bg-opacity-10 rounded border-2 border-dashed border-white border-opacity-30">
              Drop blocks here
            </div>
          )}
          {block.children.map((childBlock, index) => (
            <Block
              key={childBlock.id}
              block={childBlock}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onInputChange={(inputKey, value) => {
                // Handle child block input changes
                if (onInputChange) {
                  onInputChange(`children.${index}.${inputKey}`, value);
                }
              }}
              onRemove={() => {
                // Handle child block removal
                if (onRemove) {
                  onRemove(`children.${index}`);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom notch for Scratch-like connection */}
      {!isInPalette && (
        <div className="absolute -bottom-1 left-4 w-6 h-2 bg-current rounded-b-sm opacity-80"></div>
      )}
    </div>
  );
}
