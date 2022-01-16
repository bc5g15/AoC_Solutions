const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const debugInput = document.getElementById('debuginput')
const debugButton = document.getElementById('solvedebug')

const stringify = (x,y) => `${x},${y}`
const destringify = (s) => s.split(',').map(v => parseInt(v, 10))

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const MinHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}}; // prettier-ignore

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
                if (positions[pos] !== char) {
                    // console.log(`Bad position ${pos}`)
                    return [false]
                }
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

    // forStates.forEach(([init, cond, inc]) => {
    for (let [init, cond, inc] of forStates){
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
                    return [[position, initialCost+Math.abs(x-c)+downstep]]
                    // results.push([position, initialCost+Math.abs(x-c)+downstep])
                }
            }
        }
    }

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
            // console.log(curNode)
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

const searchWithHeap = (positions, roomDepth = 2) => {
    const nodes = [[0, positions, Infinity, '']]
    const seen = new Map()

    let currentNode = nodes[0]
    while (nodes.length) {
        currentNode = MinHeap.pop(nodes)

        const [cost, currentPositions, h, moveString] = currentNode

        if (h === 0) return currentNode
        const nodeString = posString(currentPositions, roomDepth)
        // Error check
        // console.log(nodeString)
        // if (nodeString.split('').filter(c => c==='A').length !== roomDepth) return [currentNode, nodeString]
        // console.log(nodeString)
        if (seen.has(nodeString) && seen.get(nodeString) <= cost) continue
        // if (seen.has(nodeString)) continue
        seen.set(nodeString, cost)

        const movable = canMove(currentPositions, roomDepth)
        // console.log(movable)
        movable.forEach(move => {
            const options = moveOptions(currentPositions, move, roomDepth)
            const character = currentPositions[move]
            options.forEach(([position, moveCost]) => {
                const index = stringify(position[0], position[1])
                const fullCost = charCosts[character] * moveCost
                const newPosition = {...currentPositions}
                newPosition[index] = character
                delete newPosition[move]
                MinHeap.push(nodes, [cost+fullCost, newPosition, 
                    geth(newPosition),
                    moveString + '|' + character + move + '-' + index
                ])

                    // moves: curNode.moves + '|' + char + m +'-' +index})

            })
        })
        // console.log(nodes.length)
        // return nodes
    }
    // console.log(seen)
    return currentNode
}

const drawState = (state) => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    for(const position in state) {
        const [x, y] = destringify(position)
        const cell = document.createElement('div')
        cell.style.outline = '1px solid white'
        cell.style.width = '1em'
        cell.style.height = '1em'
        cell.innerText = state[position]
        cell.style.gridRow = y
        cell.style.gridColumn = x
        container.append(cell)
    }
    return container
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
    // const p1node = search(characters)
    // console.log(p1node)

    // solution.innerText = `2 Depth Rooms: ${p1node.cost}`

    console.log(searchWithHeap(characters))

    // Part 2

    // Build up the second character map
    const char2 = {
        '3,3': 'D',
        '3,4': 'D',
        '5,3': 'C',
        '5,4': 'B',
        '7,3': 'B',
        '7,4': 'A',
        '9,3': 'A',
        '9,4': 'C'
    }
    for (let pos in characters) {
        const [x, y] = destringify(pos)
        //y positions of 3 become 5
        if (y===3) {
            char2[stringify(x,y+2)] = characters[pos]
        } else {
            char2[pos] = characters[pos]
        }
    }


    // const altMap = puzzleInput.ariaValueMax.trim().split('\n')
    // const part2Map = altMap.slice(0, 3)
    //     .concat("  #D#C#B#A#  ", "  #D#B#A#C#  ")
    //     .concat(altMap.slice(3))

    // console.log(search(char2, 4))
    console.log(characters)
    console.log(char2)
    // console.log(searchWithHeap(char2, 4))

    console.log(canMove(char2, 4))

    // const mv = canMove(char2, 4)
    // mv.forEach(move => {
    //     console.log(move)
    //     const options = moveOptions(char2, move, 4)
    //     console.log(options)
    // })

    // const movable = canMove(currentPositions, roomDepth)
    //     // console.log(movable)
    //     movable.forEach(move => {
    //         const options = moveOptions(currentPositions, move, roomDepth)

    const [cost, pos, h, moves] = searchWithHeap(char2, 4)
    console.log(pos)
    console.log(moves)

    console.log(canMove(pos, 4))

    emptyNode(visual)
    visual.append(drawState(pos))
}

debugButton.onclick = () => {
    // Accept input as is so I can go through the worked example
    const characters = {}
    debugInput.value.trim().split('\n').forEach((row, i) => {
        row.split('').forEach((char, j) => {
            if (!['.','#',' '].includes(char)) {
                characters[stringify(j, i)] = char
            }
        })
    })

    const choices = []
    const mv = canMove(characters, 4)
    mv.forEach(move => {
        const options = moveOptions(characters, move, 4)
        const character = characters[move]
        options.forEach(([position, moveCost]) => {
            // Move cost seems to be irrelevant here for some reason
            const index = stringify(position[0], position[1])
            const newPosition = {...characters}
            newPosition[index] = character
            delete newPosition[move]
            choices.push(newPosition)
        })
    })

    choices.forEach(c => {
        console.log(c)
        console.log(searchWithHeap(c, 4))
    })


    // const movable = canMove(currentPositions, roomDepth)
    // // console.log(movable)
    // movable.forEach(move => {
    //     const options = moveOptions(currentPositions, move, roomDepth)
    //     const character = currentPositions[move]
    //     options.forEach(([position, moveCost]) => {
    //         const index = stringify(position[0], position[1])
    //         const fullCost = charCosts[character] * moveCost
    //         const newPosition = {...currentPositions}
    //         newPosition[index] = character
    //         delete newPosition[move]
    //         MinHeap.push(nodes, [cost+fullCost, newPosition, 
    //             geth(newPosition),
    //             moveString + '|' + character + move + '-' + index
    //         ])

    //             // moves: curNode.moves + '|' + char + m +'-' +index})

    //     })
    // })


    // console.log(searchWithHeap(characters, 4))
}

// |C5,2-4,1|C4,1-2,1|C5,3-6,1|C2,1-1,1|B5,4-2,1|C6,1-4,1|D5,5-8,1|D8,1-10,1|B7,2-5,5|B7,3-5,4|C4,1-6,1|A7,4-8,1|B3,2-5,3|C6,1-7,4|B2,1-5,2|A8,1-2,1|D3,3-4,1|D4,1-6,1|D6,1-8,1|A2,1-6,1|C1,1-4,1|D3,4-2,1|D2,1-1,1|C4,1-2,1|A6,1-3,4|D8,1-6,1|D10,1-8,1|D6,1-4,1|D8,1-6,1|D6,1-10,1