<svelte:head>
	<title>Missile Command!</title>
	<meta name="description" content="Based on the game 'Missile Command'" />
</svelte:head>

<div>
  <!--Missile: [{$missilePositionStore[0]}, {$missilePositionStore[1]}], -->
	<h1>Mouse: [{$mousePositionStore[0]},{$mousePositionStore[1]}] </h1>
</div>

<style>
    canvas {
        display: block;
        width: 100%;
        height: 100%;
        border: 1px solid gray;
        margin: auto;
      }
</style>

<script lang="ts">
	import type { Launcher } from './Launcher';
  import { onMount } from 'svelte';
  import { Game } from './Game'
  import { mousePositionStore, launcherPositionStore, missilePositionStore, paused, gameSpeed } from './stores';
  import {get} from 'svelte/store';
  let gameCanvas: HTMLCanvasElement;
  let game: Game;
  var canvasSize = [500,500]

  onMount(() => {
    let context = gameCanvas.getContext("2d")!
    context.fillStyle = 'red';
    context.fillRect(0, 0, canvasSize[0], canvasSize[1]);
    
    function startGame() {
      console.log('start game');
      game = new Game(canvasSize[0],canvasSize[1], context);

      // Set the canvas size in pixels
      gameCanvas.width = canvasSize[0];
      gameCanvas.height = canvasSize[1];

      // Set the canvas Element size to match the canvas size in pixels
      //THIS LETS YOU POINT THE LAUNCHER AT THE MOUSE PROPERLY
      //Otherwise the mouse uses some weird HTML coord system that's not pixels
      gameCanvas.style.width = `${canvasSize[0]}px`;
      gameCanvas.style.height = `${canvasSize[1]}px`;

      

      // Add a mousemove event listener to the canvas
      gameCanvas.addEventListener('mousemove', (event) => {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        //console.log("mouseX: " + mouseX + " mouseY: " + mouseY)
        mousePositionStore.set([mouseX,mouseY])
        //console.log("mouseStoreX: " + get(mousePositionStore)[0] + " mouseStoreY: " + get(mousePositionStore)[1])
        //update(mouseX, mouseY);
      });
      gameCanvas.addEventListener('click', (event) => {
        //console.log("clicky")
        if (game.launcher.readyToFire()) {
          //console.log("Ready to fire")
          game.launcher.fire([$mousePositionStore[0], $mousePositionStore[1]], game.missiles);
        }
      });
      //update($mousePositionStore[0], $mousePositionStore[1])
      game.update();
    }

  /*function update(mouseX: number, mouseY: number) {
    game.update(mouseX, mouseY);
    game.draw();
    requestAnimationFrame(() => update(mouseX, mouseY));
  } */
    startGame();
  })
</script>

<canvas bind:this={gameCanvas} width={canvasSize[0]} height={canvasSize[1]} />

<p>
  Game speed: {$gameSpeed}x
</p>
<button on:click = {game.increaseGameSpeed}>
  +
</button>
<button on:click = {game.decreaseGameSpeed}>
  -
</button>
<button on:click={() => game.playPause()}>
  {#if ($paused)} Play
  {:else} Pause
  {/if}
  </button>
