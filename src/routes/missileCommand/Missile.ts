import { missilePositionStore } from "./stores";
import { checkRectanglesCollision, distanceTo } from "./Utilities";
import type { Game } from "./Game";
import { Explosion } from "./Explosion";

export class Missile {
    // The missile's position
    position: [number, number];
    velocity: [number, number];
    orientation:number
    explodeCoords: [number, number];
    public health: number;
    private startTime: number;
    width:number = 8
    height:number = 12

  
    // Create a new missile
    constructor(position:[number,number], explodeCoords:[number,number],direction: number, velocity:[number,number], health: number) {
      this.position = [position[0], position[1]];
      this.explodeCoords = [explodeCoords[0], explodeCoords[1]];
      this.velocity = [velocity[0],velocity[1]];
      this.orientation = direction
      this.health = health;
      this.startTime = Date.now();

      // Create a canvas context for the missile
    }
  
    // Update the missile's position
    public update(game:Game) {
      // Calculate the elapsed time since the missile was created
      const elapsedTime = Date.now() - this.startTime;

      // Update the missile's position based on its velocity and the elapsed time
      this.position[0] += this.velocity[0] //* elapsedTime;
      this.position[1] += this.velocity[1] //* elapsedTime;
      missilePositionStore.set([this.position[0], this.position[1]])

      if (distanceTo(this.position[0], this.position[1], this.explodeCoords[0], this.explodeCoords[1]) < 15) {
        //Slice the missile from game's missile array
        game.missiles = game.missiles.filter(m => m != this)
        //Add an explosion to the game's explosion array
        game.explosions.push(new Explosion(this.position[0], this.position[1], 5))
      }

      // Check for collisions
      const thisRect = {x:this.position[0], y:this.position[1], width:1, height:1, angle:1}
      const otherRect = {x:1, y:1, width:1, height:1, angle:1}
      checkRectanglesCollision(thisRect, otherRect)
    }
  
    // Draw the missile on the canvas
    public draw(context: CanvasRenderingContext2D) {
      //Save the current context to avoid modifying prior state
      context.save();
      // Translate the canvas context to the position of the missile
      context.translate(this.position[0], this.position[1]);
      // Rotate the canvas context to match the direction of the missile
      context.rotate(this.orientation*Math.PI/180);
      // Draw the triangle
      context.beginPath();
      context.moveTo(-this.width/2, 0);
      context.lineTo(this.width/2, 0);
      context.lineTo(0, -this.height);
      context.closePath();
      context.fillStyle = "white";
      context.fill();
      // Restore the canvas context to its original state
      context.restore();
    }

    // Currently unused
    collidesWith(other: Missile) {
      const dx = this.position[0] - other.position[0];
      const dy = this.position[1] - other.position[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 2;
    }
  }