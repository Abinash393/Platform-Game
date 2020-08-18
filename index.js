const allMap = []
const mapItems = {}

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

allMap.push(map1.trim())

// create level
class Map {
	// takes index of allMap
	constructor(level) {
		// checking input
		if (typeof level != "number") {
			return false
		}
		if (allMap[level] == undefined) {
			return false
		}

		// breaking into rows and breaking row into each character
		const rows = []
		allMap[level].split("\n").forEach((e) => {
			rows.push([...e])
		})

		this.height = rows.length
		this.weight = rows[0].length

		//
		this.rows = rows.map((r, i) => {
			arr = []
		})
	}
}

let currentIndex = 1
let i = 0

do {
	i++
	const previousRoad = road[i - 1][0]
	const roadA = roadSystem[currentIndex][0]
	const roadB = roadSystem[currentIndex][1]
	const roadC = roadSystem[currentIndex][2]
	const previousC = roadSystem[currentIndex - 1][2]

	if (previousRoad == C) {
		console.log(C)
		if (roadA > roadB) {
			road.push([B, roadB])
		} else {
			road.push(A, roadA)
		}
		continue
	}

	if (previousRoad == A) {
		if (roadA > previousC) {
			road.push([C, previousC])
		} else {
			road.push([A, roadA])
		}
		currentIndex++
		continue
	}

	if (roadB > previousC) {
		road.push([C, previousC])
	} else {
		road.push([B, roadB])
	}
	currentIndex++
} while (roadSystem[i][2] !== 0)
