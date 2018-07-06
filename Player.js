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

    collision(ghost){
        if (ghost.i === this.i && ghost.j === this.j && ghost.mode !== 'SCARED') {
            this.calcFitness()
            // console.log(this.fitness)
            // console.log('death by collision (Player Function)')
            this.lives--
            getNewPlayer()
            pop_size--
            if (this.lives < 1) {
                noLoop()
            } else {
                this.resetPlayer()
            }
        }
    }

    calcFitness(){
        this.fitness = this.score / numCoins
    }

    resetPlayer() {
        this.i = Math.floor(rows / 2)
        this.j = cols - 1
        this.x = this.i * w;
        this.y = this.j * w;
    }

    moveUp() {
        this.dir = 'UP'
        if (this.j > 0 && !grid[this.i][this.j - 1].isWall) {
            this.j--
                this.y -= w
        }
    }

    moveDown() {
        this.dir = 'DOWN'
        if (this.j < cols - 1 && !grid[this.i][this.j + 1].isWall) {
            this.j++
            this.y += w
        }
    }

    moveLeft(){
        this.dir = 'LEFT'
        if (this.i > 0 && !grid[this.i - 1][this.j].isWall) {
            this.i--
            this.x -= w
        }
    }

    moveRight(){
        this.dir = 'RIGHT'
        if (this.i < rows - 1 && !grid[this.i + 1][this.j].isWall) {
            this.i++
            this.x += w
        }
    }

}