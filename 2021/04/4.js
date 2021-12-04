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

const checkForWin = (filled) => {
    for (let i = 0; i < 5; i++) {
        if (filled.xs[i]?.size === 5 || filled.ys[i]?.size === 5) {
            return true
        }
    }
    return false
}

const addOrNew = (filled, [x, y]) => {
    if (x in filled.xs) {
        filled.xs[x].add(y)
    } else {
        filled.xs[x] = new Set([y])
    }

    if (y in filled.ys) {
        filled.ys[y].add(x)
    } else {
        filled.ys[y] = new Set([x])
    }
}

const calculateScore = (valueIndex, filled) => {
    let score = 0
    for (let key in valueIndex) {
        const [x, y] = valueIndex[key]
        if (!filled.xs?.[x]?.has(y)) {
            score += parseInt(key, 10)
        }
    }
    return score
}

solveBtn.onclick = () => {
    /** @type {string[]} bins */
    const fullInput = puzzleInput.value.trim().split('\n')
    // Parse input
    const numbers = fullInput.shift().split(',').map(v => parseInt(v, 10))

    const boards = fullInput.reduce((acc, cur, i) => {
        if (cur === '') {
            acc.push([])
        } else {
            acc[acc.length-1].push(cur.split(' ').filter(v => v !== '').map(v => parseInt(v, 10)))
        }
        return acc
    }, [])

    // Adjust for better puzzle-suitability
    const valueIndexes = boards.map(b => {
        let myMap = {}
        b.forEach((vs, y) => {
            vs.forEach((v, x) => {
                myMap[v] = [x,y]
            })
        })
        return myMap
    }).map(b => ({ valueIndex: b, filled: {xs: {}, ys: {}} }))

    // Game processing
    const wonBoards = []
    let playableBoards = valueIndexes.map(({valueIndex, filled}) => ({valueIndex, filled, won: false}))
    while (numbers.length > 0) {
        const number = numbers.shift()
        playableBoards = playableBoards.filter(({won}) => won === false).map(({valueIndex, filled}) => {
            let won = false
            if (number in valueIndex) {
                addOrNew(filled, valueIndex[number])
                won = checkForWin(filled)
                if (won) {
                    const score = calculateScore(valueIndex, filled)
                    const finalScore = score * number
                    wonBoards.push({valueIndex, filled, number, score, finalScore})
                }
            }
            return {valueIndex, filled, won}
        })
    }
    
    const firstWin = wonBoards.shift()
    const lastWin = wonBoards.pop()
    
    solution.innerText = `First Final Score: ${firstWin.finalScore} \nLast Final Score: ${lastWin.finalScore}`
}