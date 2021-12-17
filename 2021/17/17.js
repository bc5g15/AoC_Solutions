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
                results.push([cx, cy, step])
            }
        }
        step++
    }
    return results
}

const everythingValid = ({x0, x1, y0, y1}) => {
    const bigSet = new Set()

    for (let x = x0; x <= x1; x++) {
        for (let y = y0; y <= y1; y++) {
            const r = findValidSteps(x, y)
            r.forEach(([x, y]) => bigSet.add(stringify(x, y)))
        }
    }

    return bigSet
}

solveBtn.onclick = () => {
    const targetArea = puzzleInput.value.trim()
    // target area: x=20..30, y=-10..-5

    const corners = getInputCorners(targetArea)

    const sumRange = (min, max) => (max*(max+1) - (min-1)*min)/2

    const {y0} = corners
    solution.innerText = `Highest Possible Shot: ${sumRange(0, Math.abs(y0+1))}`

    const ev = everythingValid(corners)

    solution.innerText += `\nTotal Possible Trajectories: ${ev.size}`

}