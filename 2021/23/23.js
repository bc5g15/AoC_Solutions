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

const charCosts = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
}

const canMove = (positions, roomDepth) => {
    // Can only move if in the corridoor 
    // Or nothing above
    const result = []
    for (let p in positions) {
        // If we're already where we need to be we won't move
        const [x, y] = destringify(p)
        const target = targetColumn[positions[p]]
        const char = positions[p]

        if (x === target) {
            // We can move if there is anything incorrect below
            let legalRoom = true
            for (let dy = y+1; dy<=y+roomDepth; dy++) {
                const pos = stringify(x, dy)
                if ((positions[pos] ?? char) !== char) {
                    legalRoom = false
                    break
                }
            }
            if (legalRoom) continue
        }

        // We may need to move if the wrong person is below us
        // if (x === target && (y === 3 || (y === 2 && (positions[stringify(x,3)] ?? char) === char))) continue
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

const moveOptions = (positions, characterPos, roomDepth) => {
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

    const legalColumns = [1,2,4,6,8,10,11]
    const rooms = [3,5,7,9]

    const checkCorridorSpace = (column) => {
        if (stringify(column, 1) in positions) return [false]
        if (legalColumns.includes(column)) return [true, [column, 1]]

        // if (c === target) {
        //     if (stringify(target, 3) in positions) {
        //         // Can't move in if an incorrect char is there
        //         const char2 = positions[stringify(target, 3)]
        //         if (char2 === char) {
        //             return [true, [target,2]]
        //         } else {
        //             return [false]
        //         }
        //     } else {
        //         return [true, [target, 3]]
        //     }
        // }
    }

    const roomOccupants = (column, depth) => {
        // console.log(column, depth, positions)
        for (let i = depth+1; i>1; i--) {
            const pos = stringify(column, i)
            // console.log(pos)
            if (pos in positions) {
                if (positions[pos] !== char) return [false]
            } else {
                return [true, [column, i], i-1]
            }
        }
    }

    const checkRoomSpace = (column, depth) => {
        if (column === target) {

            // Can enter a room if it is empty
            // Or it is the same as 
            const [isLegal, pos, downstep] = roomOccupants(column, depth)
            if (isLegal) return [true, pos, downstep]
            return [false]
            // Otherwise can enter if it is only occupied by 
            // others of the same character

            // If that space is already occupied, then no
            // if (stringify(target, 2) in positions) return [false]
            // if (stringify(target, 3) in positions) {
            //     // Is our neighbour the same type as us?
            //     const char2 = positions[stringify(target,3)]
            //     if (char2 === char) {
            //         return [true, [target, 2], 1]
            //     } else {
            //         return [false]
            //     }
            // } else {
            //     return [true, [target, 3], 2]
            // }
        }
        return [false]
    }

    const forStates = [[x-1,(c)=>c>=1, -1], [x+1, (c)=>c<=10, 1]]

    forStates.forEach(([init, cond, inc]) => {
        for (let c = init; cond(c); c=c+inc) {
            if (legalColumns.includes(c)){
                const [legal, position] = checkCorridorSpace(c)
                // If blocked then we must stop moving in this direction
                if (!legal) break
        
                results.push([position, initialCost+Math.abs(x-c)])
            }
            if (rooms.includes(c)) {
                const [legal, position, downstep] = checkRoomSpace(c, roomDepth)
                // Illegal room moves don't break progress
                if (legal) {
                    results.push([position, initialCost+Math.abs(x-c)+downstep])
                }
            }
        }
    })

    // Check left
    // for (let c = x-1; c>=1; c--) {
        
    //     // Stop immediately if the square is occupied
    //     // if (stringify(c, 1) in positions) break;
    //     // if (legalColumns.includes(c)) results.push([c,1])

    //     // If target room move as deep in as possible
    //     // if (c === )
    // }

    return results
}

const geth = (positions) => {
    let result = 0
    for (let p in positions) {
        const [x,y] = destringify(p)
        const char = positions[p]
        result += Math.abs(x - targetColumn[char]) * charCosts[char]
    }
    return result
}

const posString = (positions, depth) => {
    let finalString = ''
    const roomSpaces = [3,5,7,9]
    for (let i=1; i<=11; i++) {
        finalString += (positions[stringify(i, 1)] ?? '.')
        if (roomSpaces.includes(i)) {
            for (let j = 2; j<=depth+1; j++) {
                finalString += (positions[stringify(i, j)] ?? '.')
            }
            // finalString += (positions[stringify(i, 2)] ?? '.')
            // finalString += (positions[stringify(i, 3)] ?? '.')
        }
    }
    return finalString
}

const search = (positions, roomDepth=2) => {
    const nodes = [{positions, cost: 0, h: geth(positions), moves: ''}]
    const seen = new Set()

    let curNode = nodes[0]
    // let h = 1
    let minH = Infinity
    while (nodes.length > 0) {
        curNode = nodes.shift()

        if (curNode.h < minH) {
            minH = curNode.h
            console.log(curNode)
        }

        if (curNode.h === 0) return curNode
        const nodeString = posString(curNode.positions, roomDepth)
        if (seen.has(nodeString)) continue
        seen.add(nodeString)

        // if (Object.keys(curNode.positions).length !== 8) {
        //     console.log(curNode)
        // }

        const movable = canMove(curNode.positions, roomDepth)
        movable.forEach(m => {
            const options = moveOptions(curNode.positions, m, roomDepth)
            const char = curNode.positions[m]
            options.forEach(([pos, moveCost]) => {
                const index = stringify(pos[0], pos[1])
                // console.log(index)
                const fullCost = charCosts[char] * moveCost
                const newPos = {...curNode.positions}
                newPos[index] = char
                delete newPos[m]
                // console.log(newPos)
                nodes.push({positions: newPos, cost: curNode.cost + fullCost, h: geth(newPos), 
                    moves: curNode.moves + '|' + char + m +'-' +index})
            })
        })
        nodes.sort(({cost:c1, h:h1},{cost:c2, h:h2}) => (c1+h1)-(c2+h2))
        // nodes.sort(({cost:c1, h:h1},{cost:c2, h:h2}) => (h1)-(h2))
        // return nodes
        // curNode = nodes.shift()
        // console.log(curNode)
    }
    console.log(seen)
    return curNode
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
    const movable = canMove(characters, 2)
    console.log(canMove(characters, 2))

    console.table(moveOptions(characters, movable[0], 2))
    // console.table(moveOptions(characters, movable[1]))
    // console.table(moveOptions(characters, movable[2]))

    // console.log(search(characters))
    const p1node = search(characters)
    console.log(p1node)

    solution.innerText = `2 Depth Rooms: ${p1node.cost}`

    // Part 2

    // Build up the second character map
    const char2 = {
        '3,2': 'D',
        '3,3': 'D',
        '5,2': 'C',
        '5,3': 'B',
        '7,2': 'B',
        '7,3': 'A',
        '9,2': 'A',
        '9,3': 'C'
    }
    for (let pos in characters) {
        const [x, y] = destringify(pos)
        //y positions of 3 become 5
        if (y===3) {
            char2[stringify(x,y+2)] = characters[pos]
        }
    }

    console.log(search(char2, 4))
}
