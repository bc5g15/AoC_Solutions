const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const stringify = (x, y) => `${x},${y}`
const destringify = (s) => s.split(',').map(i => parseInt(i, 10))

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

/** @param {[number, number][]} points */
const getCorners = (points) => {
    const xs = points.map(([x,_]) => x)
    const ys = points.map(([_,y]) => y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return {minX, minY, maxX, maxY}
}

const ventGrid = (ventMap) => {
    const coords = Object.keys(ventMap).map(destringify)
    const {minX, minY, maxX, maxY} = getCorners(coords)
    const width = maxX - minX
    const height = maxY - minY

    const grid = document.createElement('div')
    grid.style.display = 'grid'
    grid.style.gridAutoColumns = `repeat(${width}, 1em)`
    grid.style.gridTemplateRows = `repeat(${height}, 1em)`
    grid.style.width = `${width}em`
    grid.style.height = `${height}em`

    const colours = ['black', 'green', 'orange', 'red']

    coords.forEach(([x, y]) => {
        const count = ventMap[stringify(x,y)]
        const cell = document.createElement('div')
        cell.style.width = '1em'
        cell.style.height = '1em'
        cell.style.lineHeight = '1em'
        cell.style.textAlign = 'center'
        cell.style.border = '.1em solid white'
        cell.style.color = 'black'
        cell.style.backgroundColor = colours[Math.min(3, Math.max(0, count))]
        cell.innerText = count
        cell.style.gridColumn = x
        cell.style.gridRow = y
        grid.append(cell)
    })

    return grid
}

const getOrDefault = (obj, key, defaultValue) => obj[key] ?? defaultValue

const isDiagonal = ([x1,y1], [x2,y2]) => x1!==x2 && y1!==y2

const myRange = ([x1, y1], [x2, y2])  => {
    const xsign = Math.sign(x2 - x1)
    const ysign = Math.sign(y2 - y1)

    const range = [[x1,y1]]

    let x = x1
    let y = y1

    while (x!==x2 || y!==y2) {
        x += xsign
        y += ysign
        range.push([x, y])
    }
    return range
}

solveBtn.onclick = () => {
    /** @type {string[]} bins */
    const points = puzzleInput.value.trim().split('\n').map(i => i.split(' -> ').map(j => j.split(',').map(k => parseInt(k, 10))))

    const hvlines = points.filter(([a, b]) => !isDiagonal(a, b))

    const ventMap = {}

    hvlines.forEach(([a, b]) => {
        myRange(a,b).forEach(([x,y]) => {
            const i = stringify(x,y)
            ventMap[i] = getOrDefault(ventMap, i, 0) + 1
        })
    })

    const part1 = Object.keys(ventMap).filter(k => ventMap[k] > 1).length

    const diagLines = points.filter(([a, b]) => isDiagonal(a, b))
    diagLines.forEach(([a, b]) => {
        myRange(a,b).forEach(([x, y]) => {
            const i = stringify(x,y)
            ventMap[i] = getOrDefault(ventMap, i, 0) + 1
        })
    })

    const part2 = Object.keys(ventMap).filter(k => ventMap[k] > 1).length

    solution.innerText = `${part1} ${part2}`

    // Visualisation
    emptyNode(visual)
    const grid = ventGrid(ventMap)
    visual.append(grid)
}