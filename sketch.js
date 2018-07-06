const TOTAL = 100 // Amount of pacmen
let pop_size = TOTAL
const WIDTH = 600 //width of canvas
const cols = 21
const rows = 21
const w = WIDTH / cols //width of each cell (w is also height)
let grid = new Array(rows).fill().map(val => Array(cols))
let numCoins = 0

let players = new Array(TOTAL)
for(let i = 0; i < TOTAL; i++){
	//Making a brain
	let pacman_brain = new NeuralNetwork(4, 2, 4)
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


//Inputs
let distances = new Array(4)
let diagonalDistance

//Resets the entire board to its original shape.
//And sends the ghosts back to their places
function resetGame() {
	//Refill all the non wall cells.
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (!grid[i][j].isWall && !grid[i][j].hasCoin) {
				grid[i][j].hasCoin = true
			}
		}
	}
	//Reset Player Score
	p.score = 0
	//Reset Player Location
	p.resetPlayer()
	resetGhosts()
}

function getNewPlayer(){
	p = players[++counter]
}

function resetGhosts() {
	ghosts.map(ghost => ghost.resetGhost())
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
	for(let i = 0; i < rows; i++){
		numCoins += grid[i].filter( a => !a.isWall).length
	}
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
	//Distance changes every single frame. Dividing by the diagonal distance to normalize values
	distances[0] = dist(p.x, p.y, ghosts[1].x, ghosts[1].y) / diagonalDistance
	distances[1] = dist(p.x, p.y, ghosts[0].x, ghosts[0].y) / diagonalDistance
	distances[2] = dist(p.x, p.y, ghosts[3].x, ghosts[3].y) / diagonalDistance
	distances[3] = dist(p.x, p.y, ghosts[2].x, ghosts[2].y) / diagonalDistance

	background(0)

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j].show()
		}
	}

	p.show()

	for (let i = 0; i < ghosts.length; i++) {
		ghosts[i].show()
		ghosts[i].collision(p)
	}

	if (frameCount % 30 === 0) {
		for (let i = 0; i < ghosts.length; i++) {
			ghosts[i].findPath(grid, p)
			resetValues()
		}
	}

	//Initializing the ghosts speeds
	if (frameCount % 15 === 0) {
		ghosts[0].move()
		p.collision(ghosts[0])
	}

	if (frameCount % 15 === 0) {
		ghosts[1].move()
		p.collision(ghosts[1])
	}

	if (frameCount % 15 === 0) {
		ghosts[3].move()
		p.collision(ghosts[3])
	}

	if (frameCount % 15 === 0) {
		ghosts[2].move()
		p.collision(ghosts[2])
	}


	//The Players speed. 6 moves per second
	//In the future you will not need to move the player manually
	if (frameCount % 15 === 0) {
		//Predict the next move.
		let result = p.brain.predict(distances)
		//Find the biggest value
		let index = 0
		for (let i = 1; i < result.length; i++) {
			if (result[index] < result[i]) {
				index = i
			}
		}
		// console.log(index)
		//Move accordingly
		if (index === 0) {
			// console.log("moving up")
			p.moveUp()
		} else if (index === 1) {
			// console.log("moving right")
			p.moveRight()
		} else if (index === 2) {
			// console.log("moving down")
			p.moveDown()
		} else if (index === 3) {
			// console.log("moving left")
			p.moveLeft()
		}

		//Code to be deprecated. At the end of the process
		// if (!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
		// 	if (keyIsDown(UP_ARROW)) {
		// 		p.dir = 'UP'
		// 		if (p.j > 0 && !grid[p.i][p.j - 1].isWall) {
		// 			p.j--
		// 				p.y -= w
		// 		}
		// 	}
		// 	if (keyIsDown(DOWN_ARROW)) {
		// 		p.dir = 'DOWN'
		// 		if (p.j < cols - 1 && !grid[p.i][p.j + 1].isWall) {
		// 			p.j++
		// 				p.y += w
		// 		}
		// 	}
		// }

		// if (keyIsDown(LEFT_ARROW)) {
		// 	p.dir = 'LEFT'
		// 	if (p.i > 0 && !grid[p.i - 1][p.j].isWall) {
		// 		p.i--
		// 			p.x -= w
		// 	}
		// }
		// if (keyIsDown(RIGHT_ARROW)) {
		// 	p.dir = 'RIGHT'
		// 	if (p.i < rows - 1 && !grid[p.i + 1][p.j].isWall) {
		// 		p.i++
		// 			p.x += w
		// 	}
		// }

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
	}

	document.querySelector('#stats > #score').innerHTML = p.score
	document.querySelector('#stats > #lives').innerHTML = p.lives
	document.querySelector('#stats > #fitness').innerHTML = p.fitness
	document.querySelector('#stats > #population').innerHTML = pop_size
	document.querySelector('#stats > #distances #d_to_blue').innerHTML = distances[0]
	document.querySelector('#stats > #distances #d_to_pink').innerHTML = distances[1]
	document.querySelector('#stats > #distances #d_to_grey').innerHTML = distances[2]
	document.querySelector('#stats > #distances #d_to_green').innerHTML = distances[3]
}