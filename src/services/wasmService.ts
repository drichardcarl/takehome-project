import type { RendererAPI } from "../store/timelineStore";

declare global {
  interface Window {
    RendererModule: () => Promise<RendererAPI>;
  }
}

export class WasmService {
  private static instance: WasmService;
  private module: RendererAPI | null = null;
  private loadingPromise: Promise<RendererAPI> | null = null;

  private constructor() {}

  static getInstance(): WasmService {
    if (!WasmService.instance) {
      WasmService.instance = new WasmService();
    }
    return WasmService.instance;
  }

  async loadRenderer(): Promise<RendererAPI> {
    if (this.module) {
      return this.module;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.initializeRenderer();
    return this.loadingPromise;
  }

  private async initializeRenderer(): Promise<RendererAPI> {
    try {
      // Check if the script is already loaded
      if (!window.RendererModule) {
        // Load the renderer.js script
        const script = document.createElement("script");
        script.src = "/renderer.js";
        script.async = true;

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Failed to load renderer.js"));
          document.head.appendChild(script);
        });
      }

      // Wait for the module to be available
      if (!window.RendererModule) {
        throw new Error("RendererModule not found after loading script");
      }

      // Instantiate the module
      this.module = await window.RendererModule();

      // Initialize the canvas
      this.module.initCanvas("#canvas");

      return this.module;
    } catch (error) {
      console.error("Failed to initialize WASM renderer:", error);
      throw error;
    }
  }

  getModule(): RendererAPI | null {
    return this.module;
  }

  isLoaded(): boolean {
    return this.module !== null;
  }
}

export const wasmService = WasmService.getInstance();
