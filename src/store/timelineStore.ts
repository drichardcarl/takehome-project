import { create } from 'zustand';

export interface Scene {
  scene_name: string;
  scene_color: string;
  scene_length: number;
  scene_index: number;
}

interface TimelineState {
  scenes: Scene[];
}

export const useTimelineStore = create<TimelineState>(() => ({
  scenes: [
    {
      scene_name: "Scene 1",
      scene_color: "#F65937",
      scene_length: 30,
      scene_index: 0
    },
    {
      scene_name: "Scene 2", 
      scene_color: "#379EF6",
      scene_length: 60,
      scene_index: 1
    },
    {
      scene_name: "Scene 3",
      scene_color: "#1FBD5F", 
      scene_length: 30,
      scene_index: 2
    }
  ]
}));