import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';



export class SpineboyCharacter {
  public spineboy: Spine;

  constructor(app: PIXI.Application, resources: any) {
   if (!resources['spineboy-pro'] || !resources['spineboy-pro'].spineData) {
      throw new Error('Spine data for "spineboy-pro" not available');
    }

    this.spineboy = new Spine(resources['spineboy-pro'].spineData);

    this.spineboy.x = app.screen.width / 2;
    this.spineboy.y = app.screen.height;
    this.spineboy.scale.set(0.5);

    app.stage.addChild(this.spineboy);
  }

  setAnimation(animationName: string, loop: boolean) {
    if (this.spineboy.state.hasAnimation(animationName)) {
      this.spineboy.state.setAnimation(0, animationName, loop);
    }
  }
}

