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

/**
 * @param {string} type 
 * @returns {SVGAElement}
 */
const svgMake = (type) => document.createElementNS('http://www.w3.org/2000/svg', type)

const viewGraph = (graph) => {
    const svg = svgMake('svg')
    svg.setAttribute('height', 300)
    svg.setAttribute('width', 300)
    const r = 100

    const rooms = Object.keys(graph)
    const points = {}
    rooms.forEach((v, i) => {
        const x = (Math.sin(Math.PI * 2 * i / rooms.length) * r) + 150
        const y = (-Math.cos(Math.PI * 2 * i / rooms.length) * r) + 150
        points[v] = [x,y]
    })

    /**
     * @param {string} name 
     * @returns {[string, string]}
     */
    const colourMaps = (name) => {
        if (name === 'start') {
            return ['red', 'red']
        } else if (name === 'end') {
            return ['green', 'green']
        } else if (name.toLocaleLowerCase() === name) {
            return ['black', 'blue']
        } else {
            return ['blue', 'blue']
        }
    }

    const lines = []
    const circles = []

    // Now iterate again to draw the points and lines
    rooms.forEach(v => {
        const circ = svgMake('circle')
        const [x, y] = points[v]
        circ.setAttribute('cx', x)
        circ.setAttribute('cy', y)
        circ.setAttribute('r', 10)

        const [fill, stroke] = colourMaps(v)

        circ.style.fill = fill
        circ.style.stroke = stroke
        circ.style.strokeWidth = '2px'

        const connections = graph[v]
        connections.forEach(w => {
            const [x2, y2] = points[w]
            const line = svgMake('line')
            line.style.stroke = 'white'
            line.style.strokeWidth = '4px'
            line.setAttribute('x1', x)
            line.setAttribute('x2', x2)
            line.setAttribute('y1', y)
            line.setAttribute('y2', y2)
            lines.push(line)
        })

        const text = svgMake('text')
        text.style.fill = 'blue'
        text.innerHTML = '?'
        circ.append(text)
        circles.push(circ)

    })
    svg.append(...lines)
    svg.append(...circles)
    return svg
}

const traverse = (graph, extra=false) => {
    const paths = []
    paths.push(['start', new Set(), false])

    const finishedPaths = []

    while(paths.length > 0) {
        const [currentNode, seen, plusNode] = paths.pop()

        if (currentNode === 'end') {
            finishedPaths.push([currentNode, seen])
            continue
        }
        const nowSeen = new Set(seen)
        if (currentNode === currentNode.toLocaleLowerCase()) nowSeen.add(currentNode)

        const newPaths = []
        for (let newNode of graph[currentNode]) {
            if (newNode === 'start') continue
            if ((seen.has(newNode) && !extra) ||
                (seen.has(newNode) && plusNode)) {
                continue
            } else if (seen.has(newNode) && !plusNode) {
                newPaths.push([newNode, nowSeen, true])
            } else {

                newPaths.push([newNode, nowSeen, plusNode])
            }
        }
        paths.push(...newPaths)
    }

    return finishedPaths
}

const makeGraph = (link) => {
    const map = {}
    const addOrPush = (key, value) => {
        if (map[key]) {
            map[key].push(value)
        } else {
            map[key] = [value]
        }
    }
    for (let [start, end] of link) {
        addOrPush(start, end)
        addOrPush(end, start)
    }

    return map
}

solveBtn.onclick = () => {
    /** @type {[string, string][]} */
    const links = puzzleInput.value.trim().split('\n').map(l => l.split('-'))

    const graph = makeGraph(links)

    const paths = traverse(graph)

    solution.innerText = `Paths Found: ${paths.length}`

    const paths2 = traverse(graph, true)

    solution.innerText += `\nLonger Paths: ${paths2.length}`

    // Have a stab at drawing the graph
    emptyNode(visual)
    visual.append(viewGraph(graph))
}