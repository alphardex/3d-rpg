import * as kokomi from "kokomi.js";
import * as THREE from "three";

import { resources } from "./resources";

import Controls from "./Controls";
import World from "./World/World";
import Debug from "./Utils/Debug";

export default class Experience extends kokomi.Base {
  assetManager: kokomi.AssetManager | null;
  controls: Controls;
  world: World | null;
  debug: Debug;
  constructor(sel = "#sketch") {
    super(sel);

    (window as any).experience = this;

    // this.renderer.physicallyCorrectLights = true;
    this.renderer.useLegacyLights = false;

    this.renderer.setClearColor(0xffffff, 1);

    kokomi.beautifyRender(this.renderer);

    kokomi.enableShadow(this.renderer);

    this.camera.position.set(0, 0, 2.7);
    (this.camera as THREE.PerspectiveCamera).fov = 60;
    this.camera.updateProjectionMatrix();

    this.controls = new Controls(this);

    this.debug = new Debug();

    this.assetManager = null;

    this.world = null;
  }
  create() {
    this.assetManager = new kokomi.AssetManager(this, resources);

    this.world = new World(this);
  }
}
