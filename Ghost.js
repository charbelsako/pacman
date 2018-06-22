class Ghost{
    constructor(type){
        this.mode = 'IDLE'
        this.pathExists = false
        this.path = []
        this.type = type
        if(this.type === 'pink'){
            this.i = 0
            this.j = 0
        }else if(this.type === 'green'){
            this.i = 0
            this.j = cols - 1
        }else if(this.type === 'blue'){
            this.i = rows - 1
            this.j = 0
        }else if(this.type === 'grey'){
            this.i = rows - 1
            this.j = cols - 1
        }
        this.x = this.i * w
        this.y = this.j * w

    }

    static scared(){
        this.mode = 'SCARED'
        console.log(this.mode)
    }

    // Deprecated Function. 
    removeFromArray(arr, elt){
        for(let i = arr.length - 1; i >= 0; i--){
            if(arr[i] === elt){
                arr.splice(i, 1)
            }
        }
    }
    
    show(){
        if(this.type === 'grey'){
            fill(120)                        
        }else if(this.type === 'pink'){
            fill(255,0,255)
        }else if(this.type === 'green'){
            fill(0,255,0)            
        }else if(this.type === 'blue'){
            fill(0,0,255)            
        }
        ellipse(this.x + w/2, this.y + w/2, w - 5)
    }

    heuristic(a, b){
        let d = abs(a.i - b.i) + abs(a.j - b.j)
        return d
    }

    findPath(grid, player){
        this.path = []
        let closedSet = []
        let openSet = []       
        let start = grid[this.i][this.j]
        let end = grid[player.i][player.j]
        
        openSet.push(start)

        while(openSet.length > 0){
            let index = 0
            for(let i = 0; i < openSet.length; i++){
                if(openSet[i].f < openSet[index].f){
                    index = i
                }
            }
            let current = openSet[index]
            if(current === end){
                // console.log('done')
                //we found the path now move along it.
                this.pathExists = true
                let temp = current
                this.path.push(temp)
                while(temp.previous){
                    this.path.push(temp.previous)
                    temp = temp.previous
                }
                return
            }

            // this.removeFromArray(openSet, current) // isn't it possible to just splice based on the index variable
            openSet.splice(index, 1)
            closedSet.push(current)

            let neighbors = current.neighbors
            for(let neighbor of neighbors){
                if(!closedSet.includes(neighbor) && !neighbor.isWall){
                    let tempG = current.g + 1
                    
                    if(openSet.includes(neighbor)){
                        if(tempG < neighbor.g){
                            neighbor.g = tempG
                        }
                    }else{
                        neighbor.g = tempG
                        openSet.push(neighbor)
                    }
            
                    neighbor.h = this.heuristic(neighbor, end)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.previous = current
                }
            
            }
        }
        this.pathExists = false // this isn't really needed unless you want to magically change where the walls are
        //no solution
        return
    }

    collision(p){
        if(p.x === this.x && p.y === this.y){
            console.log('death by collision')
            noLoop()
        }
    }

    move(){      
        if(this.path.length > 0){  
            let nextPos = this.path.pop()
            this.i = nextPos.i
            this.j = nextPos.j
            this.updateLoc()
        }else{
            if(this.pathExists){
                console.log('death by ghost reaching you')
                noLoop()
            }
        }
    }

    updateLoc(){
        this.x = this.i * w
        this.y = this.j * w
    }
    
}