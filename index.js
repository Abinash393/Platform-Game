const allMap = []
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
const scale = 20

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
allMap.push(map1)

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
allMap.push(map2)

const map3 = `
...................
.#################.
.#.................
.#.................
.#@................
.####.........####.
.####OOOOOOOOO####.`
allMap.push(map3)

// create level
class Map {
	// takes index of allMap
	constructor(level) {
		// validating input
		if (!allMap[level]) return false

		// breaking into rows and breaking row into each character
		const rows = []
		allMap[level]
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
	this.actorLayer = drawActors(state.actor)
	this.dom.appendChild(this.actorLayer)
	this.dom.className = `game ${state.status}`
	this.scrollPlayerIntoView(state)
}

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
	let width = this.dom.clientWidth
	let height = this.dom.clientHeight
	let margin = width / 3
	// The viewport
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
