const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const stringify = ([x,y,z]) => `${x},${y},${z}`
const destringify = (s) => s.split(',').map(v => parseInt(v, 10))

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
    const relativePoint = points[relativeIndex]
    
    // This is a massive cheat, so remember it might break
    const distance = ([x0, y0, z0], [x1, y1, z1]) => 
        Math.floor(Math.sqrt((x1-x0)**2 + (y1-y0)**2 + (z1-z0)**2)*1000000) // Reduce false equalities
    
    return points.map(p => distance(relativePoint, p))
}

const relativeMatches = (points1, points2) => {
    for (let i = 0; i < points1.length; i++) {
        for (let j = 0; j < points2.length; j++) {
            const lengths1 = lineLengths(points1, i)
            const lengths2 = lineLengths(points2, j)
            const overlap = intersection(new Set(lengths1), new Set(lengths2))
            
            if (overlap.size >= 12) {
                // Identify location equivalents
                const indexMap = {
                    match: true
                }
                lengths1.forEach((v, i) => lengths2.forEach((w, j) => {
                    if (v===w) {
                        indexMap[i] = j
                    }
                }))
                return indexMap
            }
        }
    }
    return {match: false}
}

const calculateRelativePosition = (points1, points2) => {

    const rotations = [
        ([x, y, z]) => [x, y, z],
        ([x, y, z]) => [y, -x, z],
        ([x, y, z]) => [-x, -y, z],
        ([x, y, z]) => [-y, x, z]
    ]

    const facings = [
        ([x, y, z]) => [x, y, z],
        ([x, y, z]) => [z, y, -x],
        ([x, y, z]) => [-x, y, -z],
        ([x, y, z]) => [-z, y, x],
        ([x, y, z]) => [x, z, -y],
        ([x, y, z]) => [x, -z, y]
    ]

    const transforms = rotations.flatMap(f => facings.map(j => (i => f(j(i))) )) 

    for (let i = 0; i<24; i++) {
        const pointSlice = points2.map(v => transforms[i](v))

        const [ix, iy, iz] = pointSlice[0]
        const offsetX = ix - points1[0][0]
        const offsetY = iy - points1[0][1]
        const offsetZ = iz - points1[0][2]

        const canWork = pointSlice.map(([x, y, z], i) => {
            const [a,b,c] = points1[i]
            return (a + offsetX === x && b + offsetY === y && c + offsetZ === z)
        })

        if (canWork.every(v => v)) {
            return [transforms[i], -offsetX, -offsetY, -offsetZ]
        }
    }

    // Just break
    return false
}

const reduceMaps = (maps) => {
    const remaining = maps.slice()
    const major = remaining.shift()
    const majorSet = new Set(major.map(stringify))
    const scanners = [[0, 0, 0]]
    let i = 0
    while (remaining.length > 0) {
        const current = remaining[i]
        const {match, ...indexes} = relativeMatches(major, current)
        if (match) {
            const points1 = []
            const points2 = []
            for (let j in indexes) {
                points1.push(major[j])
                points2.push(current[indexes[j]])
            }
            const [transform, xoff, yoff, zoff] = calculateRelativePosition(points1, points2)
            scanners.push([xoff, yoff, zoff])
            const adjustedPoints = current.map(v => {
                const [x, y, z] = transform(v)
                return [x+xoff, y+yoff, z+zoff]
            })

            // Add to the map aggregate
            adjustedPoints.forEach(v => {
                const s = stringify(v)
                if (!majorSet.has(s)) {
                    majorSet.add(s)
                    major.push(v)
                }
            })

            // Remove the map we matched
            remaining.splice(i, 1)
            i = (i%remaining.length)
        } else {
            i = (i+1) % remaining.length
        }
    }

    return [major, scanners]
}


solveBtn.onclick = () => {
    const scanMap = puzzleInput.value.trim().split('\n\n').map( v => {
        let list = v.split('\n')
        list.shift()
        list = list.map(w => w.split(',').map(n => parseInt(n, 10)))
        return list
    })

    const [beacons, scanners] = reduceMaps(scanMap)

    solution.innerText = `Beacon Count: ${beacons.length}`

    // Part 2
    let distance = 0
    scanners.forEach(([a,b,c]) => scanners.forEach(([x, y, z]) => {
        const total = Math.abs(a-x) + Math.abs(b-y) + Math.abs(c-z)
        distance = Math.max(distance, total) 
    }))

    solution.innerText += `\nMax distance between scanners: ${distance}`

    // 8488 - Too low
    // 10707 - Right
}
