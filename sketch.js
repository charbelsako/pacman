const TOTAL = 500 // Amount of pacmen
let pop_size = TOTAL
const WIDTH = 600 //width of canvas
const cols = 17
const rows = 17
const w = WIDTH / cols //width of each cell (w is also height)
let grid = new Array(rows).fill().map(val => Array(cols))
let numCoins = 0

let bestScore = 0

let players = new Array(TOTAL)
for(let i = 0; i < TOTAL; i++){
	//Making a brain
	let pacman_brain = new NeuralNetwork(8, 16, 4)
	players[i] = new Player(pacman_brain)
}
let counter = 0 //each time a pacman dies increment this counter
let p = players[counter]

let ghosts = []
ghosts.push(new Ghost('pink')) 	//ghosts[0]
ghosts.push(new Ghost('blue')) 	//ghosts[1]
ghosts.push(new Ghost('green')) //ghosts[2]
ghosts.push(new Ghost('grey')) 	//ghosts[3]


let score
let generation = 0

//Inputs
let inputs = new Array(8)
let diagonalDistance

let gameSpeed

//Resets the entire board to its original shape.
//And sends the ghosts back to their places
function resetGame() {
	resetGhosts()
	ghosts[2].resetGreenGhost()
	for(let ghost of ghosts){
		ghost.mode = 'IDLE'
		setTimeout( () => {
			// console.log("something is going to happen")
			ghost.mode = 'HUNTING'	
		}, 500)
	}
	//Refill all the non wall cells. WAIT. This is wrong
	//Some Cells that shouldn't have coins are getting coins.
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (!grid[i][j].isWall && !grid[i][j].hasCoin) {
				if(grid[i][j].i > 5 && grid[i][j].i < 11 && grid[i][j].j > 7 && grid[i][j].j < 11){
					grid[i][j].hasCoin = false
				}else{
					grid[i][j].hasCoin = true
				}
				// The edges are special coins
				if( grid[i][j].i === rows - 1 && grid[i][j].j === cols - 1 || grid[i][j].i === 0 && grid[i][j].j === 0 
					|| grid[i][j].i === rows - 1 && grid[i][j].j === 0 || grid[i][j].i === 0 && grid[i][j].j === cols - 1 ){
						grid[i][j].special = true
				}
			}
		}
	}
	//Reset Player Location
	p.resetPlayer()
	
}

function getBestScore(players){
	let max = players[0].score
	for(let i = 1; i < players.length; i++){
		if (players[i].score > max){
			max = players[i].score
		}
	}
	if(max > bestScore){
		bestScore = max
	}
}

function getNewPlayer(){
	if(counter < players.length - 1 ){
		p = players[++counter]
	}else{
		//population size exceeded get the new generation
		nextGeneration()
	}
}



function resetGhosts() {
	// console.log('resetting ghosts')
	for(let i = 0; i < ghosts.length; i++){
		ghosts[i].resetGhost()
	}
	// ghosts[2].resetGhost()
}

//Resets the values of a grid that are going to be manipulated for the algorithm.
function resetValues() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j].f = 0
			grid[i][j].g = 0
			grid[i][j].h = 0
			grid[i][j].previous = undefined
		}
	}
}

function setup() {
	createCanvas(WIDTH, WIDTH)
	gameSpeed = createSlider(1,200, 1 , 10)
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = new Cell(i, j)
		}
	}
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j].getNeighbors(grid)
		}
	}

	for (let i = 0; i < ghosts.length; i++) {
		ghosts[i].findPath(grid, p)
		resetValues()
	}
	diagonalDistance = dist(0,0,width,height)

	//Number of coins
	// for(let i = 0; i < rows; i++){
	// 	numCoins += grid[i].filter( a => !a.isWall).length
	// }
	// console.log(`max number of coins is ${numCoins}`)
}



function hasPoints() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (grid[i][j].hasCoin) {
				return true
			}
		}
	}
	return false
}

