const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

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
    console.log(charMap)
    console.log(chars)
    console.log(output)
    return output.map(v => {
        const vset = new Set(v)
        return charMap.find(([s,_]) => symmetricDifference(s,vset).size === 0)[1]
    })
}

solveBtn.onclick = () => {
    // Separate this out for the visualisation
    const codes = puzzleInput.value.trim().split('\n').map(v => v.split(' | ').map(w => w.split(' ')))
    

    const check1478 = codes.flatMap(([_, b]) => b).filter(v => [2,4,3,7].includes(v.length)).length

    solution.innerText = `1, 4, 7 or 8 output values: ${check1478}`

    const values = codes.map(v => parseInt(deduce(v).join('')))
    const finalSum = values.reduce((acc, cur) => acc + cur, 0)
    solution.innerText += `\nOutput Sum: ${finalSum}`
}