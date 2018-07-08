//Mutation function to be passed to the neural network
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Player {
  constructor(brain) {
    this.i = Math.floor(rows / 2)
    this.j = cols - 1
    this.x = this.i * w
    this.y = this.j * w
    this.dir = undefined
    this.lives = Infinity
    this.score = 0
    this.fitness = 0
    this.brain = brain
  }

  show() {
    fill(255, 0, 0)
    ellipse(this.x + w / 2, this.y + w / 2, w - 5)
  }

  collision(ghost) {
    if (ghost.i === this.i && ghost.j === this.j && ghost.mode !== 'SCARED') {
      resetGame() // Each time a pacman loses you should reset everything 
      pop_size--
      if (pop_size < 1) {
        getBestScore(players)
        nextGeneration()
      }
      this.lives--
      getNewPlayer()
      if (this.lives < 1) {
        noLoop()
      }
    }
  }

  resetPlayer() {
    this.i = Math.floor(rows / 2)
    this.j = cols - 1
    this.x = this.i * w;
    this.y = this.j * w;
  }

  moveUp() {
    this.dir = 'UP'
    // console.log(this.dir)
    if (this.j > 0 && !grid[this.i][this.j - 1].isWall) {
      this.j--
        this.y -= w
    }
  }

  moveDown() {
    this.dir = 'DOWN'
    // console.log(this.dir)
    if (this.j < cols - 1 && !grid[this.i][this.j + 1].isWall) {
      this.j++
        this.y += w
    }
  }

  moveLeft() {
    this.dir = 'LEFT'
    // console.log(this.dir)
    if (this.i > 0 && !grid[this.i - 1][this.j].isWall) {
      this.i--
        this.x -= w
    }
  }

  moveRight() {
    this.dir = 'RIGHT'
    // console.log(this.dir)
    if (this.i < rows - 1 && !grid[this.i + 1][this.j].isWall) {
      this.i++
        this.x += w
    }
  }

  

  copy(){
    return new Player(this.brain)
  }

}