const scale = 20
const playerXSpeed = 7
const gravity = 30
const jumpSpeed = 17

const map1 = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`

const map2 = `
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................`

const map3 = `
...................
.#################.
.#.................
.#.................
.#@................
.####.........####.
.####OOOOOOOOO####.`

// create level
class Level {
	// takes index of allMap
	constructor(level) {
		// breaking into rows and breaking row into each character
		const rows = []
		level
			.trim()
			.split("\n")
			.forEach((e) => {
				rows.push([...e])
			})

		this.startActors = []
		this.height = rows.length
		this.weight = rows[0].length

		this.rows = rows.map((row, y) => {
			return row.map((char, x) => {
				const type = mapItems[char]
				// static
				if (typeof type == "string") return type
				// create moving parts aka actors (player, lava, coin)
				this.startActors.push(type.create(new Vec(x, y), char))
				return "empty"
			})
		})
	}
}

// returns new 2D value of actor
class Vec {
	constructor(x, y) {
		Object.assign(this, { x, y })
	}
	// returns updated dimension of actor
	plus(other) {
		return new Vec(this.x + other.x, this.y + other.y)
	}
	// returns updated dimension of actor
	minus(other) {
		return new Vec(this.x + other.x, this.y + other.y)
	}

	times(factor) {
		return new Vec(this.x * factor, this.y * factor)
	}
}

// track status of running game
class State {
	constructor(level, actors, status) {
		Object.assign(this, { level, actors, status })
	}
	// new level
	static start(level) {
		return new State(level, level.startActors, "playing")
	}

	// returns the first actor type player
	get player() {
		return this.actors.find((a) => a.type == "player")
	}
}

//
class Player {
	constructor(pos, speed) {
		Object.assign(this, { pos, speed })
	}

	get type() {
		return player
	}

	static create(pos) {
		return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0))
	}
}
Player.prototype.size = new Vec(0.8, 1.5)

class Lava {
	constructor(pos, speed, reset) {
		Object.assign(this, { pos, speed, reset })
	}

	get type() {
		return "lava"
	}

	static create(pos, ch) {
		switch (ch) {
			case "=":
				return new Lava(pos, new Vec(2, 0))
			case "|":
				return new Lava(pos, new Vec(0, 2))
			case "v":
				return new Lava(pos, new Vec(0, 3))
		}
	}
}

class Coin {
	constructor(pos, basePos, wobble) {
		Object.assign(this, { pos, basePos, wobble })
	}

	get type() {
		return "coin"
	}

	static create(pos) {
		let basePos = pos.plus(new Vec(0.2, 0.1))
		return new Coin(basePos, basePos, Math.random() * Math.PI * 2)
	}
}
Coin.prototype.size = new Vec(0.6, 0.6)

// create element and its child elements
function elt(name, attrs, ...children) {
	let e = document.createElement(name)
	for (let a of Object.keys(attrs)) {
		e.setAttribute(a, attrs[a])
	}

	for (let child of children) {
		e.appendChild(child)
	}
	return e
}

//
class DOMDisplay {
	constructor(parent, level) {
		this.dom = elt("div", { class: "game" }, drawGrid(level))
		this.actorLayer = null
		parent.appendChild(this.dom)
	}
	clear() {
		this.dom.remove()
	}
}

// draw map by blocks
function drawGrid(level) {
	return elt(
		"table",
		{
			class: "background",
			style: `width: ${level.width * scale}px`,
		},
		...level.rows.map((row) =>
			elt(
				"tr",
				{ style: `height: ${scale}px` },
				...row.map((type) => elt("td", { class: type })),
			),
		),
	)
}

// render moving elements
function drawActors(actors) {
	return elt(
		"div",
		{},
		...actors.map((actor) => {
			let rect = elt("div", { class: `actor ${actor.type}` })
			rect.style.width = `${actor.size.x * scale}px`
			rect.style.height = `${actor.size.y * scale}px`
			rect.style.left = `${actor.pos.x * scale}px`
			rect.style.top = `${actor.pos.y * scale}px`
			return rect
		}),
	)
}
function drawActors(actors) {
	return elt(
		"div",
		{},
		...actors.map((actor) => {
			let rect = elt("div", { class: `actor ${actor.type}` })
			rect.style.width = `${actor.size.x * scale}px`
			rect.style.height = `${actor.size.y * scale}px`
			rect.style.left = `${actor.pos.x * scale}px`
			rect.style.top = `${actor.pos.y * scale}px`
			return rect
		}),
	)
}

DOMDisplay.prototype.syncState = function (state) {
	if (this.actorLayer) this.actorLayer.remove()
	this.actorLayer = drawActors(state.actors)
	this.dom.appendChild(this.actorLayer)
	this.dom.className = `game ${state.status}`
	this.scrollPlayerIntoView(state)
}

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
	let width = this.dom.clientWidth
	let height = this.dom.clientHeight
	let margin = width / 3 // The viewport
	let left = this.dom.scrollLeft,
		right = left + width
	let top = this.dom.scrollTop,
		bottom = top + height
	let player = state.player
	let center = player.pos.plus(player.size.times(0.5)).times(scale)
	if (center.x < left + margin) {
		this.dom.scrollLeft = center.x - margin
	} else if (center.x > right - margin) {
		this.dom.scrollLeft = center.x + margin - width
	}
	if (center.y < top + margin) {
		this.dom.scrollTop = center.y - margin
	} else if (center.y > bottom - margin) {
		this.dom.scrollTop = center.y + margin - height
	}
}

