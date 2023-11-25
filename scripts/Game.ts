import { SpineboyCharacter } from './characters/SpineboyCharacter';
import * as PIXI from 'pixi.js';


export class Game {
  private app: PIXI.Application;
  private spineboyCharacter!: SpineboyCharacter;


  constructor() {
    this.app = new PIXI.Application({ width: 800, height: 600 });
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.preloadAssets();
  }

  private async preloadAssets() {
    PIXI.Assets.add('spineboy-pro', 'assets/spineboy-pro.png');
    PIXI.Assets.add('spineboy-pro-json', 'assets/spineboy-pro.json');
    PIXI.Assets.add('spineboy-pro-atlas', 'assets/spineboy-pro.atlas');
  
    try {
      await PIXI.Assets.load(['spineboy-pro', 'spineboy-pro-json', 'spineboy-pro-atlas']);
      this.initializeSpineboy();
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }
  

  private initializeSpineboy() {
    console.log('Loaded assets:', PIXI.Assets.cache);
  
    if (PIXI.Assets.cache.has('spineboy-pro')) {
      const spineboyTexture = PIXI.Texture.from('spineboy-pro');
  
      this.spineboyCharacter = new SpineboyCharacter(this.app, spineboyTexture);
      this.spineboyCharacter.setAnimation('idle', true);

      this.app.stage.addChild(this.spineboyCharacter.spineboy);
    } else {
      console.error('spineboy-pro texture not loaded');
    }
  }
  

 
  private loadSpineData(url: string): any {
   
  }
}

window.onload = () => {
  const game = new Game();
};
