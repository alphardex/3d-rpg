import * as kokomi from "kokomi.js";
import * as THREE from "three";

import { resources } from "./resources";

import config from "../config";

import Controls from "./Controls";
import World from "./World/World";
import Postprocessing from "./Postprocessing";
import Debug from "./Utils/Debug";

export default class Experience extends kokomi.Base {
  assetManager: kokomi.AssetManager | null;
  controls: Controls;
  world: World | null;
  postprocessing: Postprocessing | null;
  debug: Debug | null;
  constructor(sel = "#sketch") {
    super(sel, {
      gl: {
        powerPreference: "high-performance",
        premultipliedAlpha: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: true,
      },
    });

    (window as any).experience = this;

    // this.renderer.physicallyCorrectLights = true;
    this.renderer.useLegacyLights = false;

    // this.renderer.setClearColor(0xffffff, 1);

    // kokomi.beautifyRender(this.renderer);
    // this.renderer.toneMappingExposure = 0.5;

    kokomi.enableShadow(this.renderer);

    this.camera.position.set(0, 0, 2.7);
    (this.camera as THREE.PerspectiveCamera).fov = 60;
    this.camera.updateProjectionMatrix();

    this.controls = new Controls(this);

    this.assetManager = null;

    this.world = null;

    this.postprocessing = null;

    this.debug = null;
  }
  create() {
    this.assetManager = new kokomi.AssetManager(this, resources);

    this.world = new World(this);

    if (config.usePostprocessing) {
      this.postprocessing = new Postprocessing(this);
    }

    this.debug = new Debug(this);
  }
}
