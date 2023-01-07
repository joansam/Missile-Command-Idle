import { currentRollStore, fullRollStore, pointStore, pastRollsStore, balanceStore, passWagerStore, dontPassWagerStore, comeWagerStore, dontComeWagerStore } from "./stores";
import { get } from "svelte/store";

// Set up the game

export function placeBet(betType:string, amount:number) {

  
    switch (betType) {
      case 'pass':
        // Place a bet on the pass line and update the game state
        passWagerStore.update(w => w + amount)
        break;
      case 'dontPass':
        // Place a bet on the don't pass line and update the game state
        dontPassWagerStore.update(w => w + amount)
        break;
      case 'come':
        // Place a bet on the come line and update the game state
        comeWagerStore.update(w => w + amount)

        break;
      case 'dontCome':
        // Place a bet on the don't come line and update the game state
        dontComeWagerStore.update(w => w + amount)
        break;
    }
  }  

// Roll the dice and update the game state
export function rollDice():[number,number] {
  //Handle backend logic
  const die1 = Math.floor(Math.random() * 6) + 1
  const die2 =  + Math.floor(Math.random() * 6) + 1
  const total = die1 + die2
  fullRollStore.set("Current Roll: " + die1 + " + " + die2 + " = " + total)
  rollHandler(total, get(passWagerStore), get(dontPassWagerStore), get(comeWagerStore), get(dontComeWagerStore))

  //Handle  display updates
  currentRollStore.set(total)
  const pastRolls = get(pastRollsStore)
  const dieTuple:[number,number] = [die1, die2]
  pastRolls.unshift(dieTuple)
  pastRollsStore.update(rolls => rolls)
  return [die1,die2]
}

function rollHandler(currentRoll:number, passWager:number, dontPassWager:number, comeWager:number, dontComeWager:number) {
  //Check if it's the comeout roll:
  if (get(pointStore) === -1) {
    if (currentRoll === 7 || currentRoll === 11) {
      // Resolve pass line bets
      console.log("Pass line wins!")
      balanceStore.update(b => b + 2*passWager)
      pastRollsStore.set([])
    } else if (currentRoll === 2 || currentRoll === 3 || currentRoll === 12) {
      // Resolve don't pass line bets
      console.log("Don't pass line wins!")
      balanceStore.update(b => b + 2*dontPassWager)
      pastRollsStore.set([])
    }
    else {
      pointStore.set(currentRoll)
      console.log("Comeout roll, point is " + currentRoll + ".")
      comeWagerStore.set(passWager)
      dontComeWagerStore.set(dontPassWager)
    }
    
    passWagerStore.set(0)
    dontPassWagerStore.set(0)
  } //For non-comeout rolls:
  else {
    if (currentRoll === 7) {
      // Resolve all bets and reset the game
      pointStore.set(-1);
      fullRollStore.set("Round over on " + currentRoll + ". New comeout roll?")
      pastRollsStore.set([])
    } else if (currentRoll === get(pointStore)) {
      // Resolve come and don't come bets and reset the game
      pointStore.set(-1);
      pastRollsStore.set([])
    }
  }
}