const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const stringify = (x,y,z) => `${x},${y},${z}`
const destringify = (s) => s.split(',').map(v => parseInt(v, 10))

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const supaslow = (ranges) => {
    const active = new Set()
    for (const {trip, xs, ys, zs} of ranges) {
        for (let x = xs[0]; x<= xs[1]; x++) {
            for (let y = ys[0]; y<=ys[1]; y++) {
                for (let z = zs[0]; z<=zs[1]; z++) {
                    if (trip) {
                        active.add(stringify(x,y,z))
                    } else {
                        active.delete(stringify(x,y,z))
                    }
                }
            }
        }
    }
    return active
}

const fullyContained = (container, contained) => {
    const contains = ([smallestA, biggestA], [a1, a2]) => 
        a1 >= smallestA && a1 <= biggestA &&
        a2 >= smallestA && a2 <= biggestA
        
    return contains(container.xs, contained.xs) && 
        contains(container.ys, contained.ys) &&
        contains(container.zs, contained.zs)
}

const checkForOverlap = (range1, range2) => {
    const rangeOverlap = ([a1, a2], [b1, b2]) => (a1 >= b1 &&
        a1 <= b2) || (a2 >= b1 && a2 <= b2) || (b1 >= a1 && 
            b1 <= a2) || (b2 >= a1 && b2 <= a2)

    return rangeOverlap(range1.xs, range2.xs) 
        && rangeOverlap(range1.ys, range2.ys)
        && rangeOverlap(range1.zs, range2.zs)
}


const splitByOverlap = (range1, range2) => {
    // 27 possible ranges, assuming certain properties. 
    // By this point assume there is an overlap

    const basex = range1.xs
    const basey = range1.ys
    const basez = range1.zs

    const targetx = range2.xs
    const targety = range2.ys
    const targetz = range2.zs

    const faceRange = (as, bs) => [Math.max(as[0], bs[0]), Math.min(as[1], bs[1])]

    const canExist = ([a, b]) => a<=b

    
    if (range2.trip) {
        // Addition
        const minx = [targetx[0], basex[0]-1]
        const midx = faceRange(targetx, basex)
        const maxx = [basex[1]+1, targetx[1]]
        const miny = [targety[0], basey[0]-1]
        const midy = faceRange(targety, basey)
        const maxy = [basey[1]+1, targety[1]]
        const minz = [targetz[0], basez[0]-1]
        const midz = faceRange(targetz, basez)
        const maxz = [basez[1]+1, targetz[1]]
    
        const xranges = [minx, midx, maxx].filter(v => canExist(v))
        const yranges = [miny, midy, maxy].filter(v => canExist(v))
        const zranges = [minz, midz, maxz].filter(v => canExist(v))
        // Addition
        const combinations = []
        // Every combination, hopefully
        xranges.forEach(xr => yranges.forEach(yr => zranges.forEach(zr => {
            const add = {xs: xr, ys: yr, zs: zr, trip: true}
            if (!fullyContained(range1, add)) combinations.push(add)
        })))
        return combinations

    } else {
        // Subtraction
        const minx = [basex[0], targetx[0]-1]
        const midx = faceRange(targetx, basex)
        const maxx = [targetx[1]+1, basex[1]]
        const miny = [basey[0], targety[0]-1]
        const midy = faceRange(targety, basey)
        const maxy = [targety[1]+1, basey[1]]
        const minz = [basez[0], targetz[0]-1]
        const midz = faceRange(targetz, basez)
        const maxz = [targetz[1]+1, basez[1]]

        const xranges = [minx, midx, maxx].filter(v => canExist(v))
        const yranges = [miny, midy, maxy].filter(v => canExist(v))
        const zranges = [minz, midz, maxz].filter(v => canExist(v))

        const combinations = []
        // Every combination of the first, subtractions removed.
        xranges.forEach(xr => yranges.forEach(yr => zranges.forEach(zr => {
            const add = {xs: xr, ys: yr, zs: zr, trip: true}
            if (!fullyContained(range2, add)) combinations.push(add)
        })))
        return combinations
    }
}

const totalSum = (range) => {
    const x = (range.xs[1]+1) - range.xs[0]
    const y = (range.ys[1]+1) - range.ys[0]
    const z = (range.zs[1]+1) - range.zs[0]
    return x * y * z
}

const fullResolve = (ranges) => {
    const curRanges = ranges.slice()
    let rangeList = [curRanges.shift()]

    while (curRanges.length > 0) {
        const current = curRanges.shift()
        if (current.trip){

            // Addition logic
            let skip = false
            for (let r of rangeList) {
                // If any accepted block contains the new one
                // We can skip it
                if (fullyContained(r, current)) {
                    skip = true
                }
            }
            if (skip) continue

            // Filter out any blocks that may be contained by this one
            rangeList = rangeList.filter(r => !fullyContained(current, r))

            let blocks = [current]
            // Match the new blocks with everything 
            for (let r of rangeList) {
                const newBlocks = []
                for (let b of blocks) {
                    if (checkForOverlap(b, r)) {
                        newBlocks.push(...splitByOverlap(r, b))
                    } else {
                        newBlocks.push(b)
                    }
                }
                blocks = newBlocks
            }
            // At the end the new blocks should fit with the existing ones
            rangeList.push(...blocks)
        } else {
            // Subtraction logic
            
            // Filter out any blocks that are fully contained by this one
            rangeList = rangeList.filter(r => !fullyContained(current, r))

            let newRanges = []
            // Apply the subtraction to each overlapping range
            for (let r of rangeList) {
                if (checkForOverlap(current, r)) {
                    newRanges.push(...splitByOverlap(r, current))
                } else {
                    newRanges.push(r)
                }
            }
            rangeList = newRanges
        }
    }
    
    // At the end of all this madness we should have a list of everything that is on
    return rangeList
}

const rangeTotalSum = (ranges) => ranges.reduce((acc, cur) => acc + totalSum(cur), 0)

solveBtn.onclick = () => {
    const ranges = puzzleInput.value.trim().split('\n').map(s => {
        const result = {}
        const r = s.split(' ')
        result.trip = (r[0] === 'on' ? true : false)
        const ranges = (r[1].split(',').map(v => v.substring(2).split('..').map(w => parseInt(w, 10)))).map(([a, b]) => [a, b])
        result.xs = ranges[0]
        result.ys = ranges[1]
        result.zs = ranges[2]
        return result
    })

    // Part 1
    const p1Ranges = ranges.filter(({xs, ys, zs}) => {
        return xs[0] > -51 && xs[1] < 51 
        && ys[0] > -51 && ys[1] < 51
        && zs[0] > -51 && zs[1] < 51
    })

    const slowAnswer = supaslow(p1Ranges).size

    const fastAnswer = rangeTotalSum(fullResolve(p1Ranges))
    
    solution.innerText = `Within 50 Range slow: ${slowAnswer} fast: ${fastAnswer}`

    // part 2

    const r2 = rangeTotalSum(fullResolve(ranges))
    solution.innerText += `\nWithin Full Range: ${r2}`
}