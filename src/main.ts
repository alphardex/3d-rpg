import "@alphardex/aqua.css/dist/aqua.min.css";

import "./style.css";

import Experience from "./Experience/Experience";

import config from "./config";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="sketch"></div>
<div class="title-scene absolute hv-center">
<div class="flex flex-col items-center space-y-24">
  <div class="text-6xl text-black whitespace-no-wrap">JK大冒险</div>
  <div>
    <div class="btn-enter btn btn-danger">进入游戏</div>
  </div>
</div>
</div>
<div class="loading-screen fixed z-5 top-0 left-0 loader-screen w-screen h-screen transition-all duration-300 bg-white">
    <div class="absolute hv-center">
        <div class="loading text-black text-3xl tracking-widest">
            <span style="--i: 0">L</span>
            <span style="--i: 1">O</span>
            <span style="--i: 2">A</span>
            <span style="--i: 3">D</span>
            <span style="--i: 4">I</span>
            <span style="--i: 5">N</span>
            <span style="--i: 6">G</span>
        </div>
    </div>
</div>
`;

const app = document.querySelector("#app") as HTMLElement;
const titleScene = document.querySelector(".title-scene") as HTMLElement;
const btnEnter = document.querySelector(".btn-enter") as HTMLElement;
const loadingScreen = document.querySelector(".loading-screen") as HTMLElement;

loadingScreen.style.display = "none";

const experience = new Experience("#sketch");

const enter = () => {
  titleScene.style.display = "none";

  loadingScreen.style.display = "block";

  experience.create();

  if (config.isFullscreen) {
    app.requestFullscreen();
  }

  experience.world?.on("ready", () => {
    loadingScreen.style.display = "none";
  });
};

btnEnter?.addEventListener("click", () => {
  enter();
});

if (config.skipTitle) {
  enter();
}
