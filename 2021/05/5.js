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
}