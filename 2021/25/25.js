const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const stringify = (x, y) => `${x},${y}`
const destringify = (s) => s.split(',').map(v => parseInt(v, 10))

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const makeCanvas = (width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    
    return canvas
}

const animate = (states, canvas, width, height) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    const anim = () => {
        if (states.length === 0) return
        ctx.clearRect(0, 0, width, height)
        const [rights, downs] = states.shift()

        ctx.fillStyle = 'blue'
        for (let key of rights) {
            const [x, y] = destringify(key)
            ctx.fillRect(x, y, 1, 1)
        }

        ctx.fillStyle = 'green'
        for (let key of downs) {
            const [x, y] = destringify(key)
            ctx.fillRect(x, y, 1, 1)
        }

        window.requestAnimationFrame(anim)
    }
    window.requestAnimationFrame(anim)
}

const step = (rights, downs, width, height) => {
    let hasMoved = false

    const newRights = new Set(rights)
    rights.forEach(key => {
        const [x,y] = destringify(key)
        const newX = (x + 1) % width
        const newKey = stringify(newX,y)
        if (!rights.has(newKey) && !downs.has(newKey)) {
            newRights.delete(key)
            newRights.add(newKey)
            hasMoved = true
        }
    })

    const newDowns = new Set(downs)
    downs.forEach(key => {
        const [x, y] = destringify(key)
        const newY = (y+1) % height
        const newKey = stringify(x, newY)
        if (!newRights.has(newKey) && !downs.has(newKey)) {
            newDowns.delete(key)
            newDowns.add(newKey)
            hasMoved = true
        }
    })

    return [hasMoved, newRights, newDowns]
}

solveBtn.onclick = () => {
    const initialCucumbers = puzzleInput.value.trim().split('\n').map(v => v.split(''))

    const height = initialCucumbers.length
    const width = initialCucumbers[0].length

    const rights = new Set()
    const downs = new Set()
    const fullMap = {}
    initialCucumbers.forEach((arr, y) => arr.forEach((c, x) => {
        fullMap[stringify(x, y)] = c
        if (c === '>') rights.add(stringify(x, y))
        if (c === 'v') downs.add(stringify(x, y))
    }))

    console.log(rights, downs)

    let count = 1
    let [hasMoved, newRights, newDowns] = step(rights, downs, width, height)

    // console.log(newRights, newDowns)

    const states = [[rights, downs], [newRights, newDowns]]
    while (hasMoved) {
        const [nm, nr, nd] = step(newRights, newDowns, width, height)
        newRights = nr
        newDowns = nd
        hasMoved = nm
        count++

        states.push([nr, nd])
        // console.log(count)
    }

    // console.log(count)
    solution.innerText = `Locked after ${count} steps`

    emptyNode(visual)
    const canvas = makeCanvas(width, height)
    visual.append(canvas)
    animate(states, canvas, width, height)
}