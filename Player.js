class Player {
    constructor() {
        this.i = Math.floor(rows / 2)
        this.j = cols - 1
        this.x = this.i * w;
        this.y = this.j * w;
        this.dir = undefined
        this.lives = 3
        this.score = 0
    }

    show() {
        fill(255, 0, 0)
        ellipse(this.x + w / 2, this.y + w / 2, w - 5)
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