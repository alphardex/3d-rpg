import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

class Tree extends kokomi.Component {
  declare base: Experience;
  model: THREE.Group;
  body: CANNON.Body;
  constructor(base: kokomi.Base) {
    super(base);

    const model = new THREE.Group();
    this.model = model;

    this.model.scale.setScalar(0.01);

    const realModel = this.base.assetManager?.items["tree"] as STDLIB.GLTF;
    realModel.scene.position.y = -200;
    this.model.add(realModel.scene);

    const modelParts = kokomi.flatModel(realModel.scene);
    // kokomi.printModel(modelParts);

    const collider = new THREE.BoxGeometry(0.8, 4, 0.8);

    const shape = kokomi.convertGeometryToShape(collider);
    const body = new CANNON.Body({
      mass: 100,
      shape,
      position: new CANNON.Vec3(3, 1, -5),
      type: CANNON.BODY_TYPES.STATIC,
    });
    this.body = body;
  }
  addExisting(): void {
    const { base, model, body } = this;
    const { scene, physics } = base;

    scene.add(model);
    physics.add({ mesh: model, body });
  }
}

export default Tree;
