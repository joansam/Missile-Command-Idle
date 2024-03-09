export class Explosion {
  // The explosion position
  x: number;
  y: number;
  lifetime:number;
  currentRadius: number;
  maxRadius:number;
  growthRate: number;
  color: number;
  alpha: number; //Unused rn
  state: string; // The explosion state (growing, fading, or finished)


  graphics: Phaser.GameObjects.Graphics;

  // Initialize the explosion
  constructor(scene: Phaser.Scene, x: number, y: number, lifetime: number) {
    this.x = x;
    this.y = y;
    this.lifetime = lifetime;
    this.currentRadius = 1;
    this.maxRadius = 20;
    this.growthRate = .7;
    this.color = 0xffffff;
    this.alpha = 1;
    this.state = "growing";

    // Create the explosion sprite
    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0xffffff } });
    this.graphics.setPosition(x,y)
    this.graphics.setDepth(1); // Set the depth to ensure explosions are drawn on top

  }

  private drawExplosion() {
    this.graphics.clear();
    this.graphics.fillStyle(this.color, 1);
    this.graphics.fillCircle(0, 0, this.currentRadius);
  }

  public update(): boolean {
    if (this.state === "growing" && this.currentRadius < this.maxRadius) {
      this.currentRadius += this.growthRate;
      const t = this.currentRadius / this.maxRadius;
      
      // Interpolate between white (255, 255, 255) and yellow (255, 255, 0)
      const r = Math.floor(255 * (1 - t));
      const g = Math.floor(255 * t);
      const b = 0;
      
      // Combine the red, green, and blue components into a single hexadecimal color value
      // (r << 16) shifts the red component left by 16 bits
      // (g << 8) shifts the green component left by 8 bits
      // The resulting color value is a combination of the shifted red and green components and the blue component
      this.color = (r << 16) | (g << 8) | b;
    } else if (this.state === "growing" && this.currentRadius >= this.maxRadius) {
      this.state = "fading";
    } else if (this.state === "fading" && this.currentRadius > 0) {
      this.currentRadius -= this.growthRate;
      const t = 1 - this.currentRadius / this.maxRadius;
      
      // Interpolate between yellow (255, 255, 0) and red (255, 0, 0)
      const r = 255;
      const g = Math.floor(255 * (1 - t));
      const b = 0;
      
      // Combine the red, green, and blue components into a single hexadecimal color value
      // (r << 16) shifts the red component left by 16 bits
      // (g << 8) shifts the green component left by 8 bits
      // The resulting color value is a combination of the shifted red and green components and the blue component
      this.color = (r << 16) | (g << 8) | b;
    } else if (this.state === "fading" && this.currentRadius <= 0) {
      this.state = "finished";
      this.graphics.destroy();
      return true;
    }
  
    this.drawExplosion();
    return false;
  }

}