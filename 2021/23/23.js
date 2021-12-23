const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const stringify = (x,y) => `${x},${y}`
const destringify = (s) => s.split(',').map(v => parseInt(v, 10))

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const targetColumn = {
    'A': 3,
    'B': 5,
    'C': 7,
    'D': 9
}

const canMove = (positions) => {
    // Can only move if in the corridoor 
    // Or nothing above
    const result = []
    for (let p in positions) {
        // If we're already where we need to be we won't move
        const [x, y] = destringify(p)
        const target = targetColumn[positions[p]]
        // if (x === target) continue

        if (y === 1 || y === 2) {
            result.push(p)
        } else {
            if (!(stringify(x,y-1) in positions)) {
                result.push(p)
            }
        }
    }
    return result
}

const moveOptions = (positions, characterPos) => {
    // Can move to any legal unoccupied corridor position
    // Also into their destination room
    
    // But the calculations are a little different
    // Depending on if they are in a room already

    const results = []

    let initialCost = 0

    const char = positions[characterPos]
    const [x, y] = destringify(characterPos)
    const target = targetColumn[char]

    // If in room, add cost to get out of it
    initialCost = y-1

    const legalColumns = [1,2,4,6,8,9,10]

    const checkCorridorSpace = (column) => {
        if (stringify(c, 1) in positions) return [false]
        if (legalColumns.includes(c)) return [true, [c, 1]]

        if (c === target) {
            if (stringify(target, 3) in positions) {
                return [true, [target,2]]
            } else {
                return 
            }
        }
    }

    // Check left
    for (let c = x-1; c>=1; c--) {
        // Stop immediately if the square is occupied
        if (stringify(c, 1) in positions) break;
        if (legalColumns.includes(c)) results.push([c,1])

        // If target room move as deep in as possible
        // if (c === )
    }

    return results
}

const search = (positions) => {
    const cost = {
        'A': 1,
        'B': 10,
        'C': 100,
        'D': 1000
    }

    const targetRow = {
        'A': 3,
        'B': 5,
        'C': 7,
        'D': 9
    }


}

solveBtn.onclick = () => {
    const characters = {}
    puzzleInput.value.trim().split('\n').forEach((row, i) => {
        row.split('').forEach((char, j) => {
            if (!['.','#',' '].includes(char)) {
                characters[stringify(j, i)] = char
            }
        })
    })

    // Corridor goes from '2,1' to '2,11'

    console.log(characters)
    console.log(canMove(characters))
}
