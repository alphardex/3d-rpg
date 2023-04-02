import * as kokomi from "kokomi.js";
import * as THREE from "three";

import config from "../../config";

import type Experience from "../Experience";

import SunLight from "./SunLight";
import Ground from "./Ground";
import Girl from "./Girl";
import Tree from "./Tree";

export default class World extends kokomi.Component {
  declare base: Experience;
  sunLight!: SunLight;
  ground!: Ground;
  girl!: Girl;
  trees!: Tree[];
  sparkles!: kokomi.Sparkles;
  constructor(base: Experience) {
    super(base);

    this.base.assetManager?.on("ready", async () => {
      const envMap = kokomi.getEnvmapFromHDRTexture(
        this.base.renderer,
        this.base.assetManager?.items["skybox"] as THREE.Texture
      );
      envMap.encoding = config.encoding;

      this.base.scene.background = envMap;

      this.base.scene.environment = envMap;

      const stage = new kokomi.Stage(this.base, {
        intensity: 4,
        shadow: false,
      });
      stage.addExisting();

      const sunLight = new SunLight(this.base);
      this.sunLight = sunLight;
      sunLight.addExisting();

      const ground = new Ground(this.base);
      this.ground = ground;
      ground.addExisting();

      const girl = new Girl(this.base);
      this.girl = girl;
      girl.addExisting();
      stage.add(girl.model);

      this.girl.idle();

      const trees = [
        { coord: new THREE.Vector2(4, -2), angle: 0 },
        { coord: new THREE.Vector2(3, -6), angle: 0 },
        { coord: new THREE.Vector2(7, -10), angle: 0 },
        { coord: new THREE.Vector2(15, -16), angle: 0 },
        { coord: new THREE.Vector2(-4, -2), angle: 180 },
        { coord: new THREE.Vector2(-3, -6), angle: 180 },
        { coord: new THREE.Vector2(-7, -10), angle: 180 },
        { coord: new THREE.Vector2(-15, -16), angle: 180 },
      ].map((item) => {
        const tree = new Tree(this.base, item);
        tree.addExisting();
        return tree;
      });
      this.trees = trees;

      const sparkles = new kokomi.Sparkles(this.base, {
        scale: [10, 2, 50],
        count: 200,
        size: 1.5,
      });
      this.sparkles = sparkles;
      sparkles.addExisting();

      this.emit("ready");
    });
  }
  update(): void {
    this.handleGirlControl();
  }
  handleGirlControl() {
    if (this.girl) {
      if (
        !this.base.keyboard.isUpKeyDown &&
        !this.base.keyboard.isDownKeyDown &&
        !this.base.keyboard.isLeftKeyDown &&
        !this.base.keyboard.isRightKeyDown &&
        !this.base.keyboard.isShiftKeyDown
      ) {
        if (this.girl.state !== "jumping") {
          this.girl.resetDirection();
          this.girl.idle();
        }
      }

      if (this.base.keyboard.isSpaceKeyDown) {
        this.girl.jumping();
        return;
      }

      if (this.base.keyboard.isUpKeyDown) {
        this.girl.isForward = true;
      } else {
        this.girl.isForward = false;
      }
      if (this.base.keyboard.isDownKeyDown) {
        this.girl.isBackward = true;
      } else {
        this.girl.isBackward = false;
      }
      if (this.base.keyboard.isLeftKeyDown) {
        this.girl.isLeftward = true;
      } else {
        this.girl.isLeftward = false;
      }
      if (this.base.keyboard.isRightKeyDown) {
        this.girl.isRightward = true;
      } else {
        this.girl.isRightward = false;
      }

      const isMoveKeyDown =
        this.base.keyboard.isUpKeyDown ||
        this.base.keyboard.isDownKeyDown ||
        this.base.keyboard.isLeftKeyDown ||
        this.base.keyboard.isRightKeyDown;
      const isShiftKeyDown = this.base.keyboard.isShiftKeyDown;

      if (isMoveKeyDown && isShiftKeyDown) {
        this.girl.walking();
      } else if (isMoveKeyDown) {
        this.girl.running();
      } else {
        this.girl.idle();
      }
    }
  }
}
