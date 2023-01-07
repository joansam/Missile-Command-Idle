import {writable,} from "svelte/store"
export const mousePositionStore = writable([0,0])
export const launcherPositionStore = writable([0,0])
export const launcherDirection = writable(0)
export const missilePositionStore = writable([0,0])
export const paused = writable(false)
export const gameSpeed = writable(1)