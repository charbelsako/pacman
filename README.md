# Pacman GAME AI

> Disclaimer i did not make any of the files in the `lib/` folder.

This game was primarily made just to work with the a* pathfinding algorithms and not to actually make a game.

## What's missing from this game

You can't kill ghosts.
You can't stack blue coins.
A good programmer
Good visual design

## What i don't like about this project

Because i made the user move along a grid. I can't add animations.
The core algorithm for the Ghosts requires the grid so i can't let the library move with an animation.
Which can still work if you program it right.

* Currently how the game is programmed you can only have one player on the screen

* The player moves along a grid instead of the animation that you would usually see in games

* The pacman dies when any of the ghosts have no more items in their `path` array. This proved to be a problem. Instead you could just use the `collisison` function.

## Neuro evolution update

Added neuro evolution to the game. It's not the best impelementation but it's working. Sort of.
