import * as THREE from "three";

const config = {
  skipTitle: true,
  isFullscreen: false,
  encoding: THREE.sRGBEncoding,
  // encoding: THREE.LinearEncoding,
  usePostprocessing: true,
  debug: {
    physics: false,
    stats: true,
    ssgiOptions: {
      distance: 2.7200000000000104,
      thickness: 1.2999999999999972,
      autoThickness: false,
      maxRoughness: 1,
      blend: 0.95,
      denoiseIterations: 3,
      denoiseKernel: 3,
      denoiseDiffuse: 25,
      denoiseSpecular: 25.54,
      depthPhi: 5,
      normalPhi: 28,
      roughnessPhi: 18.75,
      envBlur: 0.55,
      importanceSampling: true,
      directLightMultiplier: 1,
      maxEnvLuminance: 50,
      steps: 20,
      refineSteps: 4,
      spp: 1,
      resolutionScale: 1,
      missedRays: false,
    },
  },
};

export default config;
