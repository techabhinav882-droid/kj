# Scratch-like Visual Programming Environment

A React-based visual programming environment inspired by Scratch, built from the original starter files with enhanced features and Scratch-like UI/UX.

## 🚀 Quick Start

```bash
npm install
npm start
```

Open http://localhost:3001 to view the application.

## ✨ Features Implemented

### 1. Motion Blocks (Blue)

- **Move [steps] steps** - Moves sprite forward based on current rotation
- **Turn [degrees] degrees** - Rotates sprite clockwise/counterclockwise
- **Go to x:[x] y:[y]** - Moves sprite to absolute coordinates
- **Repeat [times]** - Container block that repeats child blocks

### 2. Looks Blocks (Purple)

- **Say [text] for [seconds] seconds** - Shows speech bubble above sprite
- **Think [text] for [seconds] seconds** - Shows thought bubble above sprite

### 3. Multiple Sprites Support

- **Add sprites** with the "+ Sprite" button
- **Independent state** for each sprite (position, rotation, blocks, speech/thought)
- **Sprite selection** - Click sprites to switch block editor context
- **Concurrent execution** - Global Play button runs all sprites simultaneously

### 4. 🎯 Hero Feature: Collision-Based Animation Swap

- **Real-time collision detection** using bounding-box collision
- **Automatic block swapping** - When sprites collide, their entire instruction sets swap
- **Collision locking** - Prevents infinite swapping with 1-second cooldown
- **Visual feedback** - Console logging and visual indicators

## 🎮 How to Use

1. **Build Animations**: Drag blocks from the left palette to the center editor
2. **Edit Values**: Double-click on block inputs to modify numbers/text
3. **Add Sprites**: Click "+ Sprite" to create additional sprites
4. **Test Collision**: Create two sprites with opposing movement blocks
5. **Run**: Click "Play" to execute all sprite animations concurrently
6. **Watch Magic**: Observe collision-based animation swapping in action!

## 🎯 Collision Demo

To see the hero feature:

1. Create 2 sprites (use "+ Sprite")
2. Select first sprite, add: "move 50 steps"
3. Select second sprite, add: "move -50 steps"
4. Click "Play" and watch them collide
5. After collision, their movements will be swapped!

## 🏗️ Technical Architecture

- **React** with functional components and hooks
- **Context + useReducer** for immutable state management
- **TailwindCSS** for Scratch-inspired styling
- **Animation Engine** with smooth interpolation and collision detection
- **Modular Block System** with extensible type definitions

## 🎨 UI/UX Features

- **Scratch-inspired layout** (Palette | Editor | Stage)
- **Enhanced block styling** with gradients, shadows, and notches
- **Smooth drag & drop** with visual feedback
- **Speech/thought bubbles** with proper styling
- **Running indicators** and selection feedback
- **Grid background** and coordinate display
- **Responsive design** with hover effects and animations

Built from the original ReScript starter files and enhanced to provide a polished Scratch-like experience while maintaining simplicity and focusing on the core required features.
