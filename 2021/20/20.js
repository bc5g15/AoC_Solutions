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

// const debugDraw = (image, background) => {
//     const container = document.createElement('div')

//     const {minx, miny, maxx, maxy} = findCorners(image)
//     const width = maxx - minx
//     const height = maxy-miny

//     container.style.display = 'grid'
//     container.style.gridTemplateColumns = `repeat(${width}, 1em)`
//     container.style.gridTemplateRows = `repeat(${height}, 1em)`
//     container.style.margin = '1em'

//     const display = background === '#' ? '.':'#'

//     for (let x = 0; x<=width; x++ ) {
//         for (let y=0; y<=height; y++) {
//             const cell = document.createElement('div')
//             cell.innerText = image.has(stringify(x+minx, y+miny)) ?  display : background
//             cell.style.gridColumn = x+1
//             cell.style.gridRow = y+1
//             container.append(cell)
//         }
//     }

//     return container
// }

const drawImage = (image, background) => {
    const canvas = document.createElement('canvas')
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    const {minx, miny, maxx, maxy} = findCorners(image)
    const width = maxx - minx
    const height = maxy-miny

    canvas.width = width
    canvas.height = height
    canvas.style.margin = '1em'

    const [forecolour, backcolour] = background === '#' ? ['black, white'] : ['white', 'black']

    ctx.fillStyle = backcolour
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = forecolour
    image.forEach(s => {
        const [x, y] = destringify(s)
        ctx.fillRect(x-minx,y-miny,1,1)
    })

    return canvas
}

const findCorners = (image) => {
    let minx = Infinity
    let miny = Infinity
    let maxx = -Infinity
    let maxy = -Infinity
    image.forEach(s => {
        const [x, y] = destringify(s)
        minx = Math.min(x, minx)
        miny = Math.min(y, miny)
        maxx = Math.max(x, maxx)
        maxy = Math.max(y, maxy)
    })

    return {minx, miny, maxx, maxy}
}

const step = (image, background, algorithm) => {
    const newImage = new Set()

    const {minx, miny, maxx, maxy} = findCorners(image)

    const findBit = (binstring) => {
        const address = parseInt(binstring, 2)
        return algorithm[address]
    }

    const backbit = background === '#' ? '1' : '0'

    const newBackground = findBit(backbit.repeat(9))

    const diffs = [-1, 0, +1]
    const allDiffs = (x, y) => diffs.flatMap(v => diffs.map(w => [w+x, v+y]))
    const ih = (x, y) => image.has(stringify(x, y))

    const pointAddress = (x, y) => {
        const coords = allDiffs(x, y)
        const pixels = coords.map(([a, b]) => {
            if (background === '#') {
                return ih(a,b) ? '0' : '1'
            } else {
                return ih(a,b) ? '1' : '0'
            }
        })
        return pixels.join('')
    }

    for (let y = miny-1; y<=maxy+1; y++) {
        for (let x = minx-1; x<=maxx+1; x++) {
            const pa = pointAddress(x, y)
            const b = findBit(pa)

            if (newBackground !== b) {
                newImage.add(stringify(x,y))
            }
        }
    }

    return [newImage, newBackground]
}

solveBtn.onclick = () => {
    const [algorithm, imagestring] = puzzleInput.value.trim().split('\n\n')
    
    const image = new Set()
    imagestring.split('\n').forEach((arr, y) => arr.split('').forEach((v, x) => {
        if (v === '#') {
            image.add(stringify(x, y))
        }
    }))

    // Debug display
    // emptyNode(visual)
    // visual.append(debugDraw(image, '.'))
    const [i, b] = step(image, '.', algorithm)
    // visual.append(debugDraw(i, b))
    const [i2, b2] = step(i, b, algorithm)
    // visual.append(debugDraw(i2, b2))

    solution.innerText = `Lit pixels after 2: ${i2.size}`

    // Part 2

    let curImage = image
    let curBackground = '.'
    for (let i = 0; i < 50; i++) {
        const [img, bak] = step(curImage, curBackground, algorithm)
        curImage = img
        curBackground = bak
    }

    solution.innerText += `\nLit pixels after 50: ${curImage.size}`

    // Canvas Visualisation
    emptyNode(visual)
    visual.append(drawImage(image, '.'))
    visual.append(drawImage(i2, b2))
    visual.append(drawImage(curImage, curBackground))
}
