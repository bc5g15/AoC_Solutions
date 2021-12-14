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

const displayPairs = (pairs) => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    container.style.gridTemplateColumns = '1fr 5fr'
    container.style.width = 'fit-content'
    container.style.fontFamily = 'monospace'
    container.style.fontWeight = 'bold'
    container.style.margin = '1em'

    let i = 0
    for (let key in pairs) {
        const value = pairs[key]
        i++
        const textDiv = document.createElement('div')
        textDiv.style.gridRow = i
        textDiv.style.gridColumn = 1
        textDiv.innerText = key
        
        const valueDiv = document.createElement('div')
        valueDiv.style.gridRow = i
        valueDiv.style.gridColumn = 2
        valueDiv.style.textAlign = 'right'
        valueDiv.innerText = value
        
        container.append(textDiv, valueDiv)
    }

    return container
}

const getPairs = (template) => {
    const pairs = {}
    const addOrInc = (l) => {
        if (l in pairs) {
            pairs[l] += 1
        } else {
            pairs[l] = 1
        }
    }
    for (let i = 1; i < template.length; i++) {
        const code = template[i-1] + template[i]
        addOrInc(code)
    }
    return pairs
}

const pairStep = (pairs, ruleMap) => {
    const newPairs = {}
    const addOrMake = (pair, i) => {
        if (pair in newPairs) {
            newPairs[pair] += i
        } else {
            newPairs[pair] = i
        }
    }
    for (let pair in pairs) {
        const count = pairs[pair]
        if (pair in ruleMap) {
            const letter = ruleMap[pair]
            const code1 = pair[0] + letter
            const code2 = letter + pair[1]
            addOrMake(code1, count)
            addOrMake(code2, count)
        } else {
            addOrMake(pair, count)
        }
    }
    return newPairs
}

const countPairLetters = (pairs, leftLetter, rightLetter) => {
    // Need this as everthing else is counted twice
    const letters = {}
    letters[leftLetter] = 1
    letters[rightLetter] = 1

    const addOrMake = (l, v) => {
        if (l in letters) {
            letters[l] += v
        } else {
            letters[l] = v
        }
    }

    for (let pair in pairs) {
        const count = pairs[pair]
        addOrMake(pair[0], count)
        addOrMake(pair[1], count)
    }

    // Halve the results so the numbers are correct
    for (let letter in letters) {
        letters[letter] /= 2
    }

    return letters
}

const step = (template, ruleMap) => {
    let newTemplate = ''
    for (let i = 1; i < template.length; i++) {
        const code = template[i-1] + template[i]
        newTemplate += template[i-1]
        if (code in ruleMap) {
            newTemplate += ruleMap[code]
        }
    }
    newTemplate += template[template.length -1]
    return newTemplate
}

const letterCounts = (template) => {
    const counts = {}
    const addOrInc = (l) => {
        if (l in counts) {
            counts[l] += 1
        } else {
            counts[l] = 1
        }
    }
    template.split('').forEach(l => {
        addOrInc(l)
    })

    return counts
}

solveBtn.onclick = () => {
    const [template, codes] = puzzleInput.value.trim().split('\n\n')

    const ruleMap = {}
    codes.split('\n').map(v => v.split(' -> ')).forEach(([r, v]) => ruleMap[r] = v)

    let newTemplate = template
    let i = 0
    while(i < 10) {
        i++
        newTemplate = step(newTemplate, ruleMap)
    }

    const counts = letterCounts(newTemplate)
    const countN = Object.entries(counts).map(([_a, b]) => b).sort((a, b) => a-b)
    const least = countN[0]
    const most = countN[countN.length-1]

    solution.innerText = `Part 1: ${most - least}`

    // Try a more efficient approach for part 2
    let pairs = getPairs(template)

    for (let j = 0; j<40; j++) {
        pairs = pairStep(pairs, ruleMap)
    }

    const leftLetter = template[0]
    const rightLetter = template[template.length-1]

    const finalCounts = Object.entries(countPairLetters(pairs, leftLetter, rightLetter)).sort(([_x, a], [_y, b]) =>  a-b)

    const minLetter = finalCounts[0]
    const maxLetter = finalCounts[finalCounts.length-1]

    solution.innerText += `\nPart 2: ${maxLetter[1] - minLetter[1]}`
    
    // Lazy Visualisation
    emptyNode(visual)
    visual.append(displayPairs(pairs))
}