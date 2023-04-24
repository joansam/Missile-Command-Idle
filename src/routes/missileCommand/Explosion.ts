export class Explosion {
  // The explosion position
  public x: number;
  public y: number;
  public lifetime:number;

  public currentRadius: number;
  maxRadius:number;
  public growthRate: number;
  public color: string;
  public alpha: number; //Unused rn

  // The explosion state (growing, fading, or finished)
  public state: string;

  // The explosion sprite
  public sprite: Phaser.GameObjects.Sprite;

  // Initialize the explosion
  constructor(scene: Phaser.Scene, x: number, y: number, lifetime: number) {
    this.x = x;
    this.y = y;
    this.lifetime = lifetime;
    this.currentRadius = 1;
    this.maxRadius = 20;
    this.growthRate = .7;
    this.color = "white";
    this.alpha = 1;
    this.state = "growing";

    // Create the explosion sprite
    this.sprite = scene.add.sprite(x, y, 'explosion');
    this.sprite.setScale(1);
    this.sprite.setOrigin(0.5);
    this.sprite.setAlpha(0.8);
    this.sprite.play('explode');
    this.sprite.once('animationcomplete', () => {
      this.state = "finished";
      this.sprite.destroy();
    });
  }

  // Update the explosion state
  public update(explosions:Explosion[]) {
    if (this.state === "growing" && this.currentRadius < this.maxRadius) {
      this.currentRadius += this.growthRate;
    } else if (this.state === "growing" && this.currentRadius > this.maxRadius) {
      this.state = "fading";
      this.currentRadius -= this.growthRate;
    }
    else if (this.state === "fading" && this.currentRadius > 0) {
      this.currentRadius -= this.growthRate;
    }
    else if (this.state === "finished") {
      // Filter the explosion out of the array
      explosions = explosions.filter(e => e !== this);
    }

    // Update the explosion transparency - not in use rn
    // if (this.state === "growing" || this.state === "fading") {
    //   this.alpha -= this.growthRate / 100
    // }
  }
}