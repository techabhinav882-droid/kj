import React from "react";
import Block from "./Block";
import { BLOCK_TYPES, BLOCK_CATEGORIES, createBlock } from "../utils/blockTypes";
import { useScratch } from "../context/ScratchContext";

export default function Sidebar() {
  const { actions } = useScratch();

  const handleBlockDragStart = (e, blockType) => {
    const newBlock = createBlock(blockType);
    actions.setDraggedBlock(newBlock);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleBlockDragEnd = () => {
    actions.setDraggedBlock(null);
  };

  const motionBlocks = [
    BLOCK_TYPES.MOTION.MOVE_STEPS,
    BLOCK_TYPES.MOTION.TURN_DEGREES,
    BLOCK_TYPES.MOTION.GO_TO_XY,
    BLOCK_TYPES.MOTION.REPEAT,
  ];

  const looksBlocks = [BLOCK_TYPES.LOOKS.SAY, BLOCK_TYPES.LOOKS.THINK];

  return (
    <div className="w-64 flex-none h-full overflow-y-auto flex flex-col bg-gray-50 border-r-2 border-gray-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-lg font-bold">Block Palette</h2>
        <p className="text-sm opacity-90">Drag blocks to build animations</p>
      </div>

      {/* Motion Category */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <h3 className="font-bold text-gray-800 text-lg">{BLOCK_CATEGORIES.MOTION}</h3>
        </div>
        <div className="space-y-3">
          {motionBlocks.map((blockType) => {
            const block = createBlock(blockType);
            return (
              <div
                key={blockType}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <Block
                  block={block}
                  isInPalette={true}
                  onDragStart={(e) => handleBlockDragStart(e, blockType)}
                  onDragEnd={handleBlockDragEnd}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Looks Category */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <h3 className="font-bold text-gray-800 text-lg">{BLOCK_CATEGORIES.LOOKS}</h3>
        </div>
        <div className="space-y-3">
          {looksBlocks.map((blockType) => {
            const block = createBlock(blockType);
            return (
              <div
                key={blockType}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <Block
                  block={block}
                  isInPalette={true}
                  onDragStart={(e) => handleBlockDragStart(e, blockType)}
                  onDragEnd={handleBlockDragEnd}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-auto p-4 bg-gray-100 border-t border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <p>
            <strong>💡 Tips:</strong>
          </p>
          <p>• Drag blocks to the center area</p>
          <p>• Double-click to edit values</p>
          <p>• Drop blocks inside orange "repeat" blocks</p>
          <p>• Create multiple sprites to see collision swapping!</p>
        </div>
      </div>
    </div>
  );
}
