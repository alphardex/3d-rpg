import type * as kokomi from "kokomi.js";

export const resources: kokomi.ResoureList = [
  {
    name: "skybox",
    type: "texture",
    path: "skybox/FS002_Night.png",
  },
  {
    name: "grassDiffuse",
    type: "texture",
    path: "textures/Texture_Grass_Diffuse.png",
  },
  {
    name: "grassNormal",
    type: "texture",
    path: "textures/Texture_Grass_Normal.png",
  },
  {
    name: "girlIdle",
    type: "fbxModel",
    path: "models/girl/Idle.fbx",
  },
  {
    name: "girlWalking",
    type: "fbxModel",
    path: "models/girl/Walking.fbx",
  },
  {
    name: "girlRunning",
    type: "fbxModel",
    path: "models/girl/Running.fbx",
  },
  {
    name: "girlJumping",
    type: "fbxModel",
    path: "models/girl/Jumping.fbx",
  },
  {
    name: "tree",
    type: "gltfModel",
    path: "models/tree_for_games.glb",
  },
];
