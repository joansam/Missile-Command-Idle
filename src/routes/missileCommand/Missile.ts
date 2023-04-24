import { missilePositionStore } from "./stores";
import { checkRectanglesCollision, distanceTo } from "./Utilities";
import { Explosion } from "./Explosion";

export class Missile {
  // The missile's sprite
  scene: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite;
  explodeCoords: [number, number];
  velocity: [number, number];
  orientation:number
  health: number;
  startTime: number;
  detonateDistance = 10

  // Create a new missile
  constructor(scene: Phaser.Scene, position:[number,number], explodeCoords:[number,number],direction: number, velocity:[number,number], health: number) {
    this.scene = scene
    this.sprite = scene.add.sprite(position[0], position[1], 'missile');
    this.explodeCoords = [explodeCoords[0], explodeCoords[1]];
    this.velocity = [velocity[0],velocity[1]];
    this.orientation = direction
    this.health = health;
    this.startTime = Date.now();
  }

  // Update the missile's position and orientation
  public update(missiles:Missile[], explosions:Explosion[]):Missile[] {
    // Calculate the elapsed time since the missile was created
    const elapsedTime = Date.now() - this.startTime;

    // Update the missile's position based on its velocity and the elapsed time
    this.sprite.x += this.velocity[0] //* elapsedTime;
    this.sprite.y += this.velocity[1] //* elapsedTime;
    missilePositionStore.set([this.sprite.x, this.sprite.y])

    // Rotate the missile sprite to match the direction of the missile
    this.sprite.rotation = this.orientation*Math.PI/180;

    // Check for detonation
    if (distanceTo(this.sprite.x, this.sprite.y, this.explodeCoords[0], this.explodeCoords[1]) < this.detonateDistance) {
      //Slice the missile from game's missile array
      const newMissiles = missiles.filter(m => m != this)
      //Add an explosion to the game's explosion array
      explosions.push(new Explosion(this.scene, this.sprite.x, this.sprite.y, 5))
      // Destroy the missile sprite
      this.sprite.destroy();
      return newMissiles;
    }

    // Check for collisions
    const thisRect = {x:this.sprite.x, y:this.sprite.y, width:1, height:1, angle:1}
    const otherRect = {x:1, y:1, width:1, height:1, angle:1}
    checkRectanglesCollision(thisRect, otherRect)
    return missiles;
  }
}