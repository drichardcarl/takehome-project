# Timeline Editor - Take Home Project

## Overview
You will be building a timeline-based scene editor that renders visual content to a canvas using WebAssembly. The boilerplate provides a basic React/TypeScript application with a timeline interface, and your task is to add interactivity and rendering functionality.

## Project Structure
- **Framework**: Vite + React + TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Canvas Rendering**: WebAssembly (WASM)

## Current Implementation
The boilerplate includes:
- ✅ Basic layout with 1280x720 canvas
- ✅ Timeline with 3 predefined scenes
- ✅ Playback controls (non-functional)
- ✅ Undo/redo buttons (non-functional)
- ✅ Zustand store with scene data

## Tasks to Complete

### 1. WASM Integration (Required)
Load and integrate the provided `renderer.wasm` and `renderer.js` files for canvas rendering.

**WASM Module Specification:**
- **Module Location**: `renderer.js` and `renderer.wasm` are provided in the `public/` folder
- **Module Export**: `renderer.js` exports a `RendererModule()` function that returns a Promise
- **Canvas Binding**: The module automatically binds to canvas element with ID `canvas`

**Available Functions:**
The WASM module provides functions that are directly callable (no cwrap needed):

```typescript
interface RendererAPI {
  initCanvas: (canvasSelector: string) => void;
  renderScene: (scene_name: string, scene_color: string, local_frame: number) => void;
  clearCanvas: () => void;
}
```

**Implementation Requirements:**
- Load the renderer.js script dynamically or include it in your build
- Instantiate the module using `await RendererModule()`
- Functions are pre-wrapped and ready to use directly - no cwrap needed
- Handle module loading errors gracefully with proper error states

**Function Specifications:**
- `initCanvas(canvasSelector)`: Initialize the canvas for rendering
  - `canvasSelector`: CSS selector for the canvas element (e.g., "#canvas")
- `renderScene(scene_name, scene_color, local_frame)`: 
  - `scene_name`: Scene identifier string
  - `scene_color`: Hex color (e.g., "#FF5733")  
  - `local_frame`: Frame number within scene (0-based)
- `clearCanvas()`: Clears canvas to black


### 2. Playback System (Required)
Implement a 30fps playback system:

**Timeline Logic:**
- Scenes are arranged sequentially in a single continuous timeline
- Total timeline duration = sum of all scene lengths (in frames)
- Each scene length represents frames (e.g., 30 = 1 second at 30fps)
- Track current global frame position across entire timeline
- Scene positions are calculated cumulatively (Scene 1: 0-29, Scene 2: 30-59, etc.)

**Playback Controls:**
- Play/pause functionality
- Real-time scrubber updates during playback
- Click-to-seek on timeline scrubber
- Current time / total time display

### 3. Canvas Rendering (Required)
Implement frame-by-frame rendering:

**Rendering Logic:**
- Determine which scene is active at current global frame position
- Calculate local frame within that scene (0 to scene_length-1)
- Scene boundaries are determined by cumulative frame positions
- Call `renderScene()` with scene name, color, and local frame
- Update rendering every frame during playback
- Render single frame when scrubbing/seeking

### 4. Timeline Interactivity (Required)

**Add Scene Functionality:**
- Make "Add Scene" button functional
- Generate new scenes with incremented names ("Scene 4", "Scene 5", etc.)
- Assign random colors to new scenes
- Default new scene length: 30 frames
- Add new scenes to end of timeline (scenes are always contiguous)

**Drag & Drop Reordering:**
- Implement drag & drop to reorder scenes
- You may use default HTML5 drag functionality, or a custom package of your choice. We recommend DnD Kit.
- Scenes automatically rearrange to maintain sequential order (no gaps between scenes)
- Update scene indices when reordered
- Recalculate timeline positions after reordering

**Scene Duration Editing:**
- Allow resizing scenes by dragging right edge
- Minimum scene length: 10 frames
- When a scene is resized, subsequent scenes automatically shift position to maintain continuity
- Update total timeline duration when scenes are resized

### 5. Command Pattern & Undo/Redo (Required)
Implement command-based state management:

**Command Interface:**
```typescript
interface Command {
  execute(): void;
  undo(): void;
  description: string;
}
```

**Required Commands:**
- `AddSceneCommand` - Add new scene
- `ReorderScenesCommand` - Reorder timeline
- `ResizeSceneCommand` - Change scene duration

**Undo/Redo System:**
- Maintain command history stack
- Enable/disable undo/redo buttons based on stack state

### 6. Scene Management (Required)
Ensure proper scene data management:
- Scenes must always be positioned sequentially without gaps
- Update `scene_index` values when reordering
- Recalculate scene start positions when adding/resizing/reordering scenes
- Recalculate total timeline frames when adding/resizing scenes
- Validate timeline state consistency and sequential positioning

## Nice-to-Have Features (Optional)

### 1. Smooth Animations
- You're welcome to use any library you'd like for this, including Motion (Framer Motion)
- Animate scene position changes during drag & drop
- Smooth transitions for timeline updates
- Easing for UI state changes

### 2. Drag Preview
- Show visual preview of drop position during drag - animating other scenes out of the way to preview the drop position
- Highlight drop zones

## Technical Requirements

### WASM Loading Pattern
```typescript
// Example WASM integration approach (based on HTML example)
const initializeRenderer = async () => {
  // Load renderer.js script
  const script = document.createElement('script');
  script.src = '/renderer.js';
  document.head.appendChild(script);
  
  // Wait for script to load, then instantiate module
  const Module = await window.RendererModule();
  
  // Initialize the canvas
  Module.initCanvas('#canvas');
  
  // Functions are ready to use directly - no cwrap needed!
  return {
    initCanvas: Module.initCanvas,
    renderScene: Module.renderScene,
    clearCanvas: Module.clearCanvas
  };
};

// Usage example
const testRender = async () => {
  const Module = await RendererModule();
  Module.initCanvas('#canvas');
  Module.renderScene('Test Scene', '#FF5733', 0);
};

const testClear = async () => {
  const Module = await RendererModule();
  Module.clearCanvas();
};
```

### Store Extensions
You may need to extend the Zustand store with:
- Command history management
- Playback state
- WASM instance reference

### Performance Considerations
- Throttle rendering during rapid scrubbing
- Debounce resize operations
- Optimize command stack size

## Evaluation Criteria

### Core Functionality (70%)
- ✅ WASM integration and canvas rendering
- ✅ Functional playback system with proper timing
- ✅ Timeline interactivity (add, reorder, resize)
- ✅ Command pattern with working undo/redo

### Code Quality (20%)
- Clean, readable TypeScript code
- Proper error handling
- Good separation of concerns
- Consistent naming conventions

### User Experience (10%)
- Responsive and intuitive interface
- Smooth interactions
- Proper feedback for user actions

## Getting Started

1. The `renderer.wasm` and `renderer.js` files are already provided in the `public/` folder
2. Run `npm install` and `npm run dev`
3. Start with WASM integration following the specification above
4. Implement playback system
5. Add timeline interactivity
6. Implement command pattern

## Submission
- Provide working application with all required features
- Include brief documentation of your implementation approach
- Note any assumptions or trade-offs made
- Ensure code is well-commented and production-ready

Good luck!
