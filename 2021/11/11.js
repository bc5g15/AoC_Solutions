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

const stringify = (x, y) => `${x},${y}`
const destringify = (s) => s.split(',').map(i => parseInt(i, 10))

const checkCell = ([x,y], squids) => {
    let value = squids[y]?.[x] ?? -2
    if (value < 0) return [value, []]

    value++
    const checkAgain = []

    if (value > 9) {
        const shiftSum = (i) => (j) => i + j
        const deltas = [-1, 0, +1]
        const surround = deltas.flatMap(d => deltas.map(e => [shiftSum(d)(x), shiftSum(e)(y)])).filter(([a,b]) => !(a===x && b===y))
        value = -1
        checkAgain.push(...surround)
    }
    squids[y][x] = value

    return [value, checkAgain]
}

/**
 * @param {number[][]} squids 
 */
const displaySquids = (squids) => {
    const container = document.createElement('div')
    const height = squids.length
    const width = squids[0].length

    container.style.display = 'grid'
    container.style.gridTemplateColumns = `repeat(${width}, 1em)`
    container.style.gridTemplateRows = `repeat(${height}, 1em)`
    container.style.border = '1em solid blue'
    container.style.width = 'fit-content'

    container.append(...squids.flatMap((arr, y) => arr.map((v, x) => {
        const cell = document.createElement('div')
        cell.style.gridRow = y+1
        cell.style.gridColumn = x+1
        cell.innerText = v
        cell.style.fontWeight = v===0 ? 'bold' : 'normal'
        return cell
    })))
    return container
}

/**
 * @param {number[][]} squids 
 */
const step = ({squids, flashes}) => {

    let newSquids = squids.map(arr => arr.map(v => v))

    const checkThese = newSquids.flatMap((v, i) => v.map((_, j) => [j, i]))

    let newFlashes = 0

    console.log(checkThese)

    while (checkThese.length > 0) {
        const cur = checkThese.pop()
        const [v, recheck] = checkCell(cur, newSquids)
        checkThese.push(...recheck)
    }

    newSquids = newSquids.map(arr => arr.map(v => {
        if (v < 0) {
            newFlashes++
            return 0
        } 
        return v
    }))

    const totalSquids = squids.reduce((acc, cur) => acc + cur.length, 0)
    const sync = newFlashes === totalSquids

    return {squids: newSquids, flashes: newFlashes+flashes, sync}

}

solveBtn.onclick = () => {
    /** @type {[[number]]} */
    const squids = puzzleInput.value.trim().split('\n').map(l => l.split('').map(i => parseInt(i, 10)))

    const squidMap = {}
    squids.forEach((arr, i) => arr.forEach((v, j) => squidMap[stringify(j, i)] = v))

    let state = {squids, flashes: 0}
    // step(squids)
    console.log(squids)
    console.log(step(state))

    emptyNode(visual)
    visual.append(displaySquids(squids))

    let x = 0
    let sync = false
    let at100 = 0
    while (!sync) {
        x++
        state = step(state)
        sync = state.sync
        if (x === 100) at100 = state.flashes
        // visual.append(displaySquids(state.squids))
    }

    const {squids: finalSquids, flashes} = state

    visual.append(displaySquids(finalSquids))

    solution.innerText = `Flashes after 100 steps: ${at100}`

    solution.innerText += `\nSynchronized after ${x} steps with ${flashes} flashes`

}