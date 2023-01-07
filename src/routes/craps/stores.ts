import {writable,} from "svelte/store"

export const balanceStore = writable(100)
export const betStore = writable(1)
export const pointStore = writable(-1)
export const currentRollStore = writable(-1)
export const passWagerStore = writable(0)
export const dontPassWagerStore = writable(0)
export const comeWagerStore = writable(0)
export const dontComeWagerStore = writable(0)

const dieTuple:[number,number][] = []
export const pastRollsStore = writable(dieTuple)

export const fullRollStore = writable("Waiting for comeout roll.")