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

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

const drawMap = (posMap, width, height, lowKeys, basins) => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    container.style.gridTemplateColumns = `repeat(${width}, 1em)`
    container.style.gridTemplateRows = `repeat(${height}, 1em)`

    const calculateColour = (s, v) => {
        if (lowKeys.includes(s)) return 'red'
        if (basins.has(s)) {
            return `hsl(${36 * v}, 100%, 50%)`
        }
        return 'white'
    }
    Object.keys(posMap).forEach((s) => {
        const [x, y] = destringify(s)
        const v = posMap[s]

        const cell = document.createElement('div')
        cell.innerText = v
        cell.style.gridRow = y+1
        cell.style.gridColumn = x+1
        cell.style.color = calculateColour(s, v)
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

const findBasins = (points, width, height, lowPoints) => {
    const basins = []
    lowPoints.forEach(s => {
        const seen = new Set()

        const nodes = [s]

        const check = (x, y, v) => {
            const pv = points[stringify(x,y)]
            return x >= 0 && x < width &&
                y >= 0 && y < height &&
                pv !== 9 && pv > v
        }

        while (nodes.length > 0) {
            const cur = nodes.pop()
            // if (seen.has(cur)) continue
            seen.add(cur)
            const v = points[cur]
            const [x, y] = destringify(cur)
            const asn = (x, y) => nodes.push(stringify(x, y))
            if (check(x+1, y, v)) asn(x+1, y)
            if (check(x-1, y, v)) asn(x-1, y)
            if (check(x, y+1, v)) asn(x, y+1)
            if (check(x, y-1, v)) asn(x, y-1)
        }

        basins.push(seen)
    })
    return basins
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

    const lowPositions = lowData.map(([_v, s]) => s)
    const basins = findBasins(positionMap, width, height, lowPositions)

    const sizes = basins.map(s => s.size).sort((a,b) => (a-b)).reverse()
    const [first, second, third] = sizes
    const finalScore = first * second * third

    solution.innerText += `\nFinal Basin Score: ${finalScore}`

    // Visualise for debugging
    emptyNode(visual)
    const allBasins = basins.reduce((acc, cur) => union(acc,cur))
    visual.append(drawMap(positionMap, width, height, lowPositions, allBasins))
}