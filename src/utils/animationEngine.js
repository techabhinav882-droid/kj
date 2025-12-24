import { BLOCK_TYPES } from "./blockTypes";

// Animation execution engine
export class AnimationEngine {
  constructor(actions) {
    this.actions = actions;
    this.runningAnimations = new Map();
    this.collisionDetector = new CollisionDetector(actions);
    this.getSpriteById = null; // Will be injected
  }

  // Execute blocks for a sprite
  async executeBlocks(sprite) {
    if (sprite.isRunning || !sprite.blocks.length) return;

    this.actions.setSpriteRunning(sprite.id, true);

    try {
      await this.executeBlockList(sprite.blocks, sprite.id);
    } catch (error) {
      console.error(`Animation error for sprite ${sprite.id}:`, error);
    } finally {
      this.actions.setSpriteRunning(sprite.id, false);
    }
  }

  // Execute a list of blocks
  async executeBlockList(blocks, spriteId) {
    for (const block of blocks) {
      await this.executeBlock(block, spriteId);
      // Small delay between blocks for smoother animation
      await this.delay(50);
    }
  }

  // Execute a single block
  async executeBlock(block, spriteId) {
    const { type, inputs, children } = block;

    switch (type) {
      case BLOCK_TYPES.MOTION.MOVE_STEPS:
        await this.moveSteps(spriteId, inputs.steps.default);
        break;

      case BLOCK_TYPES.MOTION.TURN_DEGREES:
        await this.turnDegrees(spriteId, inputs.degrees.default);
        break;

      case BLOCK_TYPES.MOTION.GO_TO_XY:
        await this.goToXY(spriteId, inputs.x.default, inputs.y.default);
        break;

      case BLOCK_TYPES.MOTION.REPEAT:
        await this.repeat(spriteId, inputs.times.default, children);
        break;

      case BLOCK_TYPES.LOOKS.SAY:
        await this.say(spriteId, inputs.text.default, inputs.seconds.default);
        break;

      case BLOCK_TYPES.LOOKS.THINK:
        await this.think(spriteId, inputs.text.default, inputs.seconds.default);
        break;

      default:
        console.warn(`Unknown block type: ${type}`);
    }
  }

  // Motion block implementations
  async moveSteps(spriteId, steps) {
    return new Promise((resolve) => {
      const sprite = this.getSpriteById ? this.getSpriteById(spriteId) : null;
      if (!sprite) return resolve();

      const radians = (sprite.rotation * Math.PI) / 180;
      const deltaX = Math.cos(radians) * steps;
      const deltaY = Math.sin(radians) * steps;

      const newX = sprite.x + deltaX;
      const newY = sprite.y + deltaY;

      // Animate movement smoothly
      this.animatePosition(spriteId, sprite.x, sprite.y, newX, newY, 500, resolve);
    });
  }

  async turnDegrees(spriteId, degrees) {
    return new Promise((resolve) => {
      const sprite = this.getSpriteById ? this.getSpriteById(spriteId) : null;
      if (!sprite) return resolve();

      const newRotation = sprite.rotation + degrees;
      this.animateRotation(spriteId, sprite.rotation, newRotation, 300, resolve);
    });
  }

  async goToXY(spriteId, x, y) {
    return new Promise((resolve) => {
      const sprite = this.getSpriteById ? this.getSpriteById(spriteId) : null;
      if (!sprite) return resolve();

      this.animatePosition(spriteId, sprite.x, sprite.y, x, y, 500, resolve);
    });
  }

  async repeat(spriteId, times, children) {
    for (let i = 0; i < times; i++) {
      await this.executeBlockList(children || [], spriteId);
    }
  }

  // Looks block implementations
  async say(spriteId, text, seconds) {
    this.actions.setSayText(spriteId, text, seconds * 1000);
    await this.delay(seconds * 1000);
    this.actions.clearSayText(spriteId);
  }

  async think(spriteId, text, seconds) {
    this.actions.setThinkText(spriteId, text, seconds * 1000);
    await this.delay(seconds * 1000);
    this.actions.clearThinkText(spriteId);
  }

  // Animation helpers
  animatePosition(spriteId, fromX, fromY, toX, toY, duration, callback) {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentX = fromX + (toX - fromX) * eased;
      const currentY = fromY + (toY - fromY) * eased;

      this.actions.updateSpritePosition(spriteId, currentX, currentY);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    requestAnimationFrame(animate);
  }

  animateRotation(spriteId, fromRotation, toRotation, duration, callback) {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentRotation = fromRotation + (toRotation - fromRotation) * eased;

      this.actions.updateSpriteRotation(spriteId, currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    requestAnimationFrame(animate);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Start collision detection
  startCollisionDetection(sprites) {
    this.collisionDetector.start(sprites);
  }

  // Stop collision detection
  stopCollisionDetection() {
    this.collisionDetector.stop();
  }
}

// Collision detection system
class CollisionDetector {
  constructor(actions) {
    this.actions = actions;
    this.isRunning = false;
    this.intervalId = null;
    this.sprites = [];
  }

  start(sprites) {
    this.sprites = sprites;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.checkCollisions();
    }, 100); // Check every 100ms
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  checkCollisions() {
    if (!this.isRunning || this.sprites.length < 2) return;

    for (let i = 0; i < this.sprites.length; i++) {
      for (let j = i + 1; j < this.sprites.length; j++) {
        const sprite1 = this.sprites[i];
        const sprite2 = this.sprites[j];

        if (this.areColliding(sprite1, sprite2)) {
          this.handleCollision(sprite1, sprite2);
        }
      }
    }
  }

  areColliding(sprite1, sprite2) {
    // Simple bounding box collision detection
    const size = 50; // Approximate sprite size
    const distance = Math.sqrt(
      Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)
    );
    return distance < size;
  }

  handleCollision(sprite1, sprite2) {
    const lockKey = `${sprite1.id}-${sprite2.id}`;
    const reverseLockKey = `${sprite2.id}-${sprite1.id}`;

    // Get current state to check collision locks
    const currentState = this.actions.state || { collisionLocks: new Set() };

    // Check if collision is already locked
    if (
      currentState.collisionLocks?.has(lockKey) ||
      currentState.collisionLocks?.has(reverseLockKey)
    ) {
      return;
    }

    // Lock collision to prevent multiple swaps
    this.actions.addCollisionLock(lockKey);

    // Swap animation blocks
    this.actions.swapSpriteBlocks(sprite1.id, sprite2.id);

    console.log(`🎯 COLLISION DETECTED! Swapped blocks between ${sprite1.id} and ${sprite2.id}`);

    // Remove lock after a delay
    setTimeout(() => {
      this.actions.removeCollisionLock(lockKey);
    }, 1000);
  }
}

export default AnimationEngine;
