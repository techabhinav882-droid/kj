// Block type definitions
export const BLOCK_TYPES = {
  MOTION: {
    MOVE_STEPS: "move_steps",
    TURN_DEGREES: "turn_degrees",
    GO_TO_XY: "go_to_xy",
    REPEAT: "repeat",
  },
  LOOKS: {
    SAY: "say",
    THINK: "think",
  },
};

// Block categories
export const BLOCK_CATEGORIES = {
  MOTION: "Motion",
  LOOKS: "Looks",
};

// Block definitions with default values
export const BLOCK_DEFINITIONS = {
  [BLOCK_TYPES.MOTION.MOVE_STEPS]: {
    type: BLOCK_TYPES.MOTION.MOVE_STEPS,
    category: BLOCK_CATEGORIES.MOTION,
    text: "move {steps} steps",
    color: "bg-blue-500",
    inputs: {
      steps: { type: "number", default: 10 },
    },
    isContainer: false,
  },

  [BLOCK_TYPES.MOTION.TURN_DEGREES]: {
    type: BLOCK_TYPES.MOTION.TURN_DEGREES,
    category: BLOCK_CATEGORIES.MOTION,
    text: "turn {degrees} degrees",
    color: "bg-blue-500",
    inputs: {
      degrees: { type: "number", default: 15 },
    },
    isContainer: false,
  },

  [BLOCK_TYPES.MOTION.GO_TO_XY]: {
    type: BLOCK_TYPES.MOTION.GO_TO_XY,
    category: BLOCK_CATEGORIES.MOTION,
    text: "go to x: {x} y: {y}",
    color: "bg-blue-500",
    inputs: {
      x: { type: "number", default: 0 },
      y: { type: "number", default: 0 },
    },
    isContainer: false,
  },

  [BLOCK_TYPES.MOTION.REPEAT]: {
    type: BLOCK_TYPES.MOTION.REPEAT,
    category: BLOCK_CATEGORIES.MOTION,
    text: "repeat {times}",
    color: "bg-orange-500",
    inputs: {
      times: { type: "number", default: 10 },
    },
    isContainer: true,
  },

  [BLOCK_TYPES.LOOKS.SAY]: {
    type: BLOCK_TYPES.LOOKS.SAY,
    category: BLOCK_CATEGORIES.LOOKS,
    text: "say {text} for {seconds} seconds",
    color: "bg-purple-500",
    inputs: {
      text: { type: "text", default: "Hello!" },
      seconds: { type: "number", default: 2 },
    },
    isContainer: false,
  },

  [BLOCK_TYPES.LOOKS.THINK]: {
    type: BLOCK_TYPES.LOOKS.THINK,
    category: BLOCK_CATEGORIES.LOOKS,
    text: "think {text} for {seconds} seconds",
    color: "bg-purple-500",
    inputs: {
      text: { type: "text", default: "Hmm..." },
      seconds: { type: "number", default: 2 },
    },
    isContainer: false,
  },
};

// Create a new block instance
export function createBlock(type, inputs = {}) {
  const definition = BLOCK_DEFINITIONS[type];
  if (!definition) {
    throw new Error(`Unknown block type: ${type}`);
  }

  const blockInputs = { ...definition.inputs };
  Object.keys(inputs).forEach((key) => {
    if (blockInputs[key]) {
      blockInputs[key] = { ...blockInputs[key], default: inputs[key] };
    }
  });

  return {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    inputs: blockInputs,
    children: definition.isContainer ? [] : undefined,
  };
}

// Get block definition
export function getBlockDefinition(type) {
  return BLOCK_DEFINITIONS[type];
}