Level.prototype.touches = function (pos, size, type) {
	var xStart = Math.floor(pos.x)
	var xEnd = Math.ceil(pos.x + size.x)
	var yStart = Math.floor(pos.y)
	var yEnd = Math.ceil(pos.y + size.y)

	for (var y = yStart; y < yEnd; y++) {
		for (var x = xStart; x < xEnd; x++) {
			let isOutside =
				x < 0 || x >= this.width || y < 0 || y >= this.height
			let here = isOutside ? "wall" : this.rows[y][x]
			if (here == type) return true
		}
	}
	return false
}

State.prototype.update = function (time, keys) {
	let actors = this.actors.map((actor) => {
		actor.update(time, this, keys)
	})
	let newState = new State(this.level, actors, this.status)
	if (newState.status != newState.player) return newState

	let player = newState.player
	if (this.level.touches(player.pos, player.size, "Lava")) {
		return new State(this.level, actors, "lost")
	}

	for (let actors of actor) {
		if (actor != player && overlap(actor, player)) {
			newState = actor.collide(newState)
		}
	}

	return newState
}

function overlap(actor1, actor2) {
	return (
		actor1.pos.x + actor1.size.x > actor2.pos.x &&
		actor1.pos.x < actor2.pos.x + actor2.size.x &&
		actor1.pos.y + actor1.size.y > actor2.pos.y &&
		actor1.pos.y < actor2.pos.y + actor2.size.y
	)
}

Lava.prototype.collide = function (state) {
	return new State(state.level, state.actors, "lost")
}

Coin.prototype.collide = function (state) {
	let filtered = state.actors.filter((a) => a != this)
	let status = state.status
	if (!filtered.some((a) => a.type == "coin")) status = "won"
	return new State(state.level, filtered, status)
}

Lava.prototype.update = function (time, state) {
	let newPos = this.pos.plus(this.speed.times(time))
	if (!state.level.touches(newPos, this.size, "wall")) {
		return new Lava(newPos, this.speed, this.reset)
	} else if (this.reset) {
		return new Lava(this.reset, this.speed, this.reset)
	} else {
		return new Lava(this.pos, this.speed.times(-1))
	}
}

Player.prototype.update = function (time, state, keys) {
	let xSpeed = 0
	if (keys.ArrowLeft) xSpeed -= playerXSpeed
	if (keys.ArrowRight) xSpeed += playerXSpeed
	let pos = this.pos
	let movedX = pos.plus(new Vec(xSpeed * time, 0))
	if (!state.level.touches(movedX, this.size, "wall")) {
		278
		pos = movedX
	}
	let ySpeed = this.speed.y + time * gravity
	let movedY = pos.plus(new Vec(0, ySpeed * time))
	if (!state.level.touches(movedY, this.size, "wall")) {
		pos = movedY
	} else if (keys.ArrowUp && ySpeed > 0) {
		ySpeed = -jumpSpeed
	} else {
		ySpeed = 0
	}
	return new Player(pos, new Vec(xSpeed, ySpeed))
}

function trackKeys(keys) {
	let down = Object.create(null)
	function track(event) {
		if (keys.includes(event.key)) {
			down[event.key] = event.type == "keydown"
			event.preventDefault()
		}
	}
	window.addEventListener("keydown", track)
	window.addEventListener("keyup", track)
	return down
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"])

function runAnimation(frameFunc) {
	let lastTime = null
	function frame(time) {
		if (lastTime != null) {
			let timeStep = Math.min(time - lastTime, 100) / 1000
			if (frameFunc(timeStep) === false) return
		}
		lastTime = time
		requestAnimationFrame(frame)
	}
	requestAnimationFrame(frame)
}

function runLevel(level, Display) {
	let display = new Display(document.body, level)
	let state = State.start(level)
	let ending = 1
	return new Promise((resolve) => {
		runAnimation((time) => {
			state = state.update(time, arrowKeys)
			display.syncState(state)
			if (state.status == "playing") {
				return true
			} else if (ending > 0) {
				ending -= time
				return true
			} else {
				display.clear()
				resolve(state.status)
				return false
			}
		})
	})
}

async function runGame(plans, Display) {
	for (let level = 0; level < plans.length; ) {
		let status = await runLevel(new Level(plans[level]), Display)
		if (status == "won") level++
	}
	console.log("You've won!")
}

const mapItems = {
	".": "empty",
	"#": "wall",
	"+": "lava",
	"@": Player,
	o: Coin,
	"=": Lava,
	"|": Lava,
	v: Lava,
}
