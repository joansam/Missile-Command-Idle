import { missilePositionStore } from "./stores";
//import { checkRectanglesCollision, distanceTo } from "./Utilities";
import type { Explosion } from "./Explosion";

export class Missile extends Phaser.GameObjects.GameObject {
  // The missile's sprite
  scene: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite;
  explodeCoords: [number, number];
  velocity: [number, number];
  orientation:number
  health: number;
  startTime: number;
  detonateDistance = 10
  x:number
  y:number

  // Create a new missile
  constructor(scene: Phaser.Scene, position:[number,number], explodeCoords:[number,number],direction: number, velocity:[number,number], health: number) {
    super(scene, 'missile')
    this.scene = scene
    this.x = position[0]
    this.y = position[1]
    this.sprite = scene.add.sprite(this.x, this.y, 'missile');
    this.sprite = scene.physics.add.sprite(this.x, this.y, 'missile');
    this.explodeCoords = [explodeCoords[0], explodeCoords[1]];
    this.velocity = [velocity[0],velocity[1]];
    this.orientation = direction
    this.health = health;
    this.startTime = Date.now();
  }

  // Update the missile's position and orientation
  public update(missiles:Missile[], explosions:Explosion[]):Missile[] {
    // Calculate the elapsed time since the missile was created

    // Update the missile's position based on its velocity and the elapsed time
    this.sprite.x += this.velocity[0] //* elapsedTime;
    this.sprite.y += this.velocity[1] //* elapsedTime;
    missilePositionStore.set([this.sprite.x, this.sprite.y])

    // Rotate the missile sprite to match the direction of the missile
    this.sprite.rotation = this.orientation*Math.PI/180;

    // Check for detonation
    /*if (distanceTo(this.sprite.x, this.sprite.y, this.explodeCoords[0], this.explodeCoords[1]) < this.detonateDistance) {
      //Slice the missile from game's missile array
      const newMissiles = missiles.filter(m => m != this)
      //Add an explosion to the game's explosion array
      explosions.push(new Explosion(this.scene, this.sprite.x, this.sprite.y, 5))
      // Destroy the missile sprite
      this.sprite.destroy();
      return newMissiles;
    } */

    // Check for collisions
    //const thisRect = {x:this.sprite.x, y:this.sprite.y, width:1, height:1, angle:1}
    //const otherRect = {x:1, y:1, width:1, height:1, angle:1}
    //checkRectanglesCollision(thisRect, otherRect)
    return missiles;
  }
  public destroy(): void {
    // Destroy the missile sprite
    this.x = this.sprite.x
    this.y = this.sprite.y
    this.sprite.destroy();
  }
}