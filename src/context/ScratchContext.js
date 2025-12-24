import React, { createContext, useContext, useReducer, useCallback } from "react";

// Initial state
const initialState = {
  sprites: [
    {
      id: "sprite1",
      name: "Cat",
      x: 0,
      y: 0,
      rotation: 0,
      blocks: [],
      sayText: "",
      sayDuration: 0,
      thinkText: "",
      thinkDuration: 0,
      isRunning: false,
    },
  ],
  activeSprite: "sprite1",
  isPlaying: false,
  draggedBlock: null,
  collisionLocks: new Set(),
};

// Action types
const ACTIONS = {
  ADD_SPRITE: "ADD_SPRITE",
  SELECT_SPRITE: "SELECT_SPRITE",
  UPDATE_SPRITE_POSITION: "UPDATE_SPRITE_POSITION",
  UPDATE_SPRITE_ROTATION: "UPDATE_SPRITE_ROTATION",
  ADD_BLOCK: "ADD_BLOCK",
  REMOVE_BLOCK: "REMOVE_BLOCK",
  REORDER_BLOCKS: "REORDER_BLOCKS",
  UPDATE_BLOCK: "UPDATE_BLOCK",
  SET_SAY_TEXT: "SET_SAY_TEXT",
  SET_THINK_TEXT: "SET_THINK_TEXT",
  CLEAR_SAY_TEXT: "CLEAR_SAY_TEXT",
  CLEAR_THINK_TEXT: "CLEAR_THINK_TEXT",
  SET_PLAYING: "SET_PLAYING",
  SET_SPRITE_RUNNING: "SET_SPRITE_RUNNING",
  SET_DRAGGED_BLOCK: "SET_DRAGGED_BLOCK",
  SWAP_SPRITE_BLOCKS: "SWAP_SPRITE_BLOCKS",
  ADD_COLLISION_LOCK: "ADD_COLLISION_LOCK",
  REMOVE_COLLISION_LOCK: "REMOVE_COLLISION_LOCK",
};

// Reducer
function scratchReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_SPRITE:
      return {
        ...state,
        sprites: [...state.sprites, action.payload],
      };

    case ACTIONS.SELECT_SPRITE:
      return {
        ...state,
        activeSprite: action.payload,
      };

    case ACTIONS.UPDATE_SPRITE_POSITION:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload.id
            ? { ...sprite, x: action.payload.x, y: action.payload.y }
            : sprite
        ),
      };

    case ACTIONS.UPDATE_SPRITE_ROTATION:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload.id
            ? { ...sprite, rotation: action.payload.rotation }
            : sprite
        ),
      };

    case ACTIONS.ADD_BLOCK:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === state.activeSprite
            ? { ...sprite, blocks: [...sprite.blocks, action.payload] }
            : sprite
        ),
      };

    case ACTIONS.REMOVE_BLOCK:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === state.activeSprite
            ? { ...sprite, blocks: sprite.blocks.filter((_, index) => index !== action.payload) }
            : sprite
        ),
      };

    case ACTIONS.REORDER_BLOCKS:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === state.activeSprite ? { ...sprite, blocks: action.payload } : sprite
        ),
      };

    case ACTIONS.UPDATE_BLOCK:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === state.activeSprite
            ? {
                ...sprite,
                blocks: sprite.blocks.map((block, index) =>
                  index === action.payload.index ? { ...block, ...action.payload.updates } : block
                ),
              }
            : sprite
        ),
      };

    case ACTIONS.SET_SAY_TEXT:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload.id
            ? { ...sprite, sayText: action.payload.text, sayDuration: action.payload.duration }
            : sprite
        ),
      };

    case ACTIONS.SET_THINK_TEXT:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload.id
            ? { ...sprite, thinkText: action.payload.text, thinkDuration: action.payload.duration }
            : sprite
        ),
      };

    case ACTIONS.CLEAR_SAY_TEXT:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload ? { ...sprite, sayText: "", sayDuration: 0 } : sprite
        ),
      };

    case ACTIONS.CLEAR_THINK_TEXT:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload ? { ...sprite, thinkText: "", thinkDuration: 0 } : sprite
        ),
      };

    case ACTIONS.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
      };

    case ACTIONS.SET_SPRITE_RUNNING:
      return {
        ...state,
        sprites: state.sprites.map((sprite) =>
          sprite.id === action.payload.id
            ? { ...sprite, isRunning: action.payload.isRunning }
            : sprite
        ),
      };

    case ACTIONS.SET_DRAGGED_BLOCK:
      return {
        ...state,
        draggedBlock: action.payload,
      };

    case ACTIONS.SWAP_SPRITE_BLOCKS:
      const { sprite1Id, sprite2Id } = action.payload;
      const sprite1 = state.sprites.find((s) => s.id === sprite1Id);
      const sprite2 = state.sprites.find((s) => s.id === sprite2Id);

      return {
        ...state,
        sprites: state.sprites.map((sprite) => {
          if (sprite.id === sprite1Id) {
            return { ...sprite, blocks: sprite2.blocks };
          }
          if (sprite.id === sprite2Id) {
            return { ...sprite, blocks: sprite1.blocks };
          }
          return sprite;
        }),
      };

    case ACTIONS.ADD_COLLISION_LOCK:
      return {
        ...state,
        collisionLocks: new Set([...state.collisionLocks, action.payload]),
      };

    case ACTIONS.REMOVE_COLLISION_LOCK:
      const newLocks = new Set(state.collisionLocks);
      newLocks.delete(action.payload);
      return {
        ...state,
        collisionLocks: newLocks,
      };

    default:
      return state;
  }
}

