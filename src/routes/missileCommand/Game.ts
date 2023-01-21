import { get } from 'svelte/store';
import { Missile } from './Missile';
import { Launcher } from './Launcher';
import type { Explosion } from './Explosion';
import { mousePositionStore, paused, gameSpeed } from './stores';

export class Game {

    private width: number
    private height: number
    private context:CanvasRenderingContext2D
    public launcher: Launcher
    public missiles: Missile[]
    public numMissiles:number = 20
    launchTimes:number[] = []
    public explosions: Explosion[]
    startTime:number
    elapsedTime = 0
    private actionCounter = 0
    private tickLength = 1
    private actionLength = 2
    roundLength:number = 60
      private playing: boolean;
  
    //CONSTRUCTOR
    constructor(width: number, height: number, ctx:CanvasRenderingContext2D) {
        
        this.width = width;
        this.height = height;
        this.context = ctx;
    
        // Create the player's missile launcher
        //position [x, y], max missiles, missile speed
        this.launcher = new Launcher([250, 490], 100, 200);
        this.missiles = [];
        this.explosions = [];
        this.playing = true;
        this.startTime = performance.now();
        this.setLaunchTimes()
    }
    public playPause() {
      paused.update(state => !state)
      if (get(paused) == false) {
        requestAnimationFrame(() => {
          this.update()
        })
      }
    }
    //These are separate functions bc it's easier to call them from the UI in its idiomatic button syntax. Can change if you want tho.
    public increaseGameSpeed() {
      gameSpeed.update(speed => speed * 2)
    }
    public decreaseGameSpeed() {
      gameSpeed.update(speed => speed / 2)
    }

    // Update the game state
    public update() {
      if (get(paused)) {return}
      const mouseX = get(mousePositionStore)[0]
      const mouseY = get(mousePositionStore)[1]
      //Right now, launcher's update function is just updating its angle
      this.launcher.update([mouseX, mouseY])
      this.draw()

      this.actionCounter += get(gameSpeed) * this.tickLength
      //Do gameSpeed-sensitive actions
      if (this.actionCounter > this.actionLength) {
        // Update the incoming missiles
        for (let i = 0; i < this.missiles.length; i++) {
            this.missiles[i].update(this)
        }
        // Update the explosion effects
        for (let i = 0; i < this.explosions.length; i++) {
            this.explosions[i].update(this)
        }
        this.actionCounter -= this.actionLength
      }

      this.elapsedTime = (performance.now() - this.startTime) / 1000;
      const validTimes = this.launchTimes.filter(t => t == Math.round(this.elapsedTime)).length
      //if (this.elapsedTime * 100000 % 1000 == 0) {console.log("validTimes: " + validTimes + " elapsedTime: " + this.elapsedTime + " launchTimes: " + this.launchTimes[0] + " roundLength: " + this.roundLength)}
      if ( validTimes >= 1) {
        this.addMissile()
        //Cut that time out of the launchTimes array
        const index = this.launchTimes.indexOf(Math.round(this.elapsedTime))
        this.launchTimes = this.launchTimes.slice(0, index).concat(this.launchTimes.slice(index + 1))
      }
      //setTimeout(this.update(), this.tickLength)
      setTimeout( () => this.update(), this.tickLength )
    }

      // Draw the game graphics
    public draw() {
      //console.log("Drawing Game")
      // Clear the screen
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.width, this.height);

      // Draw the player's missile launcher
      this.launcher.draw(this.context);

      // Draw missiles
      for (let i = 0; i < this.missiles.length; i++) {
        this.missiles[i].draw(this.context);
        //console.log( "Drawing Missile in Game")
      }

      // Draw the explosion effects
      for (let i = 0; i < this.explosions.length; i++) {
        this.explosions[i].draw(this.context);
      }
    }
  
    // Add a new incoming missile to the game
    public addMissile() {
        const speed = .5
        // Generate a random position for the missile
        const x = Math.floor(Math.random() * (this.width));
        const y = -10;
        const angle1 = Math.atan2(y - this.height, x - this.width)
        const angle2 = Math.atan2(y - this.height, x)
        
        //To get a flat distribution of angles, comment the first and last line and uncomment the middle.
        var temp3 = Math.random() * (Math.cos(angle1) - Math.cos(angle2)) + Math.cos(angle2) //In radians
        //var angle3 = Math.random() * (angle1 - angle2) + angle2 //In radians
        var angle3 = -Math.acos(temp3) + Math.PI
        
        const velX = Math.cos(angle3) * speed
        const velY = Math.sin(angle3) * speed

        // Create the missile
        const missile = new Missile([x, y], [-100,-100], (angle3 * 180 / Math.PI) + 90, [velX,velY], 1);
        this.missiles.push(missile);
    }

    private setLaunchTimes() {
      this.launchTimes = []
      for (let i = 0; i < this.numMissiles; i++) {
        (this.launchTimes.push(Math.floor(Math.random() * this.roundLength)))
        
      }
    }

  // Handle player input
  public handleInput(event: KeyboardEvent) {
    // Check if the game is over
    if (!this.playing) return;

    /* Handle the left and right arrow keys
    if (event.keyCode === 37) {
      this.launcher.moveLeft();
    } else if (event.keyCode === 39) {
      this.launcher.moveRight();
    }

    // Handle the space bar (launch missile)
    if (event.keyCode === 32) {
      this.launcher.launchMissile();
    } */
  } 

  // Check for missile collisions
  public checkCollisions() {

  }
}