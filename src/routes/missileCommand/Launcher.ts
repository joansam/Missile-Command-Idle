import {Missile} from './Missile'
import { launcherPositionStore, missilePositionStore, mousePositionStore } from './stores'

export class Launcher {
  direction: number //in degrees
  position: Phaser.Math.Vector2
  rotationSpeed: number //in degrees per second
  maxMissiles: number
  currentMissiles: number

  missileSpeed: number //in pixels per second

  scene: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite;
  spriteBody: Phaser.GameObjects.Sprite;

  missiles: Missile[]

  angle:number;

  constructor(scene: Phaser.Scene, position: [number, number], maxMissiles: number, missileSpeed: number) {
    this.scene = scene
    this.sprite = scene.add.sprite(position[0], position[1], 'launcher');
    this.spriteBody = scene.add.sprite(position[0] - 1.5, position[1] + 20, 'launcherBody');
    this.spriteBody.setScale(.3)
    this.spriteBody.setDepth(1);
    //Rotate spriteBody to match the launcher's angle
    //this.spriteBody.rotation = Phaser.Math.DegToRad(-90);
    this.sprite.setOrigin(0.5, 1);
    this.spriteBody.setOrigin(0.5, .5);
    this.direction = 0
    this.position = new Phaser.Math.Vector2(position[0], position[1])
    this.rotationSpeed = 0
    this.maxMissiles = maxMissiles
    this.currentMissiles = 1
    this.missileSpeed = missileSpeed
    this.missiles = []
    this.angle = 0
  }

  // Updates the launcher's direction based on the player's mouse
  public update(mousePosition: [number, number]) {
    // Calculate the angle between the launcher's position and the mouse position
    const radians = Phaser.Math.Angle.BetweenPoints(this.position, new Phaser.Math.Vector2(mousePosition[0], mousePosition[1]))

    // Convert the angle from radians to degrees
    let angle = radians * Phaser.Math.RAD_TO_DEG;

    // Adjust the angle by subtracting 90 degrees to correct the sprite's orientation
    angle += 90;

    // Restrict the angle to stay above the x-axis
    //angle = Phaser.Math.Clamp(angle, -90, 90);

    // Update the launcher's angle
    this.angle = angle;
    this.sprite.rotation = Phaser.Math.DegToRad(this.angle);
    this.direction = this.angle //Why is this here? It seems redundant
    
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
    const slowFactor = 75
    const fixedDirection = this.direction - 90
    const missileVelocity:[number,number] = [Math.cos(fixedDirection * Math.PI / 180), Math.sin(fixedDirection * Math.PI / 180)]
    const missile = new Missile(scene, [this.position.x, this.position.y], mousePosition, this.direction, [missileVelocity[0] * this.missileSpeed/slowFactor, missileVelocity[1] * this.missileSpeed/slowFactor], 1)
    missileArray.push(missile)
    }
}