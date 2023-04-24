import {Missile} from './Missile'
import { launcherPositionStore, missilePositionStore, mousePositionStore } from './stores'

// Phaser comments:
// In this version of the `Launcher` class, we've removed the `draw()` method, as we don't need to manually draw the launcher sprite on the canvas. 
// Instead, we create the launcher sprite in the constructor using `scene.add.sprite()`. 
// We also use the `Phaser.Math.Angle.BetweenPoints()` method to calculate the angle between the launcher's position and the mouse position.
// And we update the launcher's rotation using this angle.
// Finally, we pass the `scene` object to the `fire()` method so that we can create the missile sprite using `scene.add.sprite()`.

export class Launcher {
  // The current direction of the launcher (in degrees)
  direction: number

  // The position of the launcher on the screen
  position: Phaser.Math.Vector2

  // The speed at which the launcher can rotate (in degrees per second)
  rotationSpeed: number

  // The maximum number of missiles the launcher can fire at once
  maxMissiles: number

  // The current number of missiles the launcher has fired
  currentMissiles: number

  // The speed at which the missiles are fired (in pixels per second)
  missileSpeed: number

  // An array of missiles currently in flight
  missiles: Missile[]

  angle:number;

  constructor(scene: Phaser.Scene, position: [number, number], maxMissiles: number, missileSpeed: number) {
    this.direction = 0
    this.position = new Phaser.Math.Vector2(position[0], position[1])
    this.rotationSpeed = 0
    this.maxMissiles = maxMissiles
    this.currentMissiles = 1
    this.missileSpeed = missileSpeed
    this.missiles = []
    this.angle = 0

    // Create the launcher sprite
    const launcherSprite = scene.add.sprite(position[0], position[1], 'launcher');
    launcherSprite.setOrigin(0.5);
  }

  // Updates the launcher's direction based on the player's mouse
  public update(mousePosition: [number, number]) {
    // Calculate the angle between the launcher's position and the mouse position
    const radians = Phaser.Math.Angle.BetweenPoints(this.position, new Phaser.Math.Vector2(mousePosition[0], mousePosition[1]))

    // Convert the angle from radians to degrees
    this.angle = radians * Phaser.Math.RAD_TO_DEG

    // Rotate the launcher towards the calculated angle
    this.direction = this.angle
    //this.direction += (this.angle - this.direction) * this.rotationSpeed * 0.01;

    // Update each missile
    for (const missile of this.missiles) {
      missile.update(this.missiles, [])
    }
  }

  // Returns true if the launcher is ready to fire a missile
  public readyToFire() {
    return this.currentMissiles < this.maxMissiles
  }

  // Fires a missile in the current direction
  public fire(scene: Phaser.Scene, mousePosition:[number,number], missileArray: Missile[]) {
    const slowFactor = 200
    const fixedDirection = this.direction - 90
    const missileVelocity:[number,number] = [Math.cos(fixedDirection * Math.PI / 180), Math.sin(fixedDirection * Math.PI / 180)]
    const missile = new Missile(scene, [this.position.x, this.position.y], mousePosition, this.direction, [missileVelocity[0] * this.missileSpeed/slowFactor, missileVelocity[1] * this.missileSpeed/slowFactor], 1)
    missileArray.push(missile)
    }
}