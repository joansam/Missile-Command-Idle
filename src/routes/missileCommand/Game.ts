import { onMount } from 'svelte';
import { Missile } from './Missile'
import { Launcher } from './Launcher'
import { Explosion } from './Explosion'
import { mousePositionStore, paused, gameSpeed } from './stores'
import { get, writable } from 'svelte/store'

export const game = writable(null);

let width = 800
let height = 600
let launcher: Launcher;
let missiles: Missile[] = [];
let numMissiles:number = 20
let explosions: Explosion[] = [];
let startTime: number = 0
let elapsedTime: number = 0
let actionCounter: number = 0
let tickLength: number = 1
let actionLength: number = 2
let roundLength: number = 60
let launchTimes:number[] = []
let playing: boolean = false


export async function initializeGame() {
    const Phaser = await import('phaser');


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        
        this.load.image('missile', '/missile.png');
        this.load.image('launcher', '/launcher.png');
        this.load.image('launcherBody', '/launcherBody.png');
        //this.load.image('explosion', './lib/images/explosion.png');
    }

    create() {

        this.input.on('pointerdown', this.handleClick, this);

        launcher = new Launcher(this, [395, 585], 100, 200);
        playing = true;
        startTime = performance.now();
        setLaunchTimes();
    }

    handleClick() {
        if (launcher.readyToFire()) {
          const mousePosition = this.input.activePointer.position;
          launcher.fire(this, [mousePosition.x, mousePosition.y], missiles);
        }
      }

    update() {
        if (get(paused)) { return; }
        const mouseX = get(mousePositionStore)[0];
        const mouseY = get(mousePositionStore)[1];

        // Update the launcher's angle
        launcher.update([mouseX, mouseY]);

        //This is where you would call draw() on the missile, launcher, and explosion sprites if using an HTML canvas
        // Call update on the missiles and explosions
        
        actionCounter += get(gameSpeed) * tickLength;

        // Do gameSpeed-sensitive actions
        if (actionCounter > actionLength) {
            // Update the incoming missiles
            for (let i = 0; i < missiles.length; i++) {
                //This code is wonky
                missiles = missiles[i].update(missiles, explosions);
            }

            // Update the explosion effects
            explosions = explosions.filter(explosion => !explosion.update());
            actionCounter -= actionLength;
        }

        elapsedTime = (performance.now() - startTime) / 1000;
        const validTimes = launchTimes.filter(t => t == Math.round(elapsedTime)).length;

        if (validTimes >= 1) {
            addMissile(this);
            // Cut that time out of the launchTimes array
            const index = launchTimes.indexOf(Math.round(elapsedTime));
            launchTimes = launchTimes.slice(0, index).concat(launchTimes.slice(index + 1));
        }

        //setTimeout(() => this.update(), tickLength);
        }
}


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: width,
    height: height,
    parent: 'game-container',
    scene: [new GameScene()]
    ,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800, // Set the desired width of the game canvas
        height: 600 // Set the desired height of the game canvas
      },
    physics: {
        default: 'arcade',
        arcade: {
            //No gravity
            gravity: { y: 0, x: 0 },
        }
    }
}

game.set(new Phaser.Game(config) as any);

};
// Add a new incoming missile to the game


function setLaunchTimes() {
    launchTimes = []
    for (let i = 0; i < numMissiles; i++) {
      (launchTimes.push(Math.floor(Math.random() * roundLength)))
      
    }
  }

function addMissile(scene: Phaser.Scene) {
    const speed = 1
    // Generate a random position for the missile
    const x = Math.floor(Math.random() * (width));
    const y = -10;
    const angle1 = Math.atan2(y - height, x - width)
    const angle2 = Math.atan2(y - height, x)
    
    //To get a flat distribution of angles, comment the first and last line and uncomment the middle.
    var temp3 = Math.random() * (Math.cos(angle1) - Math.cos(angle2)) + Math.cos(angle2) //In radians
    //var angle3 = Math.random() * (angle1 - angle2) + angle2 //In radians
    var angle3 = -Math.acos(temp3) + Math.PI
    
    const velX = Math.cos(angle3) * speed
    const velY = Math.sin(angle3) * speed

    // Create the missile
    const missile = new Missile(scene, [x, y], [-100,-100], (angle3 * 180 / Math.PI) + 90, [velX,velY], 1);
    missiles.push(missile);
}

function addExplosion(scene: Phaser.Scene, x: number, y: number, lifetime: number) {
    const explosion = new Explosion(scene, x, y, lifetime);
    explosions.push(explosion);
}