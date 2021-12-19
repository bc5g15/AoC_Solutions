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

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

/**
 * @param {[[number, number, number]]} points 
 * @param {number} relativeIndex 
 * @returns 
 */
const lineLengths = (points, relativeIndex) => {
    // This is a massive cheat, so remember it might break
    const relativePoint = points[relativeIndex]

    const distance = ([x0, y0, z0], [x1, y1, z1]) => 
        Math.ceil(Math.sqrt((x1-x0)**2 + (y1-y0)**2 + (z1-z0)**2))
    
    return points.map(p => distance(relativePoint, p))
}

const relativeMatches = (points1, points2) => {
    for (let i = 0; i < points1.length; i++) {
        for (let j = 0; j < points2.length; j++) {
            const lengths1 = new Set(lineLengths(points1, i))
            const lengths2 = new Set(lineLengths(points2, j))
            const overlap = intersection(lengths1, lengths2)
            console.log(i, j, intersection(lengths1, lengths2).size)

            if (overlap.size >= 13) {
                // Identify location equivalents
            }
        }
    }
}


solveBtn.onclick = () => {
    const scanMap = puzzleInput.value.trim().split('\n\n').map( v => {
        let list = v.split('\n')
        list.shift()
        list = list.map(w => w.split(',').map(n => parseInt(n, 10)))
        return list
    })

    console.table(lineLengths(scanMap[0], 9))
    console.table(lineLengths(scanMap[1], 0))

    relativeMatches(scanMap[0], scanMap[1])


}