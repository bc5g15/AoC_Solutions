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

const visualRatio = 3

const makeBit = (width, height, left, top) => {
    const bit = document.createElement('div')
    bit.style.width = width
    bit.style.height = height
    bit.style.left = left
    bit.style.top = top
    bit.style.backgroundColor = 'white'
    bit.style.position = 'absolute'
    return bit
}

const makeCell = (cellString) => {

    const root = document.createElement('div')
    root.style.position = 'relative'
    root.style.width = `${visualRatio+2}em`
    root.style.height = `${visualRatio*2+3}em`
    root.style.margin = '1em'

    const vrString = `${visualRatio}em`
    const midString = `${1+visualRatio}em`
    const blr = `${2+visualRatio}em`
    const bottomString = `${2+(2*visualRatio)}em`

    const qm = (width, height, left, top) => root.append(makeBit(width, height, left, top))

    if (cellString.includes('a')) qm(vrString, '1em', '1em', '0')
    if (cellString.includes('b')) qm('1em', vrString, '0', '1em')
    if (cellString.includes('c')) qm('1em', vrString, `${1+visualRatio}em`, '1em')
    if (cellString.includes('d')) qm(vrString, '1em', '1em', midString)
    if (cellString.includes('e')) qm('1em', vrString, '0', blr)
    if (cellString.includes('f')) qm('1em', vrString, midString, blr)
    if (cellString.includes('g')) qm(vrString, '1em', '1em', bottomString)
    
    return root
}

// acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf

const makeDisplay = ([chars, output]) => {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.append(...chars.map(v => makeCell(v)))

    const blocker = document.createElement('div')
    blocker.style.height = `${visualRatio*2+3}em`
    blocker.style.width = '1em'
    blocker.style.backgroundColor = 'white'
    blocker.style.margin = '.5em'
    container.append(blocker)

    container.append(...output.map(v => makeCell(v)))

    return container
}

const manyDisplays = (displayList) => {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.append(...displayList.map(v => makeDisplay(v)))
    return container
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function symmetricDifference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem)
        } else {
            _difference.add(elem)
        }
    }
    return _difference
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}


/**
 * @param {string[]} codes 
 */
const findKnownValues = (codes) => {
    const charsets = codes.map(v => [v, new Set(v)])
    const findByLength = (l) => charsets.find(([_, s]) => s.size === l)

    const one = findByLength(2)
    const seven = findByLength(3)
    const four = findByLength(4)
    const eight = findByLength(7)

    const findSetDiff = (choices, subtractor, size) => choices.find(([_,s]) => difference(s, subtractor[1]).size === size)
    const p235 = charsets.filter(([v, _]) => v.length === 5)
    const three = findSetDiff(p235, seven, 2)

    const p096 = charsets.filter(([v,_]) => v.length === 6)
    const nine = findSetDiff(p096, four, 2)
    const two = findSetDiff(p235, nine, 1)
    const six = findSetDiff(p096, one, 5)

    const five = p235.find(([v,_]) => ![two[0], three[0]].includes(v))
    const zero = p096.find(([v,_]) => ![six[0], nine[0]].includes(v))

    const results = [zero,one,two,three,four,five,six,seven,eight,nine]
    return results.map(([_v, s], i) => [s, i])
}

const deduce = ([chars, output]) => {
    const charMap = findKnownValues(chars)
    return output.map(v => {
        const vset = new Set(v)
        return charMap.find(([s,_]) => symmetricDifference(s,vset).size === 0)[1]
    })
}

solveBtn.onclick = () => {
    const codes = puzzleInput.value.trim().split('\n').map(v => v.split(' | ').map(w => w.split(' ')))

    const check1478 = codes.flatMap(([_, b]) => b).filter(v => [2,4,3,7].includes(v.length)).length

    solution.innerText = `1, 4, 7 or 8 output values: ${check1478}`

    const values = codes.map(v => parseInt(deduce(v).join('')))
    const finalSum = values.reduce((acc, cur) => acc + cur, 0)
    solution.innerText += `\nOutput Sum: ${finalSum}`

    // Visualise
    emptyNode(visual)
    visual.append(manyDisplays(codes))
}