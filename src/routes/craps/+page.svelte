<svelte:head>
	<title>Craps Idle!</title>
	<meta name="description" content="What it says on the tin" />
</svelte:head>

<div class="text-column">
	<h1>Win money! Lose money!</h1>
</div>



<script lang='ts'>
    import { writable } from 'svelte/store';
    
    import { placeBet, rollDice } from './game';
    import { balanceStore, betStore, pointStore, currentRollStore, fullRollStore, pastRollsStore, passWagerStore, dontPassWagerStore, comeWagerStore, dontComeWagerStore } from './stores';
    // Set up the game
  
    // Place a bet
    function handleBet(event: Event) {
      const target = event.target as HTMLButtonElement;
      const betType = target.value;
  
      if ($balanceStore < $betStore) {
        alert('Insufficient funds');
        return;
      }
  
      $balanceStore -= $betStore;
      placeBet(betType, $betStore);
    }
  
    // Roll the dice
    function handleRoll() {
      // Roll the dice and update the game state
    }

    function validate(event: Event) {
      const target = event.target as HTMLInputElement | null;
      if (target) {
        //Check length and allow only positive numbers
        if (target.value.length > 0) {
          const regex = /^[0-9]*$/;
          if (regex.test(target.value)) {
            betStore.set(parseInt(target.value));
          }
        }
        
      }
    }
    
  </script>
  
  <!-- Display the current roll -->
  <div>{$fullRollStore}</div>
  {#if $pointStore > 1}
  <div>Point is {$pointStore}.</div>
  {:else}
  <div>Point is off.</div>
  {/if}

  
  <!-- Display the past rolls -->
  <ul>
    {#each $pastRollsStore as roll}
      <li>{roll}</li>
    {/each}
  </ul>
  
  <input id="betAmt" type="number" minLength="1" on:input={event => validate(event)} />
  <!-- Display the current bet amount -->
  <div>Bet amount: {$betStore}</div>

  <!-- Display the player balance -->
  <div>Balance: {$balanceStore}</div>
  
  <!-- Create buttons for placing bets -->
  <button class="buttony" value="pass" data-amount={$betStore} on:click={handleBet}>Pass Line</button> <span>Current bet: {$passWagerStore}</span>
  <button class="buttony" value="dontPass" data-amount={$betStore} on:click={handleBet}>Don't Pass Line</button> <span>Current bet: {$dontPassWagerStore}</span>
  <button class="buttony" value="come" data-amount={$betStore} on:click={handleBet}>Come</button> <span>Current bet: {$comeWagerStore}</span>
  <button class="buttony" value="dontCome" data-amount={$betStore} on:click={handleBet}>Don't Come</button> <span>Current bet: {$dontComeWagerStore}</span>
  
  <!-- Create a button for rolling the dice -->
  <button on:click={rollDice}>Roll Dice</button>
  
  <style>
    button {
      height: 25px;
      width: 150px;
    }
    input {
      width: 100px;
    }
  </style>


