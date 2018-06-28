class Player {
    constructor(){
        this.i = Math.floor(rows / 2)
        this.j = cols - 1
        this.x = this.i * w;
        this.y = this.j * w;
        this.dir = undefined
        this.lives = 3
        this.score = 0
    }

    show(){
        fill(255,0,0)
        ellipse(this.x + w/2, this.y + w/2, w - 5)
    }

    resetPlayer(){
        this.i = Math.floor(rows / 2)
        this.j = cols - 1
        this.x = this.i * w;
        this.y = this.j * w;
    }

}