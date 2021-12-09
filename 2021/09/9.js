const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const stringify = (x,y) => `${x},${y}`
const destringify = (s) => s.split(',').map(v => parseInt(v, 10))

const drawMap = (posMap, width, height, lowKeys) => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    container.style.gridTemplateColumns = `repeat(${width}, 1em)`
    container.style.gridTemplateRows = `repeat(${height}, 1em)`

    Object.keys(posMap).forEach((s) => {
        const [x, y] = destringify(s)
        const v = posMap[s]

        const cell = document.createElement('div')
        cell.innerText = v
        cell.style.gridRow = y+1
        cell.style.gridColumn = x+1
        cell.style.color = lowKeys.includes(s) ? 'green' : 'white'
        container.append(cell)
    })

    return container
}

const evaluatePoints = (points, width, height) => {
    const minima = []
    Object.keys(points).forEach((s) => {
        const [x, y] = destringify(s)
        const v = points[s]

        const checkRange = []
        const addCheck = (a, b) => checkRange.push(stringify(a,b))
        if (x > 0)          addCheck(x-1, y)
        if (x < width-1)    addCheck(x+1, y)
        if (y > 0)          addCheck(x, y-1)
        if (y < height-1)   addCheck(x, y+1)

        const values = checkRange.map(key => points[key])
        if (Math.min(...values) > v) minima.push([v, s])
    })
    return minima
}

solveBtn.onclick = () => {
    const floorMap = puzzleInput.value.trim().split('\n').map(w => w.split('').map(x => parseInt(x, 10)))

    const height = floorMap.length
    const width = floorMap[0].length

    const positionMap = {}

    floorMap.forEach((v, i) => v.forEach((w, j) => positionMap[stringify(j,i)] = w))

    const lowData = evaluatePoints(positionMap, width, height)
    const points = lowData.map(([v, _s]) => v)
    const score = points.map(v => v+1).reduce((acc, cur) => acc+cur)
    solution.innerText = `Low Point Score: ${score}`

    // Visualise for debugging
    emptyNode(visual)
    visual.append(drawMap(positionMap, width, height, lowData.map(([_v, s]) => s)))
}