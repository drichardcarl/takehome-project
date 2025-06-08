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
Load and instantiate the provided `renderer.wasm` file and its associated renderer.js glue code. They are placed it in the `public/` folde. These export:

```typescript
// WASM Functions Available
init_canvas(selector: string): boolean  // Initialize canvas binding
render_scene(scene_name: string, scene_color: string, local_frame: number): void  // Render frame
clear_canvas(): void  // Clear canvas
```

**Implementation Requirements:**
- Load and instantiate the WASM module on app startup
- Bind the WASM renderer to the canvas element with ID `canvas`
- Handle WASM loading errors gracefully

### 2. Playback System (Required)
Implement a 30fps playback system:

**Timeline Logic:**
- Total timeline duration = sum of all scene lengths (in frames)
- Each scene length represents frames (e.g., 30 = 1 second at 30fps)
- Track current global frame position across entire timeline

**Playback Controls:**
- Play/pause functionality
- Real-time scrubber updates during playback
- Click-to-seek on timeline scrubber
- Current time / total time display

### 3. Canvas Rendering (Required)
Implement frame-by-frame rendering:

**Rendering Logic:**
- Determine which scene is active at current frame
- Calculate local frame within that scene (0 to scene_length-1)
- Call `render_scene()` with scene name, color, and local frame
- Update rendering every frame during playback
- Render single frame when scrubbing/seeking

### 4. Timeline Interactivity (Required)

**Add Scene Functionality:**
- Make "Add Scene" button functional
- Generate new scenes with incremented names ("Scene 4", "Scene 5", etc.)
- Assign random colors to new scenes
- Default new scene length: 30 frames
- Add new scenes to end of timeline

**Drag & Drop Reordering:**
- Implement drag & drop to reorder scenes
- Update scene indices when reordered
- Maintain timeline continuity during reordering

**Scene Duration Editing:**
- Allow resizing scenes by dragging right edge
- Minimum scene length: 10 frames
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
- Update `scene_index` values when reordering
- Recalculate total timeline frames when adding/resizing scenes
- Validate timeline state consistency

## Nice-to-Have Features (Optional)

### 1. Smooth Animations
- Animate scene position changes during drag & drop
- Smooth transitions for timeline updates
- Easing for UI state changes

### 2. Drag Preview
- Show visual preview of drop position during drag - animating other scenes out of the way to preview the drop position
- Highlight drop zones

## Technical Requirements

### WASM Loading Pattern
```typescript
// Example WASM loading approach
const loadWasm = async () => {
  const wasmModule = await import('/renderer.wasm');
  // Initialize and bind to canvas
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

1. Place `renderer.wasm` in the `public/` folder
2. Run `npm install` and `npm run dev`
3. Start with WASM integration
4. Implement playback system
5. Add timeline interactivity
6. Implement command pattern

## Submission
- Provide working application with all required features
- Include brief documentation of your implementation approach
- Note any assumptions or trade-offs made
- Ensure code is well-commented and production-ready

Good luck!