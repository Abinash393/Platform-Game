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
        allMap[level].split("\n").forEach( (e) => {
            rows.push([...e])
        });

        this.height = rows.length
        this.weight = rows[0].length

        // 
        this.rows = rows.map( (r, i) => {
            arr = []

        })
    }
}
