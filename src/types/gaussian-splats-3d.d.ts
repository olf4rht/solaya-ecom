declare module "@mkkellogg/gaussian-splats-3d" {
  import type { Scene, WebGLRenderer, PerspectiveCamera } from "three";

  interface ViewerOptions {
    scene?: Scene;
    renderer?: WebGLRenderer;
    camera?: PerspectiveCamera;
    selfDrivenMode?: boolean;
    useBuiltInControls?: boolean;
    rootElement?: HTMLElement;
    initialCameraPosition?: [number, number, number];
    initialCameraLookAt?: [number, number, number];
    ignoreDevicePixelRatio?: boolean;
  }

  interface SplatSceneOptions {
    splatAlphaRemovalThreshold?: number;
    showLoadingUI?: boolean;
    position?: [number, number, number];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    format?: number; // 0=Splat, 1=KSplat, 2=Ply, 3=Spz
  }

  export class Viewer {
    constructor(options?: ViewerOptions);
    addSplatScene(url: string, options?: SplatSceneOptions): Promise<void>;
    start(): Promise<void>;
    update(): void;
    dispose(): void;
  }
}
