import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as POSTPROCESSING from "postprocessing";
import {
  SSGIEffect,
  TRAAEffect,
  MotionBlurEffect,
  VelocityDepthNormalPass,
  // @ts-ignore
} from "realism-effects";

import type Experience from "./Experience";

export default class Postprocessing extends kokomi.Component {
  declare base: Experience;
  ssgiEffect: SSGIEffect;
  constructor(base: kokomi.Base) {
    super(base);

    const { renderer, scene, camera } = this.base;

    const composer = new POSTPROCESSING.EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
      multisampling: 8,
    });
    // @ts-ignore
    this.base.composer = composer;

    composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));

    // const bloom = new POSTPROCESSING.BloomEffect({
    //   blendFunction: POSTPROCESSING.BlendFunction.ADD,
    //   luminanceThreshold: 0.1,
    //   luminanceSmoothing: 0.9,
    //   mipmapBlur: true,
    //   intensity: 1.5,
    // });

    // const effectPass = new POSTPROCESSING.EffectPass(camera, bloom);
    // composer.addPass(effectPass);

    const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera);
    composer.addPass(velocityDepthNormalPass);

    // SSGI
    const ssgiEffect = new SSGIEffect(scene, camera, velocityDepthNormalPass);
    this.ssgiEffect = ssgiEffect;

    const effectPass = new POSTPROCESSING.EffectPass(camera, ssgiEffect);
    composer.addPass(effectPass);

    // TRAA
    const traaEffect = new TRAAEffect(scene, camera, velocityDepthNormalPass);

    // Motion Blur
    const motionBlurEffect = new MotionBlurEffect(velocityDepthNormalPass);

    const effectPass2 = new POSTPROCESSING.EffectPass(
      camera,
      traaEffect,
      motionBlurEffect
    );
    composer.addPass(effectPass2);

    renderer.autoClear = false;
  }
}
