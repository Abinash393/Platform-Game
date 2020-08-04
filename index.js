const allMap = []
const mapItems = {
    ".": "empty",
    "#": "wall",
    "+": "lava"
};

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

// create level
class Map {
    // takes index of allMap
    constructor(level) {
        // validating input
        if (!allMap[level]) return false

        // breaking into rows and breaking row into each character
        const rows = []
        allMap[level].trim().split("\n").forEach((e) => {
            rows.push([...e])
        });

        this.height = rows.length
        this.weight = rows[0].length

        this.rows = rows.map((row, i) => {
            return row.map((char, j) => {
                const type = mapItems[char];
                // static
                if (typeof type == "string") return type;
                // create moving parts aka actors (player, lava, coin) 
                this.startActors.push(
                type.create(new Vec(j, i), char))
                return "empty"
            });
        });
    }
}

//
class Vec {
    constructor() {

    }
}
