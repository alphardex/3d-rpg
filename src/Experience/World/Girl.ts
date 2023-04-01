import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import type Experience from "../Experience";

class Girl extends kokomi.Component {
  declare base: Experience;
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null;
  state: "idle" | "walking" | "running" | "jumping" | "";
  body: CANNON.Body;
  speed: number;
  isForward: boolean;
  isBackward: boolean;
  isLeftward: boolean;
  isRightward: boolean;
  move: THREE.Vector3;
  directionOffset: number;
  rotateDirection: number;
  targetRotate: number;
  targetCameraRotation: number;
  walkDirection: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  constructor(base: Experience) {
    super(base);

    // const model = this.base.assetManager.items["girlIdle"];
    const model = new THREE.Group();
    this.model = model;

    const realModel = this.base.assetManager?.items["girlIdle"];
    realModel.rotation.y = -Math.PI;
    this.model.add(realModel);

    const modelParts = kokomi.flatModel(realModel);
    // kokomi.printModel(modelParts);

    modelParts.forEach((item) => {
      item.castShadow = true;
    });

    const head = modelParts[10] as THREE.Mesh;
    kokomi.smoothNormal(head);

    const mixer = new THREE.AnimationMixer(model);
    this.mixer = mixer;

    this.actions = {};

    this.currentAction = null;

    this.addAction("girlIdle", "idle");
    this.addAction("girlWalking", "walking");
    this.addAction("girlRunning", "running");
    this.addAction("girlJumping", "jumping");

    this.state = "";

    const collider = new THREE.BoxGeometry(0.5, 1.6, 0.4);

    // physics
    const shape = kokomi.convertGeometryToShape(collider);
    const body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0, 0, 0),
    });
    this.body = body;

    // control
    this.speed = 1;

    this.isForward = false;
    this.isBackward = false;
    this.isLeftward = false;
    this.isRightward = false;

    this.move = new THREE.Vector3(0, 0, 0);
    this.directionOffset = 0;
    this.rotateDirection = 1;
    this.targetRotate = 0;
    this.targetCameraRotation = 0;
    this.walkDirection = new THREE.Vector3(0, 0, 0);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
  }
  addExisting(): void {
    this.base.physics.add({ mesh: this.model, body: this.body });
  }
  resetDirection() {
    this.isForward = false;
    this.isBackward = false;
    this.isLeftward = false;
    this.isRightward = false;
  }
  update() {
    this.mixer.update(this.base.clock.deltaTime);

    if (this.state === "walking") {
      this.speed = 2;
    } else if (this.state === "running") {
      this.speed = 5;
    }

    if (this.isMoving) {
      this.handleMove();
    }
  }
  get isMoving() {
    return ["walking", "running"].includes(this.state);
  }
  handleMove() {
    let directionOffset = this.getDirectionOffset();
    this.directionOffset = directionOffset;

    this.targetRotate = THREE.MathUtils.lerp(
      this.targetRotate,
      Math.abs(directionOffset),
      0.2
    );

    const cameraRotation = Math.atan2(
      this.base.camera.position.x - this.model.position.x,
      this.base.camera.position.z - this.model.position.z
    );
    this.targetCameraRotation = THREE.MathUtils.lerp(
      this.targetCameraRotation,
      cameraRotation,
      0.2
    );

    let rotateDirection = this.getRotateDirection();
    this.rotateDirection = rotateDirection;

    const finalRotate =
      this.targetRotate * this.rotateDirection + this.targetCameraRotation;

    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      finalRotate
    );

    this.base.camera.getWorldDirection(this.walkDirection);
    this.walkDirection.y = 0;
    this.walkDirection.normalize();
    this.walkDirection.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      directionOffset
    );

    this.move.x = this.walkDirection.x * this.speed * this.base.clock.deltaTime;
    this.move.z = this.walkDirection.z * this.speed * this.base.clock.deltaTime;

    this.body.position.x += this.move.x;
    this.body.position.z += this.move.z;
    this.updateCameraTarget();
  }
  getRotateDirection() {
    let result = this.rotateDirection;
    if (this.isLeftward) {
      result = 1;
    } else if (this.isRightward) {
      result = -1;
    }
    return result;
  }
  updateCameraTarget() {
    this.base.camera.position.x += this.move.x;
    this.base.camera.position.y += this.move.y;
    this.base.camera.position.z += this.move.z;

    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 0.2;
    this.cameraTarget.z = this.model.position.z;
    this.base.controls.orbitControls.controls.target = this.cameraTarget;
  }
  getDirectionOffset() {
    let result = 0;
    if (this.isForward) {
      if (this.isLeftward) {
        result = Math.PI / 4;
      } else if (this.isRightward) {
        result = -Math.PI / 4;
      }
    } else if (this.isBackward) {
      if (this.isLeftward) {
        result = Math.PI / 4 + Math.PI / 2;
      } else if (this.isRightward) {
        result = -Math.PI / 4 - Math.PI / 2;
      } else {
        result = Math.PI;
      }
    } else if (this.isLeftward) {
      result = Math.PI / 2;
    } else if (this.isRightward) {
      result = -Math.PI / 2;
    }
    return result;
  }
  addAction(assetName: string, name: string) {
    const animation = this.base.assetManager?.items[assetName].animations[0];
    const action = this.mixer.clipAction(animation);
    this.actions[name] = action;
  }
  playAction(name: string) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.5);
    }
    const action = this.actions[name];
    action.weight = 1;
    action.reset().fadeIn(0.5).play();
    this.currentAction = action;
    return action;
  }
  idle() {
    if (this.state === "idle") {
      return;
    }
    this.state = "idle";
    this.playAction("idle");
  }
  walking() {
    if (this.state === "walking") {
      return;
    }
    this.state = "walking";
    this.playAction("walking");
  }
  running() {
    if (this.state === "running") {
      return;
    }
    this.state = "running";
    this.playAction("running");
  }
  jumping() {
    if (this.state === "jumping") {
      return;
    }
    this.state = "jumping";
    this.currentAction?.reset();
    this.playAction("jumping");
    const onLoopEnd = () => {
      this.idle();
      this.mixer.removeEventListener("loop", onLoopEnd);
    };
    this.mixer.addEventListener("loop", onLoopEnd);
  }
}

export default Girl;
