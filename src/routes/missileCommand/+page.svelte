<svelte:head>
  <title>Missile Command!</title>
  <meta name="description" content="Based on the game 'Missile Command'" />
</svelte:head>

<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { mousePositionStore, paused, gameSpeed } from './stores';
  import { initializeGame } from './Game';

  let gameContainer: HTMLElement;

  onMount(async () => {
    await initializeGame();

    gameContainer.addEventListener('mousemove', (event) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      mousePositionStore.set([mouseX, mouseY]);
    });

    gameContainer.addEventListener('click', (event) => {
      // Add your logic for clicking, like firing a missile or launcher
    });
  });
</script>

<div>
  <h1>Mouse: [{$mousePositionStore[0]},{$mousePositionStore[1]}]</h1>
  <div bind:this={gameContainer} id="game-container"></div>
  <p>Game speed: {$gameSpeed}x</p>
  <button on:click={() => $gameSpeed *= 2}>+</button>
  <button on:click={() => $gameSpeed *= 0.5}>-</button>
  <button on:click={() => $paused = !$paused}>
    {#if $paused}
      Play
    {:else}
      Pause
    {/if}
  </button>
</div>

<style>
  #game-container {
    width: 800px;
    height: 600px;
    border: 1px solid gray;
    margin: auto;
  }
</style>