import * as kokomi from "kokomi.js";
import * as dat from "lil-gui";

import type Experience from "../Experience";

import config from "../../config";

import CannonDebugger from "cannon-es-debugger";

import { SSGIDebugGUI } from "./SSGIDebugGUI";

export default class Debug extends kokomi.Component {
  declare base: Experience;
  active: boolean;
  ui: dat.GUI | null;
  cannonDebugger!: typeof CannonDebugger;
  stats!: kokomi.Stats;
  ssgiDebugGUI!: SSGIDebugGUI;
  constructor(base: Experience) {
    super(base);

    this.active = window.location.hash === "#debug";

    this.ui = null;

    if (this.active) {
      // this.ui = new dat.GUI();

      if (config.debug.physics) {
        // @ts-ignore
        const cannonDebugger = new CannonDebugger(
          this.base.scene,
          this.base.physics.world
        );
        this.cannonDebugger = cannonDebugger;
      }

      if (config.debug.stats) {
        const stats = new kokomi.Stats(this.base);
        this.stats = stats;
      }

      if (this.base.postprocessing?.ssgiEffect) {
        const ssgiDebugGUI = new SSGIDebugGUI(
          this.base.postprocessing?.ssgiEffect,
          config.debug.ssgiOptions
        );
        this.ssgiDebugGUI = ssgiDebugGUI;
      }
    }
  }
  update() {
    (this.cannonDebugger as any)?.update();
  }
}
