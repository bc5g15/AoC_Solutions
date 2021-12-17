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

const displayPoints = (points, maxY, minY, maxX) => {
    const canvas = document.createElement('canvas')
    const width = maxX
    const height = maxY + Math.abs(minY)
    canvas.width = width
    canvas.height = height
    canvas.style.transform = 'scale(2) translate(50%,50%)'
    canvas.style.imageRendering = 'pixelated'

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'white'
    ctx.fillRect(0, (maxY - 1), 2, 2)

    const getColour = (i) => `hsl(${i*360/points.length}, 100%, 50%)`
    points.forEach((arr, i) => {
        ctx.fillStyle = getColour(i)
        arr.forEach(([x, y]) => {
            ctx.fillRect(x, (maxY - y), 1, 1)
        })
    })

    return canvas
}

const getInputCorners = (inString) => {
    const [xpart, ypart] = inString.split(', ')
    const ys = ypart.split('y=')[1]
    const [y0, y1] = ys.split('..').map(v => parseInt(v, 10))
    const xs = xpart.split('target area: x=')[1]
    const [x0, x1] = xs.split('..').map(v => parseInt(v, 10))

    return {x0, x1, y0, y1}
}


const findValidSteps = (x, y) => {
    const results = [[x,y]]
    const ivx = x
    const ivy = y

    const sumRange = (min, max) => (max*(max+1) - (min-1)*min)/2

    const px = (curStep, vx) => sumRange(Math.max(vx-curStep,0), vx)
    const py = (curStep, vy) => sumRange(vy-curStep, vy)

    const checkXMatch = (step) => {
        let vx = ivx
        while (vx > 0) {
            if (px(step, vx) === x) return [true, vx]
            vx--
        }
        return [false, 0]
    }

    const checkYMatch = (step) => {
        let vy = ivy
        let cpy = py(vy, step) 
        while (cpy <= y) {
            if (cpy === y) return [true, vy]
            vy++
            cpy = py(step, vy)
        }
        return [false, 0]
    }

    let canPass = true
    let step = 1
    while (canPass) {
        if (step > (2*Math.abs(y))+1) break
        
        const [xMatch, cx] = checkXMatch(step)
        if (xMatch) {
            const [yMatch, cy] = checkYMatch(step)
            if (yMatch) {
                results.push([cx, cy])
            }
        }
        step++
    }
    return results
}

const everythingValid = ({x0, x1, y0, y1}) => {
    const bigSet = new Set()
    const visualPoints = []
    let highestY = 0

    for (let x = x0; x <= x1; x++) {
        for (let y = y0; y <= y1; y++) {
            const r = findValidSteps(x, y)
            visualPoints.push(r)

            r.forEach(([x, y]) => {
                bigSet.add(stringify(x, y))
                if (y > highestY) highestY = y
            })
        }
    }

    return [bigSet, visualPoints, highestY]
}

solveBtn.onclick = () => {
    const targetArea = puzzleInput.value.trim()

    const corners = getInputCorners(targetArea)

    const sumRange = (min, max) => (max*(max+1) - (min-1)*min)/2

    const {y0, x1} = corners
    solution.innerText = `Highest Possible Shot: ${sumRange(0, Math.abs(y0+1))}`

    const [ev, points, highY] = everythingValid(corners)

    solution.innerText += `\nTotal Possible Trajectories: ${ev.size}`

    // Visualise
    emptyNode(visual)
    visual.append(displayPoints(points, highY, y0, x1))
}