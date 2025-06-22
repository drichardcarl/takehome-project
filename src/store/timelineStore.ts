import { create } from "zustand";

export interface Scene {
  scene_name: string;
  scene_color: string;
  scene_length: number;
  scene_index: number;
  start_frame: number;
}

export interface Command {
  execute(): void;
  undo(): void;
  description: string;
}

export interface RendererAPI {
  initCanvas: (canvasSelector: string) => void;
  renderScene: (
    scene_name: string,
    scene_color: string,
    local_frame: number
  ) => void;
  clearCanvas: () => void;
}

interface PlaybackState {
  isPlaying: boolean;
  currentFrame: number;
  fps: number;
}

interface TimelineState {
  scenes: Scene[];
  playback: PlaybackState;
  commandHistory: Command[];
  commandIndex: number;
  wasmInstance: RendererAPI | null;
  totalFrames: number;

  // Actions
  setWasmInstance: (instance: RendererAPI) => void;
  addScene: () => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;
  resizeScene: (sceneIndex: number, newLength: number) => void;
  setCurrentFrame: (frame: number) => void;
  setPlaybackState: (isPlaying: boolean) => void;
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  recalculateTimeline: () => void;
  getSceneAtFrame: (
    frame: number
  ) => { scene: Scene; localFrame: number } | null;
}

