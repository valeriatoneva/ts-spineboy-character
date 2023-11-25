import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import { Howl } from "howler";

type AnimationSpineboy = "idle" | "jump" | "walk";

let currentAnimation: AnimationSpineboy = "idle";

// bonus
const landingSound = new Howl({
  src: ["src/assets/cartoon-land.mp3"],
  volume: 0.5,
});

// 1. Initialize a PixiJS canvas to display the game scene.
const app = new PIXI.Application<HTMLCanvasElement>({
  width: 1920,
  height: 1080,
  backgroundColor: 0x000000,
});

app.view.style.width = "100%";
app.view.style.height = "auto";

document.body.appendChild(app.view);

// 2. Integrate the "Spineboy Pro" Spine animation into the scene.
const charaPromise = PIXI.Assets.load("src/assets/spineboy-pro.json");

charaPromise.then((res) => {
  const spineboy = new Spine(res.spineData);
  spineboy.pivot.set(0, -spineboy.height / 2);

  // init position
  spineboy.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(spineboy);

  // 3. Ensure Spineboy has animations for idle, walking, and jumping.
  const animationNames: Record<AnimationSpineboy, string> = {
    idle: "idle",
    walk: "walk",
    jump: "jump",
  };

  const keys: Record<string, boolean> = {};
  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });
  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  let isJumping = false;

  const jumpHeight = 200;
  const jumpDuration = 500;
  let jumpStartTime = 0;

  // 4. Implement left and right arrow keys to make Spineboy walk in the respective directions and ensure a smooth transition between idle, walking, and jumping animations
  app.ticker.add(() => {
    if (keys["ArrowLeft"]) {
      // left arrow key
      spineboy.scale.x = -1; // flipping Spineboy to face left
      if (!isJumping) {
        spineboy.state.setAnimation(0, animationNames.walk, true);
      }
      spineboy.x -= 5; // move left
    } else if (keys["ArrowRight"]) {
      // right arrow key
      spineboy.scale.x = 1; // spineboy faces right
      if (!isJumping) {
        spineboy.state.setAnimation(0, animationNames.walk, true);
      }
      spineboy.x += 5; // move right
    } else if (!isJumping) {
      // no movement keys pressed
      spineboy.state.setAnimation(0, animationNames.idle, true);
    }

    // 5. Use the spacebar for making Spineboy jump.
    if (keys[" "] && !isJumping) {
      isJumping = true;
      jumpStartTime = Date.now();
      spineboy.state.setAnimation(0, animationNames.jump, false);
    }

    if (isJumping) {
      const currentTime = Date.now();
      const elapsed = currentTime - jumpStartTime;
      if (elapsed < jumpDuration) {
        const jumpProgress = elapsed / jumpDuration;
        const jumpY =
          jumpHeight *
          Math.sin(
            (Math.PI / 2) *
              (jumpProgress < 0.5 ? jumpProgress : 1 - jumpProgress),
          );

        const easingFactor = Math.pow(jumpProgress, 3);
        spineboy.y = app.screen.height / 2 - jumpY * easingFactor;
      } else {
        // transition back to idle smoothly
        const currentTime = Date.now();
        const returnDuration = 100;
        const returnProgress =
          (currentTime - (jumpStartTime + jumpDuration)) / returnDuration;

        if (returnProgress < 1) {
          const returnY = jumpHeight * Math.sin((Math.PI / 2) * returnProgress);
          spineboy.y = app.screen.height / 2 - returnY;
        } else {
          // end of jump
          isJumping = false;
          spineboy.y = app.screen.height / 2;
          spineboy.state.setAnimation(0, animationNames.idle, true);
          landingSound.play();
        }
      }
    }
  });
});
