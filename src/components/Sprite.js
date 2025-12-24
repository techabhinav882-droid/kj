import React from "react";
import CatSprite from "./CatSprite";

export default function Sprite({ sprite, isSelected = false, onClick, style = {} }) {
  const handleClick = () => {
    if (onClick) {
      onClick(sprite.id);
    }
  };

  const spriteStyle = {
    position: "absolute",
    left: `${sprite.x + 200}px`, // Offset to center in stage
    top: `${-sprite.y + 200}px`, // Invert Y and offset to center
    transform: `rotate(${sprite.rotation}deg)`,
    transformOrigin: "center",
    cursor: "pointer",
    transition: "all 0.1s ease-out",
    zIndex: isSelected ? 10 : 1,
    ...style,
  };

  return (
    <div style={spriteStyle} onClick={handleClick}>
      {/* Speech bubble */}
      {sprite.sayText && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white border-3 border-gray-400 rounded-xl px-4 py-3 shadow-lg max-w-40 relative">
            <div className="text-sm text-gray-800 font-medium text-center break-words">
              {sprite.sayText}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-white"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-gray-400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Thought bubble */}
      {sprite.thinkText && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gray-100 border-3 border-gray-400 rounded-full px-4 py-3 shadow-lg max-w-40 relative">
            <div className="text-sm text-gray-800 font-medium text-center break-words">
              {sprite.thinkText}
            </div>
          </div>
          {/* Thought bubble circles */}
          <div className="absolute top-full left-1/4 mt-1">
            <div className="w-3 h-3 bg-gray-100 border-2 border-gray-400 rounded-full"></div>
          </div>
          <div className="absolute top-full left-1/3 mt-3">
            <div className="w-2 h-2 bg-gray-100 border-2 border-gray-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-3 border-blue-500 rounded-xl pointer-events-none transform -translate-x-2 -translate-y-2 w-24 h-24 animate-pulse">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )}

      {/* Running indicator */}
      {sprite.isRunning && (
        <div className="absolute -top-3 -right-3 z-30">
          <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Sprite visual with hover effect */}
      <div
        className={`w-20 h-20 flex items-center justify-center transition-transform duration-200 ${
          isSelected ? "scale-110" : "hover:scale-105"
        }`}
      >
        <CatSprite />
      </div>

      {/* Sprite name label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full font-medium">
          {sprite.name}
        </div>
      </div>
    </div>
  );
}
