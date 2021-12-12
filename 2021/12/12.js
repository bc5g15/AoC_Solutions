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
}