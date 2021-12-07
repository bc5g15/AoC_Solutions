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

const makeCanvas = (width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
}

const drawPoints = (canvas, points, colour) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = colour
    
    points.forEach(([x,y]) => {
        ctx.fillRect(x,y,1,1)
    })
}

const drawGuideline = (canvas, x, colour) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = colour
    ctx.fillRect(x, 0, 1, canvas.width)
}

const positionCost = (x, positions) => positions.map(v => Math.abs(v-x)).reduce((acc, cur) => acc+cur, 0)

const newFuelCost = (move) => move*(move+1)/2

const newPositionCost = (x, positions) => positions.map(v => newFuelCost(Math.abs(v-x))).reduce((acc, cur) => acc+cur, 0)

solveBtn.onclick = () => {
    // Separate this out for the visualisation
    const originalPositions = puzzleInput.value.trim().split(',').map(v => parseInt(v, 10))
    const positions = Array(...originalPositions).sort((a,b) => (a-b))

    const minPos = positions[0]
    const maxPos = positions[positions.length-1]

    const pwCost = positions.map(v => [v, positionCost(v, positions)]).sort(([_,a], [__,b]) => (a - b))

    solution.innerText = `Position: ${pwCost[0][0]} Cost: ${pwCost[0][1]}`

    const part2Range = Array(maxPos+minPos).fill(0).map((_,i) => i+minPos)

    const npwCost = part2Range.map(v => [v, newPositionCost(v, positions)]).sort(([_,a], [__,b]) => (a-b))

    solution.innerText += `\nPosition: ${npwCost[0][0]} Cost: ${npwCost[0][1]}`

    // Visualise
    emptyNode(visual)
    const c = makeCanvas(maxPos-minPos, originalPositions.length)
    const posPoints = originalPositions.map((v,i) => [v,i])
    const sortedPoints = positions.map((v,i) => [v,i])
    visual.append(c)
    drawPoints(c, posPoints, 'orange')
    drawPoints(c, sortedPoints, 'purple')
    drawGuideline(c, pwCost[0][0], 'red')
    drawGuideline(c, npwCost[0][0], 'green')

}