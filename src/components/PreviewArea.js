import React, { useEffect, useRef } from "react";
import Sprite from "./Sprite";
import { useScratch } from "../context/ScratchContext";
import AnimationEngine from "../utils/animationEngine";

export default function PreviewArea() {
  const { state, actions } = useScratch();
  const animationEngineRef = useRef(null);

  // Initialize animation engine
  useEffect(() => {
    if (!animationEngineRef.current) {
      animationEngineRef.current = new AnimationEngine(actions);
      // Inject sprite getter
      animationEngineRef.current.getSpriteById = (id) =>
        state.sprites.find((sprite) => sprite.id === id);
    }

    // Update collision detector with current state
    if (animationEngineRef.current?.collisionDetector) {
      animationEngineRef.current.collisionDetector.actions.state = state;
    }
  }, [actions, state]);

  // Handle play button
  const handlePlay = async () => {
    if (state.isPlaying) {
      actions.setPlaying(false);
      animationEngineRef.current?.stopCollisionDetection();
      return;
    }

    actions.setPlaying(true);

    // Start collision detection
    animationEngineRef.current?.startCollisionDetection(state.sprites);

    // Execute animations for all sprites concurrently
    const animationPromises = state.sprites.map((sprite) =>
      animationEngineRef.current?.executeBlocks(sprite)
    );

    try {
      await Promise.all(animationPromises);
    } catch (error) {
      console.error("Animation execution error:", error);
    } finally {
      actions.setPlaying(false);
      animationEngineRef.current?.stopCollisionDetection();
    }
  };

  const handleAddSprite = () => {
    const newSprite = {
      id: `sprite${state.sprites.length + 1}`,
      name: `Sprite ${state.sprites.length + 1}`,
      x: Math.random() * 200 - 100, // Random position
      y: Math.random() * 200 - 100,
      rotation: 0,
      blocks: [],
      sayText: "",
      sayDuration: 0,
      thinkText: "",
      thinkDuration: 0,
      isRunning: false,
    };
    actions.addSprite(newSprite);
  };

  const handleSpriteClick = (spriteId) => {
    actions.selectSprite(spriteId);
  };

  return (
    <div className="flex-none h-full overflow-hidden flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Stage</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                state.isPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {state.isPlaying ? "⏹ Stop" : "▶ Play"}
            </button>
            <button
              onClick={handleAddSprite}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              + Sprite
            </button>
          </div>
        </div>

        {/* Collision Feature Info */}
        <div className="text-sm bg-white bg-opacity-20 rounded-lg p-2">
          <div className="font-semibold">🎯 Hero Feature: Collision Swap</div>
          <div className="text-xs opacity-90">
            When sprites collide, their animation blocks swap automatically!
          </div>
        </div>
      </div>

      {/* Sprite Management */}
      <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">Sprites ({state.sprites.length})</h3>
          <div className="text-xs text-gray-600">
            Click sprites to select • Selected sprite shows in editor
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
          {state.sprites.map((sprite) => (
            <div
              key={sprite.id}
              onClick={() => handleSpriteClick(sprite.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                sprite.id === state.activeSprite
                  ? "bg-blue-100 border-2 border-blue-400 shadow-md"
                  : "bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      sprite.id === state.activeSprite ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="font-medium text-sm">{sprite.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {sprite.isRunning && (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Running</span>
                    </div>
                  )}
                  <span className="text-gray-500">
                    {sprite.blocks.length} block{sprite.blocks.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6B7280" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-6 h-0.5 bg-gray-500 rounded-full"></div>
          <div className="w-0.5 h-6 bg-gray-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3"></div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
            (0, 0)
          </div>
        </div>

        {/* Stage boundaries indicator */}
        <div className="absolute inset-4 border-2 border-dashed border-gray-400 rounded-lg opacity-30"></div>

        {/* Sprites */}
        {state.sprites.map((sprite) => (
          <Sprite
            key={sprite.id}
            sprite={sprite}
            isSelected={sprite.id === state.activeSprite}
            onClick={handleSpriteClick}
          />
        ))}

        {/* Coordinates and status display */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <div className="text-xs space-y-1">
            <div className="font-semibold text-gray-800">
              Active: {state.sprites.find((s) => s.id === state.activeSprite)?.name || "None"}
            </div>
            <div className="text-gray-600">
              Position: (
              {Math.round(state.sprites.find((s) => s.id === state.activeSprite)?.x || 0)},{" "}
              {Math.round(state.sprites.find((s) => s.id === state.activeSprite)?.y || 0)})
            </div>
            <div className="text-gray-600">
              Rotation:{" "}
              {Math.round(state.sprites.find((s) => s.id === state.activeSprite)?.rotation || 0)}°
            </div>
            {state.isPlaying && (
              <div className="text-green-600 font-semibold animate-pulse">▶ Animations Running</div>
            )}
          </div>
        </div>

        {/* Instructions overlay when no sprites have blocks */}
        {state.sprites.every((sprite) => sprite.blocks.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white bg-opacity-95 rounded-xl p-6 shadow-xl border-2 border-gray-200 max-w-sm text-center">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-bold text-gray-800 mb-2">Ready to Animate!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Add blocks to your sprites from the left palette, then click Play to see them move!
              </p>
              <div className="text-xs text-gray-500">
                💡 Try creating 2 sprites with opposite movements to see collision swapping
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