// Helper function to generate random colors
const generateRandomColor = (): string => {
  const colors = [
    "#F65937",
    "#379EF6",
    "#1FBD5F",
    "#F6A337",
    "#9B37F6",
    "#F6379B",
    "#37F6A3",
    "#F6E337",
    "#37A3F6",
    "#F63737",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to recalculate scene positions
const recalculateScenePositions = (scenes: Scene[]): Scene[] => {
  let currentFrame = 0;
  return scenes
    .map((scene, index) => ({
      ...scene,
      scene_index: index,
      start_frame: currentFrame,
    }))
    .map((scene) => {
      const result = { ...scene, start_frame: currentFrame };
      currentFrame += scene.scene_length;
      return result;
    });
};

export const useTimelineStore = create<TimelineState>((set, get) => ({
  scenes: [
    {
      scene_name: "Scene 1",
      scene_color: "#F65937",
      scene_length: 30,
      scene_index: 0,
      start_frame: 0,
    },
    {
      scene_name: "Scene 2",
      scene_color: "#379EF6",
      scene_length: 60,
      scene_index: 1,
      start_frame: 30,
    },
    {
      scene_name: "Scene 3",
      scene_color: "#1FBD5F",
      scene_length: 30,
      scene_index: 2,
      start_frame: 90,
    },
  ],
  playback: {
    isPlaying: false,
    currentFrame: 0,
    fps: 30,
  },
  commandHistory: [],
  commandIndex: -1,
  wasmInstance: null,
  totalFrames: 120, // 30 + 60 + 30

  setWasmInstance: (instance) => set({ wasmInstance: instance }),

  addScene: () => {
    const { scenes } = get();
    const newSceneIndex = scenes.length;
    const newScene: Scene = {
      scene_name: `Scene ${newSceneIndex + 1}`,
      scene_color: generateRandomColor(),
      scene_length: 30,
      scene_index: newSceneIndex,
      start_frame: scenes.reduce((sum, scene) => sum + scene.scene_length, 0),
    };

    const command: Command = {
      execute: () => {
        const { scenes } = get();
        const updatedScenes = [...scenes, newScene];
        const recalculatedScenes = recalculateScenePositions(updatedScenes);
        const totalFrames = recalculatedScenes.reduce(
          (sum, scene) => sum + scene.scene_length,
          0
        );
        set({
          scenes: recalculatedScenes,
          totalFrames,
        });
      },
      undo: () => {
        const { scenes } = get();
        const updatedScenes = scenes.slice(0, -1);
        const recalculatedScenes = recalculateScenePositions(updatedScenes);
        const totalFrames = recalculatedScenes.reduce(
          (sum, scene) => sum + scene.scene_length,
          0
        );
        set({
          scenes: recalculatedScenes,
          totalFrames,
        });
      },
      description: `Add ${newScene.scene_name}`,
    };

    get().executeCommand(command);
  },

  reorderScenes: (fromIndex: number, toIndex: number) => {
    const { scenes } = get();
    const command: Command = {
      execute: () => {
        const updatedScenes = [...scenes];
        const [movedScene] = updatedScenes.splice(fromIndex, 1);
        updatedScenes.splice(toIndex, 0, movedScene);
        const recalculatedScenes = recalculateScenePositions(updatedScenes);
        set({ scenes: recalculatedScenes });
      },
      undo: () => {
        const updatedScenes = [...scenes];
        const [movedScene] = updatedScenes.splice(toIndex, 1);
        updatedScenes.splice(fromIndex, 0, movedScene);
        const recalculatedScenes = recalculateScenePositions(updatedScenes);
        set({ scenes: recalculatedScenes });
      },
      description: `Move ${scenes[fromIndex].scene_name} to position ${
        toIndex + 1
      }`,
    };

    get().executeCommand(command);
  },

  resizeScene: (sceneIndex: number, newLength: number) => {
    const { scenes } = get();
    const oldLength = scenes[sceneIndex].scene_length;

    const command: Command = {
      execute: () => {
        const updatedScenes = [...scenes];
        updatedScenes[sceneIndex] = {
          ...updatedScenes[sceneIndex],
          scene_length: newLength,
        };
        const recalculatedScenes = recalculateScenePositions(updatedScenes);
        const totalFrames = recalculatedScenes.reduce(
          (sum, scene) => sum + scene.scene_length,
          0
        );
        set({
          scenes: recalculatedScenes,
          totalFrames,
        });
      },
      undo: () => {
        const updatedScenes = [...scenes];
        updatedScenes[sceneIndex] = {
          ...updatedScenes[sceneIndex],
          scene_length: oldLength,
        };
        const recalculatedScenes = recalculateScenePositions(updatedScenes);
        const totalFrames = recalculatedScenes.reduce(
          (sum, scene) => sum + scene.scene_length,
          0
        );
        set({
          scenes: recalculatedScenes,
          totalFrames,
        });
      },
      description: `Resize ${scenes[sceneIndex].scene_name} from ${oldLength} to ${newLength} frames`,
    };

    get().executeCommand(command);
  },

  setCurrentFrame: (frame: number) =>
    set((state) => ({
      playback: {
        ...state.playback,
        currentFrame: Math.max(0, Math.min(frame, state.totalFrames - 1)),
      },
    })),

  setPlaybackState: (isPlaying: boolean) =>
    set((state) => ({
      playback: { ...state.playback, isPlaying },
    })),

  executeCommand: (command: Command) => {
    const { commandHistory, commandIndex } = get();

    // Remove any commands after current index (for redo)
    const newHistory = commandHistory.slice(0, commandIndex + 1);
    newHistory.push(command);

    command.execute();

    set({
      commandHistory: newHistory,
      commandIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { commandHistory, commandIndex } = get();
    if (commandIndex >= 0) {
      commandHistory[commandIndex].undo();
      set({ commandIndex: commandIndex - 1 });
    }
  },

  redo: () => {
    const { commandHistory, commandIndex } = get();
    if (commandIndex < commandHistory.length - 1) {
      commandHistory[commandIndex + 1].execute();
      set({ commandIndex: commandIndex + 1 });
    }
  },

  recalculateTimeline: () => {
    const { scenes } = get();
    const recalculatedScenes = recalculateScenePositions(scenes);
    const totalFrames = recalculatedScenes.reduce(
      (sum, scene) => sum + scene.scene_length,
      0
    );
    set({ scenes: recalculatedScenes, totalFrames });
  },

  getSceneAtFrame: (frame: number) => {
    const { scenes } = get();
    const scene = scenes.find(
      (s) => frame >= s.start_frame && frame < s.start_frame + s.scene_length
    );

    if (scene) {
      const localFrame = frame - scene.start_frame;
      return { scene, localFrame };
    }

    return null;
  },
}));
