import type { Game } from "./Game"
import { checkRectanglesCollision } from "./Utilities"

export class Explosion {
    // The explosion position
    public x: number
    public y: number
    public lifetime:number
  
    public currentRadius: number
    maxRadius:number
    public growthRate: number
    public color: string
    public alpha: number //Unused rn
  
    // The explosion state (growing, fading, or finished)
    public state: string
  
    // Initialize the explosion
    constructor(x: number, y: number, lifetime: number) {
      this.x = x
      this.y = y
      this.lifetime = lifetime
      this.currentRadius = 1
      this.maxRadius = 20
      this.growthRate = .7
      this.color = "white"
      this.alpha = 1
      this.state = "growing"
    }
  
    // Update the explosion state
    public update(game:Game) {
      if (this.state === "growing" && this.currentRadius < this.maxRadius) {
        this.currentRadius += this.growthRate
      } else if (this.state === "growing" && this.currentRadius > this.maxRadius) {
        this.state = "fading"
        this.currentRadius -= this.growthRate
      }
      else if (this.state === "fading" && this.currentRadius > 0) {
        this.currentRadius -= this.growthRate
      }
      else {
        this.state = "finished"
        //Filter the explosion out of the array
        game.explosions = game.explosions.filter(e => e !== this)
      }
  
      // Update the explosion transparency - not in use rn
      if (this.state === "growing" || this.state === "fading") {
        this.alpha -= this.growthRate / 100
      }
    }
  
    // Draw the explosion
    public draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      // Set the explosion color and transparency
      ctx.fillStyle = this.color;
      //ctx.globalAlpha = this.alpha;
  
      // Draw the explosion
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.abs(this.currentRadius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  