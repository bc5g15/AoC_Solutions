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

/**
 * @param {[boolean, number][]} scores 
 * @param {number} width 
 * @param {number} height 
 */
const graphScores = (scores, width, height) => {
    const barHeight = 5
    const totalWidth = 500
    const canvas = document.createElement('canvas')
    // Use a width ratio otherwise way too big
    canvas.width = totalWidth
    canvas.height = height*barHeight

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'purple'

    scores.forEach(([a,b], i) => {
        ctx.fillStyle = a ? 'green' : 'red'
        ctx.fillRect(0, i*barHeight, (b/width) * totalWidth, barHeight)
    })
    ctx.fillRect(0,0,10,10)
    return canvas
}

const closers = {
    '(': ')',
    '<': '>',
    '{': '}',
    '[': ']'
}

const score = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

const autoValue = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

const peek = (stack) => stack[stack.length-1]

/**
 * @param {string[]} line 
 */
const checkLine = (line) => {
    const chunkStack = []
    const openers = Object.keys(closers)
    for (let c of line) {
        if (openers.includes(c)) {
            chunkStack.push(c)
        } else if (closers[peek(chunkStack)] === c) {
            chunkStack.pop()
        } else {
            return [false, score[c]]
        }
    }
    // Calculate autocomplete score
    let autoScore = 0
    for (let o of chunkStack.reverse()) {
        autoScore *= 5
        const c = closers[o]
        autoScore += autoValue[c]
    }
    return [true, autoScore]
}

solveBtn.onclick = () => {
    /** @type {[[string]]} */
    const lines = puzzleInput.value.trim().split('\n').map(l => l.split(''))

    const scores = lines.map(checkLine)
    const fileScore = scores.filter(([a]) => !a).reduce((acc, cur) => acc+cur[1], 0)

    solution.innerText = `File Corruption Score: ${fileScore}`

    const completeScores = scores.filter(([a]) => a).map(([_a,b]) => b).sort((a,b) => a-b)

    const medianScore = completeScores[Math.floor(completeScores.length / 2)]

    solution.innerText += `\nFile Autocompletion Score: ${medianScore}`

    // Visualise
    emptyNode(visual)
    const height = scores.length
    const width = scores.map(([_a,b]) => b).sort((a,b) => a-b).reverse()[0]
    visual.append(graphScores(scores, width, height))

}