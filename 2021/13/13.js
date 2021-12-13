const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const destringify = s => s.split(',').map(j => parseInt(j, 10))
const stringify = (x,y) => `${x},${y}`

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const displayPoints = (points) => {
    const squares = [...points].map(destringify)
    const maxX = squares.map(([x,y]) => x).sort((a, b) => a-b).reverse()[0]
    const maxY = squares.map(([x,y]) => y).sort((a, b) => a-b).reverse()[0]

    const container = document.createElement('div')
    container.style.display = 'grid'
    container.style.gridTemplateColumns = `repeat(${maxX+1}, 1em)`
    container.style.gridTemplateRows = `repeat(${maxY+1}, 1em)`
    container.style.border = '.5em solid blue'
    container.style.width = 'fit-content'

    const cells = squares.map(([x, y]) => {
        const cell = document.createElement('div')
        cell.style.width = '100%'
        cell.style.height = '100%'
        cell.style.background = 'white'
        cell.style.gridRow = y+1
        cell.style.gridColumn = x+1

        return cell
    })
    container.append(...cells)
    return container
}

const applyFold = (points, [foldDir, foldV]) => {
    const currentPoints = [...points].map(destringify)

    const matchFold = (x, y) => {
        if (foldDir === 'x') {
            if (x > foldV) {
                return [foldV-(x-foldV), y]
            }
        } else {
            if (y > foldV) {
                return [x, foldV- (y - foldV)]
            }
        }
        return [x, y]
    }

    const newPoints = new Set()
    currentPoints.forEach(([x,y]) => {
        const [fx, fy] = matchFold(x, y)
        newPoints.add(stringify(fx, fy))
    })

    return newPoints
}

solveBtn.onclick = () => {
    const fullInput = puzzleInput.value.trim().split('\n\n').map(v => v.split('\n'))

    const points = new Set(fullInput[0])
    const folds = fullInput[1].map(v => {
        const [a,b] = v.split('=')
        return [a[a.length-1], parseInt(b, 10)]
    })

    const nextPoints = applyFold(points, folds[0])

    solution.innerText = `Points after first fold: ${nextPoints.size}`

    let newPoints = points
    folds.forEach(f => {
        newPoints = applyFold(newPoints, f)
    })

    // Visualise for part 2
    emptyNode(visual)
    visual.append(displayPoints(newPoints))

}