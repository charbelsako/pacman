class Cell{
    constructor(i,j){
        /* for the pathfinding algorithm */
        this.f = 0
        this.g = 0
        this.h = 0
        this.previous = undefined

        this.w = w
        this.x = i * w
        this.y = j * w
        this.i = i
        this.j = j
        this.neighbors = []
        this.isWall = (random(1) > 0.8);
        this.hasCoin = (!this.isWall)? true : false
        if( this.i === rows - 1 && this.j === cols - 1 || this.i === 0 && this.j === 0 
            || this.i === rows - 1 && this.j === 0 || this.i === 0 && this.j === cols - 1 
            || this.i === Math.floor(rows / 2) && this.j === cols - 1){

            this.hasCoin = false
            this.isWall = false
        }
    }

    show(col){
        if(p.i === this.i && p.j === this.j){
            this.hasCoin = false
            if(!hasPoints()){
                console.log('you win')
                noLoop()
            }
        }
        if(this.isWall){
            fill(0)
        }else{
            fill(255)
        }
        if(typeof col !== 'undefined'){
            fill(col)
        }
        stroke(0)
        rect(this.x, this.y, w - 1, w - 1)
        if(this.hasCoin){
            fill(255,255,0)
            ellipse(this.x + w/2, this.y + w/2, w/3);
        }
    }

    getNeighbors(grid){
        const i = this.i
        const j = this.j
        if( i > 0){
            this.neighbors.push(grid[i-1][j])
        }
        if( i < rows - 1 ){
            this.neighbors.push(grid[i+1][j])
        }
        if( j > 0 ){
            this.neighbors.push(grid[i][j-1])
        }
        if( j < cols - 1 ){
            this.neighbors.push(grid[i][j+1])
        }
    }

}