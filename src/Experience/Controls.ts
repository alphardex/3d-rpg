import * as kokomi from "kokomi.js";

import type Experience from "./Experience";

export default class Controls extends kokomi.Component {
  declare base: Experience;
  orbitControls: kokomi.OrbitControls;
  constructor(base: Experience) {
    super(base);

    this.orbitControls = new kokomi.OrbitControls(this.base);
  }
}
