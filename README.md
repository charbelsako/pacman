# Pacman GAME AI

> Disclaimer i did not make any of the files in the lib/ folder.

This game was primarily made just to work with algorithms and not to actually make a game.

* A* pathfinding algorithm

You can find information on it on wikipedia.

## What's missing from this game

Hopefully by the time people view this repository the game would be finished.

**The map will be added at the end.**

## What i don't like about this project

Because i made the user move along a grid. I can't add animations.
The core algorithm for the Ghosts requires the grid so i can't let the library move with an animation.
Which can still work if you program it right.

* Currently how the game is programmed you can only have one player on the screen

* The player moves along a grid instead of the animation that you would usually see in games

* The pacman dies when any of the ghosts have no more items in their `path` array. This proved to be a problem. Instead you could just use the `collisison` function.

## Possible updates

I really wish to add NeuroEvolution to this project. (WIP)

I have the basic setup done (in my head).
