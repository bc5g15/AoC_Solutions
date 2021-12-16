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

/** @param {[string]} log */
const displayLog = (log) => {
    const container = document.createElement('div')
    container.style.margin = '1em'
    container.style.fontFamily = 'monospace'
    container.style.fontWeight = 'bold'
    log.forEach(s => {
        const record = document.createElement('div')
        record.innerText = s
        container.append(record)
    })
    return container
}

const intToBin = (int) => {
    let value = int
    let response = ''
    while (value > 0) {
        response = (value % 2) + response
        value = Math.floor(value/2)
    }
    return response
}

const hex24bin = (hexchar) => {
    const value = parseInt(hexchar, 16)
    const bin = intToBin(value)
    return bin.padStart(4, '0')
}

/** @param {string} packet */
const readLiteral = (packet, startIndex) => {
    let index = startIndex
    const sr = (count) => {
        const result = packet.substring(index, index+count)
        index += count
        return result
    }

    let value = ''
    let bit = '1'
    do {
        bit = sr(1)
        value += sr(4)
    } while (bit === '1')
    return [parseInt(value, 2), index]
}

const parseBy = (bit, number, packet, startIndex, log) => {
    let index = startIndex
    const results = []

    let condition = bit === 0 ?
        () => index < startIndex + number :
        () => results.length < number
    
    while (condition()) {
        const {version, value, index: nextIndex} = consume(packet, index, log)
        index = nextIndex
        results.push({version, value, nextIndex, log})
    }

    return [results, index]
}

/**
 * @param {string} packet 
 */
const consume = (packet, startIndex, log) => {
    let index = startIndex
    const read = (count) => {
        const result = parseInt(packet.substring(index, index+count), 2)
        index = index+count
        return result
    }
    const version = read(3)
    const id = read(3)

    if (id === 4) {
        const [value, finalIndex] = readLiteral(packet, index)
        log.push(`Literal ${value}`)
        return {version, value, index: finalIndex, log}
    } 

    const ltid = read(1)

    const number = ltid === 0 ?
        read(15) :
        read(11)

    const [packs, nextIndex] = parseBy(ltid, number, packet, index, log)
    index = nextIndex
    const versionSum = packs.reduce((acc, cur) => cur.version + acc, 0) + version

    const operator = {
        0: (a, b) => a+b,
        1: (a, b) => a*b,
        2: (a, b) => Math.min(a, b),
        3: (a, b) => Math.max(a, b),
        5: (a, b) => a>b ? 1 : 0,
        6: (a, b) => a<b ? 1 : 0,
        7: (a, b) => a===b ? 1 : 0
    }
    const value = packs.map(p => p.value).reduce((acc, cur) => operator[id](acc, cur))

    const operatorName = {
        0: 'Sum',
        1: 'Product',
        2: 'Minimum',
        3: 'Maximum',
        5: 'Greater than?',
        6: 'Less than?',
        7: 'Equal to?'
    }

    log.push(`${operatorName[id]} ${packs.map(p => p.value).join(' ')} => ${value}`)

    return {version: versionSum, value, index, log}

}

solveBtn.onclick = () => {
    const hexIn = puzzleInput.value.trim()

    const binValue = hexIn.split('').map(hex24bin).join('')

    const {version, value, log} = consume(binValue, 0, [])

    solution.innerText = `Version Sum: ${version}`
    solution.innerText += `\nFinal Value: ${value}`

    // Visualise - sort of
    emptyNode(visual)
    visual.append(displayLog(log))
}