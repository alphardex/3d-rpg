import * as THREE from "three";
import * as kokomi from "kokomi.js";

class SunLight extends kokomi.Component {
  dirLight: THREE.DirectionalLight;
  constructor(base: kokomi.Base) {
    super(base);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.dirLight = dirLight;
    dirLight.position.set(4, 4, 1);
    dirLight.castShadow = true;
    dirLight.shadow.bias = -0.001;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.camera.left = -10;
  }
  addExisting(): void {
    this.base.scene.add(this.dirLight);
  }
  update(): void {
    if (this.dirLight) {
      this.dirLight.position.x = this.base.camera.position.x + 1 + 4;
      this.dirLight.target.position.x = this.base.camera.position.x + 4;
      this.dirLight.position.y = this.base.camera.position.y + 1 + 4;
      this.dirLight.target.position.y = this.base.camera.position.y + 4;
      this.dirLight.position.z = this.base.camera.position.z + 1 + 1;
      this.dirLight.target.position.z = this.base.camera.position.z + 1;
      this.dirLight.target.updateMatrixWorld();
    }
  }
}

export default SunLight;
