import * as kokomi from "kokomi.js";
import * as dat from "lil-gui";

import type Experience from "../Experience";

import CannonDebugger from "cannon-es-debugger";

export default class Debug extends kokomi.Component {
  declare base: Experience;
  active: boolean;
  ui: dat.GUI | null;
  cannonDebugger!: typeof CannonDebugger;
  stats!: kokomi.Stats;
  constructor(base: Experience) {
    super(base);

    this.active = window.location.hash === "#debug";

    this.ui = null;

    if (this.active) {
      this.ui = new dat.GUI();

      // @ts-ignore
      const cannonDebugger = new CannonDebugger(
        this.base.scene,
        this.base.physics.world
      );
      this.cannonDebugger = cannonDebugger;

      const stats = new kokomi.Stats(this.base);
      this.stats = stats;
    }
  }
  update() {
    (this.cannonDebugger as any)?.update();
  }
}
