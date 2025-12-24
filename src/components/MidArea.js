import React, { useState } from "react";
import Block from "./Block";
import { useScratch } from "../context/ScratchContext";

export default function MidArea() {
  const { state, actions } = useScratch();
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const activeSprite = state.sprites.find((s) => s.id === state.activeSprite);
  const blocks = activeSprite?.blocks || [];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the entire drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (state.draggedBlock) {
      // Create a copy of the dragged block
      const newBlock = { ...state.draggedBlock };

      // Insert at the specified index
      const newBlocks = [...blocks];
      newBlocks.splice(dropIndex, 0, newBlock);

      actions.reorderBlocks(newBlocks);
      actions.setDraggedBlock(null);
    }
  };

  const handleBlockInputChange = (blockIndex, inputKey, value) => {
    const updates = {};

    if (inputKey.includes("children.")) {
      // Handle nested child block updates
      const [, childIndex, childInputKey] = inputKey.split(".");
      const block = blocks[blockIndex];
      const updatedChildren = [...(block.children || [])];
      updatedChildren[parseInt(childIndex)] = {
        ...updatedChildren[parseInt(childIndex)],
        inputs: {
          ...updatedChildren[parseInt(childIndex)].inputs,
          [childInputKey]: {
            ...updatedChildren[parseInt(childIndex)].inputs[childInputKey],
            default: value,
          },
        },
      };
      updates.children = updatedChildren;
    } else {
      // Handle direct block input updates
      updates.inputs = {
        ...blocks[blockIndex].inputs,
        [inputKey]: { ...blocks[blockIndex].inputs[inputKey], default: value },
      };
    }

    actions.updateBlock(blockIndex, updates);
  };

  const handleBlockRemove = (blockIndex, childPath) => {
    if (childPath && childPath.startsWith("children.")) {
      // Remove child block
      const childIndex = parseInt(childPath.split(".")[1]);
      const block = blocks[blockIndex];
      const updatedChildren = [...(block.children || [])];
      updatedChildren.splice(childIndex, 1);
      actions.updateBlock(blockIndex, { children: updatedChildren });
    } else {
      // Remove main block
      actions.removeBlock(blockIndex);
    }
  };

  const handleContainerDrop = (e, blockIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (state.draggedBlock) {
      const block = blocks[blockIndex];
      if (block.children !== undefined) {
        const updatedChildren = [...(block.children || []), { ...state.draggedBlock }];
        actions.updateBlock(blockIndex, { children: updatedChildren });
        actions.setDraggedBlock(null);
      }
    }
  };

  return (
    <div className="flex-1 h-full overflow-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Scripts for {activeSprite?.name || "Unknown Sprite"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {blocks.length} block{blocks.length !== 1 ? "s" : ""} • Drag blocks from the left
              palette to build your animation
            </p>
          </div>
          {blocks.length > 0 && (
            <button
              onClick={() => actions.reorderBlocks([])}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Scripts Area */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Drop zone at the beginning */}
          <div
            className={`h-3 rounded-lg transition-all duration-200 ${
              dragOverIndex === 0
                ? "bg-blue-200 border-2 border-dashed border-blue-400 scale-105"
                : "bg-transparent hover:bg-gray-100"
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, 0)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 0)}
          />

          {blocks.map((block, index) => (
            <div key={block.id} className="relative">
              <div
                onDragOver={block.children !== undefined ? handleDragOver : undefined}
                onDrop={
                  block.children !== undefined ? (e) => handleContainerDrop(e, index) : undefined
                }
                className="relative"
              >
                <Block
                  block={block}
                  onInputChange={(inputKey, value) =>
                    handleBlockInputChange(index, inputKey, value)
                  }
                  onRemove={(childPath) => handleBlockRemove(index, childPath)}
                />
              </div>

              {/* Drop zone after each block */}
              <div
                className={`h-3 rounded-lg transition-all duration-200 mt-2 ${
                  dragOverIndex === index + 1
                    ? "bg-blue-200 border-2 border-dashed border-blue-400 scale-105"
                    : "bg-transparent hover:bg-gray-100"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index + 1)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index + 1)}
              />
            </div>
          ))}

          {blocks.length === 0 && (
            <div
              className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragOverIndex === 0
                  ? "border-blue-400 bg-blue-50 scale-105"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, 0)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 0)}
            >
              <div className="text-gray-500 space-y-3">
                <div className="text-6xl">🎯</div>
                <h3 className="text-lg font-semibold">Start Building!</h3>
                <p className="text-sm max-w-md mx-auto">
                  Drag blocks from the left palette here to create animations for your sprite. Try
                  combining motion and looks blocks!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
