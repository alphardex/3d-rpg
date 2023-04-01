import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

export interface TreeConfig {
  coord: THREE.Vector2;
  angle: number;
}

class Tree extends kokomi.Component {
  declare base: Experience;
  model: THREE.Group;
  body: CANNON.Body;
  constructor(base: kokomi.Base, config: Partial<TreeConfig> = {}) {
    super(base);

    const { coord = new THREE.Vector2(3, -5), angle = 0 } = config;

    const model = new THREE.Group();
    this.model = model;

    this.model.scale.setScalar(0.01);

    const realModel = this.base.assetManager?.items["tree"] as STDLIB.GLTF;
    realModel.scene.position.y = -200;
    this.model.add(realModel.scene.clone());

    const modelParts = kokomi.flatModel(realModel.scene);
    // kokomi.printModel(modelParts);

    const collider = new THREE.BoxGeometry(0.8, 4, 0.8);

    const shape = kokomi.convertGeometryToShape(collider);
    const body = new CANNON.Body({
      mass: 100,
      shape,
      position: new CANNON.Vec3(coord.x, 1, coord.y),
      type: CANNON.BODY_TYPES.STATIC,
    });
    body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      THREE.MathUtils.degToRad(angle)
    );
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
