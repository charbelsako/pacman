class Ghost {
    constructor(type) {
        this.mode = 'IDLE'
        this.pathExists = false
        this.path = []
        this.type = type
        this.canKill = true
        this.previousPath = [1]
        if (this.type === 'pink') {
            this.i = 0
            this.j = 0
        } else if (this.type === 'green') {
            this.i = 0
            this.j = cols - 1
        } else if (this.type === 'blue') {
            this.i = rows - 1
            this.j = 0
        } else if (this.type === 'grey') {
            this.i = rows - 1
            this.j = cols - 1
        }
        this.x = this.i * w
        this.y = this.j * w

    }


    resetGhost(){
        if (this.type === 'pink') {
            this.i = 0
            this.j = 0
        } else if (this.type === 'green') {
            this.i = 0
            this.j = cols - 1
        } else if (this.type === 'blue') {
            this.i = rows - 1
            this.j = 0
        } else if (this.type === 'grey') {
            this.i = rows - 1
            this.j = cols - 1
        }
    }

    scared() {
        this.mode = 'SCARED'
        setTimeout(() => {
            console.log("not scared")
            this.NotScared()
        }, 7000)
    }

    // Deprecated Function. 
    removeFromArray(arr, elt) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === elt) {
                arr.splice(i, 1)
            }
        }
    }

    show() {
        if (this.type === 'grey') {
            fill(120)
        } else if (this.type === 'pink') {
            fill(255, 0, 255)
        } else if (this.type === 'green') {
            fill(0, 255, 0)
        } else if (this.type === 'blue') {
            fill(0, 0, 255)
        }
        if (this.mode === 'SCARED') {
            stroke(0)
            fill(255)
        }
        ellipse(this.x + w / 2, this.y + w / 2, w - 5)
    }

    heuristic(a, b) {
        let d = abs(a.i - b.i) + abs(a.j - b.j)
        return d
    }

    findPath(grid, player) {
        this.path = []
        let closedSet = []
        let openSet = []
        let start = grid[this.i][this.j]
        let end;

        this.changeMode()
        //if the mode is IDLE i don't even need to find the path
        if (this.mode === 'IDLE') {
            return
        }

        if (this.mode === 'HUNTING') {
            //Each Ghost has his own logic
            
            end = grid[player.i][player.j] // HUNT the player
            this.canKill = true

            //The blue ghost targets 2 tiles in front of the player
            if (this.type === 'blue' && this.previousPath.length > 0) {
                this.canKill = false
                if (player.dir === 'UP') {
                    if (player.j >= 2) {
                        end = grid[player.i][player.j - 2]
                    }
                } else if (player.dir === 'LEFT') {
                    if (player.i >= 2) {
                        end = grid[player.i - 2][player.j]
                    }
                } else if (player.dir === 'RIGHT') {
                    if (player.i < rows - 3) {
                        end = grid[player.i + 2][player.j]
                    }
                } else if (player.dir === 'DOWN') {
                    if (player.j < cols - 3) {
                        end = grid[player.i][player.j + 2]
                    }
                }

            }

            //The grey ghost targets the area around the player. Sort of.
            if(this.type === 'grey'){
                if(player.dir === 'UP'){
                    if (player.i >= 2) {
                        end = grid[player.i - 2][player.j]
                    }
                }else if(player.dir === 'DOWN'){
                    if (player.i < rows - 3) {
                        end = grid[player.i + 2][player.j]
                    }
                }else if(player.dir === 'LEFT'){
                    if (player.j >= 2) {
                        end = grid[player.i][player.j - 2]
                    }
                }else if(player.dir === 'RIGHT'){
                    if (player.j < cols - 3) {
                        end = grid[player.i][player.j + 2]
                    }
                }
            }

            //The pink ghost is scared of the player
            if (this.type === 'pink' && this.pathExists && this.path.length < 4) {
                end = grid[0][cols - 1] // Go to your little corner
                this.canKill = false // This is necessary since when a ghost has no cells left in its path array that means they killed you
            }
            
        } else if (this.mode === 'SCARED') {
            //SCARED run away to random location on the grid.
            end = grid[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)]
        }

        openSet.push(start)

        while (openSet.length > 0) {
            let index = 0
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[index].f) {
                    index = i
                }
            }
            let current = openSet[index]
            if (current === end) {
                //we found the path now move along it.
                this.pathExists = true
                let temp = current
                this.path.push(temp)
                while (temp.previous) {
                    this.path.push(temp.previous)
                    temp = temp.previous
                }
                if(!this.canKill){
                    this.previousPath = this.path
                }
                return
            }

            // this.removeFromArray(openSet, current) 
            // isn't it possible to just splice based on the index variable.
            // EDIT: Turns out it is.
            openSet.splice(index, 1)
            closedSet.push(current)

            let neighbors = current.neighbors
            for (let neighbor of neighbors) {
                if (!closedSet.includes(neighbor) && !neighbor.isWall) {
                    let tempG = current.g + 1

                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG
                        }
                    } else {
                        neighbor.g = tempG
                        openSet.push(neighbor)
                    }

                    neighbor.h = this.heuristic(neighbor, end)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.previous = current
                }

            }
        }
        //no solution. 
        this.pathExists = false // this isn't really needed unless you want to magically change where the walls are
        return
    }

    collision(p) {
        if (this.mode !== 'SCARED' && p.x === this.x && p.y === this.y) {
            console.log('death by collision')
            p.lives--
            if (p.lives < 1) {
                noLoop()
            } else {
                p.resetPlayer()
            }
        }
    }

    move() {
        if (this.path.length > 0) {
            let nextPos = this.path.pop()
            this.i = nextPos.i
            this.j = nextPos.j
            this.updateLoc()
        } else {
            if (this.pathExists && this.mode === 'HUNTING' && this.canKill) {
                console.log('death by ghost reaching you')
                p.lives--
                if (p.lives < 1) {
                    console.log("Out of lives")
                    noLoop()
                } else {
                    p.resetPlayer()
                }
            }
        }
    }

    updateLoc() {
        this.x = this.i * w
        this.y = this.j * w
    }

    changeMode() {
        //When the game starts ghosts are IDLE for 2 seconds
        if (this.mode === 'IDLE' && frameCount > 120) {
            this.mode = 'HUNTING'
        }
    }

    NotScared(){
        this.mode = 'HUNTING'
    }

}