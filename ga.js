// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&


// This file includes functions for creating a new generation
// of birds.

// Start the game over
function resetGameGA() {
  counter = 0
  pop_size = TOTAL
}


// Create the next generation
function nextGeneration() {
  noLoop()
  generation++
  // console.log("Next Generation")
  resetGameGA()
  // Generate a new set of pacmen
  normalizeFitness(players)
  newPlayers = generate(players)
  // newPlayers = newPlayers.map(resetPlayerValues)
  // Copy those birds to another array
  players = newPlayers.slice()
  // console.log(players)
}

// function resetPlayerValues(player) {
//   player.fitness = 0
//   player.score = 0
//   return player
// }

// Generate a new population of birds
function generate(players) {

  let newPlayers = []
  for (let i = 0; i < TOTAL; i++) {
    // Select a bird based on fitness
    let player = poolSelection(players)
    player.brain.mutate(mutate)
    newPlayers[i] = player
  }
  return newPlayers
}

// Normalize the fitness of all birds
function normalizeFitness(players) {
  //All fitness values need to add up to one
  for (let p of players) {
    p.score = Math.pow(p.score, 2)
  }
  let sum = players.reduce((sum, val) => sum + val.score, 0)
  for (let p of players) {
    p.fitness = p.score / sum
  }

}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(players) {
  // Start at 0
  let index = 0

  // Pick a random number between 0 and 1
  let r = random(1)

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= players[index].fitness
    // And move on to the next
    index += 1
  }

  // Go back one
  index -= 1

  return players[index].copy() // This way i don't need to reset the values
}