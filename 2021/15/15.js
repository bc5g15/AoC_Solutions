const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const stringify = (x, y) => `${x},${y}`

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

/**
 * @param {[[number]]} maze 
 */
const displayMaze = (maze) => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    const height = maze.length
    const width = maze[0].length
    container.style.gridTemplateRows = `repeat(${height}, 1em)`
    container.style.gridTemplateColumns = `repeat(${width}, 1em)`

    const cells = maze.flatMap((arr, y) => arr.flatMap((v, x) => {
        const cell = document.createElement('div')
        cell.innerText = v
        cell.style.gridRow = y+1
        cell.style.gridColumn = x+1
        return cell
    }))
    container.append(...cells)
    return container
}

const checkAdjacent = (maze, x, y) => {
    const results = []
    if (x>0) results.push([x-1, y, maze[y][x-1]])
    if (x<maze[0].length-1) results.push([x+1, y, maze[y][x+1]])
    if (y>0) results.push([x, y-1, maze[y-1][x]])
    if (y<maze.length-1) results.push([x, y+1, maze[y+1][x]])

    return results
}

const findPath = (maze, targetX, targetY) => {
    const startX = 0
    const startY = 0

    const nodes = [[startX, startY, 0, targetX + targetY]]
    let solved = false

    const seen = new Set()

    while (!solved) {
        const [x, y, score] = nodes.shift()
        if (seen.has(stringify(x,y))) continue
        seen.add(stringify(x,y))
        if (x === targetX && y === targetY) return score
        checkAdjacent(maze, x, y).forEach(([a, b, s]) => {
            if (!seen.has(stringify(a,b))) {
                nodes.push([a, b, score+s, (targetX-a) + (targetY-b)])
            }
        })
        nodes.sort(([_x,_y,a, r1], [_x2, _y2, b,r2]) => (a+r1)-(b+r2))
    }

}

/**
 * @param {[[number]]} maze 
 */
const makeBigMap = (maze) => {
    const cellWidth = maze[0].length
    const cellHeight = maze.length

    const bigMap = Array(cellHeight*5).fill(0).map(_v => (Array(cellWidth*5).fill(0).slice()))

    maze.forEach((arr, y) => arr.forEach((v, x) => {
        for (let i = 0; i<5; i++) {
            for (let j = 0; j<5; j++) {
                const xt = x + (cellWidth * j)
                const yt = y + (cellHeight * i)
                const tempv = (v+i+j)
                const nv = tempv > 9 ? tempv - 9 : tempv
                bigMap[yt][xt] = nv
            }
        }
    }))
    return bigMap
}

solveBtn.onclick = () => {
    const maze = puzzleInput.value.trim().split('\n').map(v => v.split('').map(i => parseInt(i, 10)))

    const targetY = maze.length-1
    const targetX = maze[0].length-1

    const pathLength = findPath(maze, targetX, targetY)

    solution.innerText = `Path value: ${pathLength}`

    const bigMaze = makeBigMap(maze)

    const bigTargetX = bigMaze[0].length-1
    const bigTargetY = bigMaze.length-1

    const bigPath = findPath(bigMaze, bigTargetX, bigTargetY)
    solution.innerText += `\nBig Path Value: ${bigPath}`

    // Visualise for debug
    emptyNode(visual)
    visual.append(displayMaze(maze))
    visual.append(displayMaze(bigMaze))
}