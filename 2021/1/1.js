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

const measureIncreases = (numbers) => {
    let count = 0
    for (let i = 1; i < numbers.length; i++) {
        const prev = numbers[i-1]
        const now = numbers[i]
        if (prev < now) {
            count++
        }
    }
    return count
}

/** @param {[number, number][]} */
const getCorners = (points) => {
    const xs = points.map(([x,_]) => x)
    const ys = points.map(([_,y]) => y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return [minX, minY, maxX, maxY]
}

/**
 * @param {Node} root 
 * @param {[number, number][]} points 
 */
const drawLines = (root, points) => {
    const [minX, minY, maxX, maxY] = getCorners(points)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('height', maxY-minY)
    svg.setAttribute('width', maxX-minX)

    for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i-1]
        const [x2, y2] = points[i]

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', x1-minX)
        line.setAttribute('x2', x2-minX)
        line.setAttribute('y1', y1-minY)
        line.setAttribute('y2', y2-minY)
        line.style.stroke = 'red'
        line.style.strokeWidth = 1
        line.style.strokeLinecap = 'round'
        svg.append(line)
    }

    root.appendChild(svg)
}

solveBtn.onclick = () => {
    const depths = puzzleInput.value.split('\n').map(i => parseInt(i.trim(), 10))

    // Count number of times a measurement increases
    let count = 0;
    for (let i = 1; i < depths.length; i++) {
        const prev = depths[i-1]
        const now = depths[i]
        if (prev < now) {
            count++
        }
    }

    solution.innerText = count

    // Part 2

    const windows = []

    for (let i = 1; i < depths.length-1; i++) {
        windows.push(depths[i] + depths[i-1] + depths[i+1])
    }

    const count2 = measureIncreases(windows)

    solution.innerText += `\t new: ${count2}`

    // Visualise it!
    emptyNode(visual)
    drawLines(visual, depths.map((v,i) => [i,v]))
}