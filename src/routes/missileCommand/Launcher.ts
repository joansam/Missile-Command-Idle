import {Missile} from './Missile';
import { launcherPositionStore, missilePositionStore, mousePositionStore } from './stores';

export class Launcher {
    // The current direction of the launcher (in degrees)
    direction: number;
  
    // The position of the launcher on the screen
    position: [number, number];
  
    // The speed at which the launcher can rotate (in degrees per second)
    rotationSpeed: number;
  
    // The maximum number of missiles the launcher can fire at once
    maxMissiles: number;
  
    // The current number of missiles the launcher has fired
    currentMissiles: number;
  
    // The speed at which the missiles are fired (in pixels per second)
    missileSpeed: number;
  
    // An array of missiles currently in flight
    missiles: Missile[];

    angle:number;
  
    constructor(position: [number, number], maxMissiles: number, missileSpeed: number) {
      this.direction = 0;
      this.position = position;
      this.rotationSpeed = 0;
      this.maxMissiles = maxMissiles;
      this.currentMissiles = 0;
      this.missileSpeed = missileSpeed;
      this.missiles = [];
      this.angle = 0;
    }

    // Updates the launcher's direction based on the player's mouse
    
    
    update(mousePosition: [number, number]) {
      //console.log("update")
      //mousePositionStore.set([mousePosition[0], mousePosition[1]])
      //launcherPositionStore.set([Math.round(this.position[0]), Math.round(this.position[1])])
      //console.log("mousePos xy" + mousePosition[0] + " " + mousePosition[1] + " launcher xy " + this.position[0] + " " + this.position[1])
      // Calculate the angle between the launcher's position and the mouse position
      //var radians = Math.atan2(mousePosition[1] - this.position[1], mousePosition[0] - this.position[0]);
      var radians = Math.atan2( (mousePosition[1]+5)-this.position[1], (mousePosition[0]+5) - this.position[0])
        // Invert the angle if the mouse is to the left of the launcher
      radians+=Math.PI/2;

      // Convert the angle from radians to degrees
      this.angle = radians * 180 / Math.PI;
  
      // Rotate the launcher towards the calculated angle
      this.direction = this.angle
      //this.direction += (this.angle - this.direction) * this.rotationSpeed * 0.01;
      
      // Update each missile
      for (var missile of this.missiles) {
        //missilePositionStore.set([this.missiles[0].position[0], this.missiles[0].position[1]])
        //missile.update();
      }
    }
  
    // Draws the launcher and any missiles in flight
    draw(context: CanvasRenderingContext2D) {
      //console.log("position" + this.position + " and direction " + this.direction)
      // Save the current state of the canvas
      context.save();
      // Translate the canvas to the launcher's position
      context.translate(this.position[0], this.position[1]);
      // Rotate the canvas to match the launcher's direction
      context.rotate(this.direction * Math.PI / 180);
      //console.log("ctx facing" + this.direction)
  
      // Draw the launcher
      context.beginPath();
      context.moveTo(0, -20);
      context.lineTo(-20, 20);
      context.lineTo(0, 0);
      context.lineTo(20, 20);
      context.closePath();
      context.fillStyle = "blue";
      context.fill();
      context.restore();
    }
  
    // Returns true if the launcher is ready to fire a missile
    readyToFire() {
      return this.currentMissiles < this.maxMissiles;
    }
  
    // Fires a missile in the current direction
    fire(mousePosition:[number,number], missileArray: Missile[]) {
        const slowFactor = 100
        const fixedDirection = this.direction - 90;
        const missileVelocity:[number,number] = [Math.cos(fixedDirection * Math.PI / 180), Math.sin(fixedDirection * Math.PI / 180)];
        const missile = new Missile([this.position[0], this.position[1]], mousePosition, this.direction, [missileVelocity[0] * this.missileSpeed/slowFactor, missileVelocity[1] * this.missileSpeed/slowFactor], 1);
        missileArray.push(missile)
    }
}
  