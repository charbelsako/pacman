const WIDTH = 400 //width of canvas
const cols = 15
const rows = 15
const w = WIDTH / cols //width of each cell (w is also height)
let grid = new Array(rows).fill().map(val => Array(cols))
// let coins = [];
let p = new Player();

let ghosts = []
ghosts.push(new Ghost('pink'))
ghosts.push(new Ghost('blue'))
ghosts.push(new Ghost('green'))
ghosts.push(new Ghost('grey'))

function resetValues(){
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			grid[i][j].f = 0
			grid[i][j].g = 0
			grid[i][j].h = 0
			grid[i][j].previous = undefined

		}
	}
}

function setup() {
	createCanvas(WIDTH, WIDTH)
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			grid[i][j] = new Cell(i,j)
		}
	}
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			grid[i][j].getNeighbors(grid)
		}
	}
	
	for(let i = 0; i < ghosts.length; i++){
		ghosts[i].findPath(grid, p)
		resetValues()
	}

}

function keyPressed(){
	console.log(frameRate())
	if(keyCode === UP_ARROW){
		if(p.j > 0 && !grid[p.i][p.j - 1].isWall){
			p.j--
			p.y -= w
		}
	}
	if(keyCode === DOWN_ARROW){
		if(p.j < cols - 1 && !grid[p.i][p.j + 1].isWall){
			p.j++
			p.y += w
		}
	}
	if(keyCode === LEFT_ARROW){
		if(p.i > 0 && !grid[p.i - 1][p.j].isWall){
			p.i--
			p.x -= w
		}
	}
	if(keyCode === RIGHT_ARROW){
		if(p.i < rows - 1 && !grid[p.i + 1][p.j].isWall){
			p.i++
			p.x += w
		}
	}
	if(p.i < 0 ){
		p.i = 0
		p.x += w
	}
	if(p.j < 0){
		p.j = 0
		p.y += w
	}
	if(p.i > rows - 1){
		p.i = rows - 1
		p.x -= w		
	}
	if(p.j > cols - 1){
		p.j = cols - 1
		p.y -= w		
	}
}

function hasPoints(){
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			if(grid[i][j].hasCoin){
				return true
			}
		}
	}
	return false
}

function draw() {
	background(51);
		
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			grid[i][j].show();
		}
	}
	
	p.show(); 

	for(let i = 0; i < ghosts.length; i++){
		ghosts[i].show()		
		ghosts[i].collision(p)
	}	

	if(frameCount % 60 === 0){
		for(let i = 0; i < ghosts.length; i++){
			ghosts[i].findPath(grid, p)
			resetValues()
		}
	}

	if(frameCount % 30 === 0 && frameCount > 0){
		// These aren't in a loop because i actually want each one to have their own speed.
		ghosts[0].move()
		ghosts[1].move()
		ghosts[2].move()
		ghosts[3].move()
	}
	
	
}