function draw() {
	//All the logic
	for(let i = 0; i < gameSpeed.value(); i++){
		//Distance changes every single frame. Dividing by the diagonal distance to normalize values
		inputs[0] = dist(p.x, p.y, ghosts[1].x, ghosts[1].y) / diagonalDistance
		inputs[1] = dist(p.x, p.y, ghosts[0].x, ghosts[0].y) / diagonalDistance
		inputs[2] = dist(p.x, p.y, ghosts[3].x, ghosts[3].y) / diagonalDistance
		inputs[3] = dist(p.x, p.y, ghosts[2].x, ghosts[2].y) / diagonalDistance
		//Edge conditions Yet again
		inputs[4] = (p.j > 0)? Number(grid[p.i][p.j - 1].isWall) : 1 // Tile above
		inputs[5] = (p.j < cols - 1)? Number(grid[p.i][p.j + 1].isWall) : 1// Tile below
		inputs[6] = (p.i < rows - 1)? Number(grid[p.i + 1][p.j].isWall) : 1  // Tile right
		inputs[7] = (p.i > 0)? Number(grid[p.i - 1][p.j].isWall) : 1 // Tile left 

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				grid[i][j].coinPicked()
			}
		}

		// for (let i = 0; i < ghosts.length; i++) {
		// 	ghosts[i].collision(p)
		// }

		if (frameCount % 30 === 0) {
			for (let i = 0; i < ghosts.length; i++) {
				ghosts[i].findPath(grid, p)
				resetValues()
			}
		}

		// on frame #20 this will run quite a few times
		//Initializing the ghosts speeds
		if (frameCount % 10 === 0) {
			ghosts[0].move()
			p.collision(ghosts[0])
		}

		if (frameCount % 15 === 0) {
			ghosts[1].move()
			p.collision(ghosts[1])
		}

		if (frameCount % 10 === 0) {
			ghosts[3].move()
			p.collision(ghosts[3])
		}

		if (frameCount % 20 === 0) {
			ghosts[2].move()
			p.collision(ghosts[2])
		}


		//The Players speed. 6 moves per second
		//In the future you will not need to move the player manually
		if (frameCount % 8 === 0) {
		
			//Predict the next move.
			let result = p.brain.predict(inputs)
			//Find the biggest value
			let index = 0
			for (let i = 1; i < result.length; i++) {
				if (result[index] < result[i]) {
					index = i
				}
			}
			//Move accordingly
			if (index === 0) {
				p.moveUp()
			} else if (index === 1) {
				p.moveRight()
			} else if (index === 2) {
				p.moveDown()
			} else if (index === 3) {
				p.moveLeft()
			}

			if (p.i < 0) {
				p.i = 0
				p.x += w
			}
			if (p.j < 0) {
				p.j = 0
				p.y += w
			}
			if (p.i > rows - 1) {
				p.i = rows - 1
				p.x -= w
			}
			if (p.j > cols - 1) {
				p.j = cols - 1
				p.y -= w
			}

			p.collision(ghosts[0])
			p.collision(ghosts[1])
			p.collision(ghosts[2])
			p.collision(ghosts[3])

		}
		
	}
	p.score++
	//All the drawing
	background(0)

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j].show()
		}
	}

	for (let i = 0; i < ghosts.length; i++) {
		ghosts[i].show()
	}

	p.show()

	document.querySelector('#stats > #best').innerHTML = bestScore
	document.querySelector('#stats > #generation').innerHTML = generation
	document.querySelector('#stats > #score').innerHTML = p.score
	document.querySelector('#stats > span#lives').innerHTML = p.lives
	// document.querySelector('#stats > #fitness').innerHTML = p.fitness
	document.querySelector('#stats > #population').innerHTML = pop_size
	document.querySelector('#stats > #distances #d_to_blue').innerHTML = inputs[0]
	document.querySelector('#stats > #distances #d_to_pink').innerHTML = inputs[1]
	document.querySelector('#stats > #distances #d_to_grey').innerHTML = inputs[2]
	document.querySelector('#stats > #distances #d_to_green').innerHTML = inputs[3]

	document.querySelector('#stats > #distances #ta').innerHTML = inputs[4]
	document.querySelector('#stats > #distances #tb').innerHTML = inputs[5]
	document.querySelector('#stats > #distances #tr').innerHTML = inputs[6]
	document.querySelector('#stats > #distances #tl').innerHTML = inputs[7]

}