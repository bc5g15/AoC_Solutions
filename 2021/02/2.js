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

/** @param {[number, number][]} points */
const getCorners = (points) => {
    const xs = points.map(([x,_]) => x)
    const ys = points.map(([_,y]) => y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return [minX, minY, maxX, maxY]
}

const buildSvg = (width, height) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('height', height)
    svg.setAttribute('width', width)
    return svg
}

const addStop = (root, offset, colour) => {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop.setAttribute('offset', offset)
    stop.style.stopColor = colour
    root.append(stop)
}

/**
 * @param {Node} root 
 * @param {[number, number][]} points 
 */
const drawLines = (svg, points) => {
    // const [minX, minY, maxX, maxY] = getCorners(points)
    // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    // svg.setAttribute('height', maxY)
    // svg.setAttribute('width', maxX)

    // Create a gradient for a more interesting colour
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    grad.id = 'gradient'
    defs.append(grad)
    addStop(grad, '0%', 'hsl(0, 100%, 50%')
    addStop(grad, '25%', 'hsl(90, 100%, 50%')
    addStop(grad, '50%', 'hsl(180, 100%, 50%')
    addStop(grad, '75%', 'hsl(270, 100%, 50%')
    addStop(grad, '100%', 'hsl(360, 100%, 50%')
    
    svg.append(defs)
    // const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    // stop1.setAttribute('offset', '0%')

    const polyPoints = points.map(i => i.join(' ')).join(' ')

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    line.setAttribute('points', polyPoints)
    line.style.stroke = 'url(#gradient)'
    line.style.strokeWidth = 1
    line.style.strokeLinecap = 'round'
    line.style.strokeLinejoin='round'
    svg.append(line)
}

solveBtn.onclick = () => {
    const commands = puzzleInput.value.trim().split('\n').map(i => i.split(' '))

    let down = 0
    let across = 0

    let aim = 0
    let down2 = 0
    let across2 = 0

    const mods = {
        'down': (v) => { down +=v; aim += v },
        'forward': (v) => { across += v; across2 += v; down2 += (aim * v) },
        'up': (v) => { down -= v; aim -= v }
    }

    // records for visualisation
    const path1 = []
    const path2 = []

    for (let [command, value] of commands) {
        let num = parseInt(value, 10)
        mods[command](num)
        path1.push([across, down])
        path2.push([across2, down2])
    }

    solution.innerText = `down: ${down} across: ${across} solution: ${down * across}\n down2: ${down2} across2: ${across2} solution: ${down2 * across2}`

    // Visualise it!
    emptyNode(visual)
    const [minX, minY, maxX, maxY] = getCorners(path1)
    const svg = buildSvg(maxX, maxY)
    visual.append(svg)
    drawLines(svg, path1)
}