// Context
const ScratchContext = createContext();

// Provider component
export function ScratchProvider({ children }) {
  const [state, dispatch] = useReducer(scratchReducer, initialState);

  // Action creators
  const actions = {
    addSprite: useCallback((sprite) => {
      dispatch({ type: ACTIONS.ADD_SPRITE, payload: sprite });
    }, []),

    selectSprite: useCallback((spriteId) => {
      dispatch({ type: ACTIONS.SELECT_SPRITE, payload: spriteId });
    }, []),

    updateSpritePosition: useCallback((id, x, y) => {
      dispatch({ type: ACTIONS.UPDATE_SPRITE_POSITION, payload: { id, x, y } });
    }, []),

    updateSpriteRotation: useCallback((id, rotation) => {
      dispatch({ type: ACTIONS.UPDATE_SPRITE_ROTATION, payload: { id, rotation } });
    }, []),

    addBlock: useCallback((block) => {
      dispatch({ type: ACTIONS.ADD_BLOCK, payload: block });
    }, []),

    removeBlock: useCallback((index) => {
      dispatch({ type: ACTIONS.REMOVE_BLOCK, payload: index });
    }, []),

    reorderBlocks: useCallback((blocks) => {
      dispatch({ type: ACTIONS.REORDER_BLOCKS, payload: blocks });
    }, []),

    updateBlock: useCallback((index, updates) => {
      dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { index, updates } });
    }, []),

    setSayText: useCallback((id, text, duration) => {
      dispatch({ type: ACTIONS.SET_SAY_TEXT, payload: { id, text, duration } });
    }, []),

    setThinkText: useCallback((id, text, duration) => {
      dispatch({ type: ACTIONS.SET_THINK_TEXT, payload: { id, text, duration } });
    }, []),

    clearSayText: useCallback((id) => {
      dispatch({ type: ACTIONS.CLEAR_SAY_TEXT, payload: id });
    }, []),

    clearThinkText: useCallback((id) => {
      dispatch({ type: ACTIONS.CLEAR_THINK_TEXT, payload: id });
    }, []),

    setPlaying: useCallback((isPlaying) => {
      dispatch({ type: ACTIONS.SET_PLAYING, payload: isPlaying });
    }, []),

    setSpriteRunning: useCallback((id, isRunning) => {
      dispatch({ type: ACTIONS.SET_SPRITE_RUNNING, payload: { id, isRunning } });
    }, []),

    setDraggedBlock: useCallback((block) => {
      dispatch({ type: ACTIONS.SET_DRAGGED_BLOCK, payload: block });
    }, []),

    swapSpriteBlocks: useCallback((sprite1Id, sprite2Id) => {
      dispatch({ type: ACTIONS.SWAP_SPRITE_BLOCKS, payload: { sprite1Id, sprite2Id } });
    }, []),

    addCollisionLock: useCallback((lockKey) => {
      dispatch({ type: ACTIONS.ADD_COLLISION_LOCK, payload: lockKey });
    }, []),

    removeCollisionLock: useCallback((lockKey) => {
      dispatch({ type: ACTIONS.REMOVE_COLLISION_LOCK, payload: lockKey });
    }, []),
  };

  return <ScratchContext.Provider value={{ state, actions }}>{children}</ScratchContext.Provider>;
}

// Hook to use context
export function useScratch() {
  const context = useContext(ScratchContext);
  if (!context) {
    throw new Error("useScratch must be used within a ScratchProvider");
  }
  return context;
}
