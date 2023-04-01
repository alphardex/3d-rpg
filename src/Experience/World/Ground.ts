import * as THREE from "three";
import * as kokomi from "kokomi.js";
import * as CANNON from "cannon-es";

import type Experience from "../Experience";

class Ground extends kokomi.Component {
  declare base: Experience;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  constructor(base: kokomi.Base) {
    super(base);

    const size = new THREE.Vector2(1000, 1000);

    const geometry = new THREE.PlaneGeometry(size.x, size.y);

    const grassDiffuseTex = this.base.assetManager?.items[
      "grassDiffuse"
    ] as THREE.Texture;
    const grassNormalTex = this.base.assetManager?.items[
      "grassNormal"
    ] as THREE.Texture;
    grassDiffuseTex.wrapS = grassDiffuseTex.wrapT = THREE.RepeatWrapping;
    grassDiffuseTex.repeat.copy(size);
    grassDiffuseTex.encoding = THREE.sRGBEncoding;
    grassNormalTex.wrapS = grassNormalTex.wrapT = THREE.RepeatWrapping;
    grassNormalTex.repeat.copy(size);
    grassNormalTex.encoding = THREE.sRGBEncoding;

    const material = new THREE.MeshStandardMaterial({
      map: grassDiffuseTex,
      normalMap: grassNormalTex,
      normalScale: new THREE.Vector2(0.2, 0.2),
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = THREE.MathUtils.degToRad(-90);
    this.mesh = mesh;
    mesh.receiveShadow = true;

    const shape = kokomi.convertGeometryToShape(geometry);
    const body = new CANNON.Body({
      mass: 0,
      shape,
      position: new CANNON.Vec3(0, -1, 0),
    });
    body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      THREE.MathUtils.degToRad(-90)
    );
    this.body = body;
  }
  addExisting(): void {
    const { base, mesh, body } = this;
    const { scene, physics } = base;

    scene.add(mesh);
    physics.add({ mesh, body });
  }
}

export default Ground;
