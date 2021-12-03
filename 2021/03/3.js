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
 * 
 * @param {string[]} arr 
 * @param {boolean} most 
 * @returns {string}
 */
const significantReduce = (arr, most = true) => {
    let curArr = Array(...arr)
    let index = 0
    while (curArr.length > 1) {
        const count = curArr.reduce((acc, cur) => acc + parseInt(cur[index], 10), 0)
        const cond = most ? (count >= curArr.length/2) : (count < curArr.length/2)
        const char = cond ? '1' : '0'
        curArr = curArr.filter(i => i[index] === char)
        index++
    }
    return curArr[0]
}

const displayBlocks = (value, bgcolour, title) => {
    const chars = value.split('')
    const container = document.createElement('div')
    container.style.fontSize = 'x-large'
    container.style.fontFamily = 'monospace'

    const titleblock = document.createElement('span')
    titleblock.innerText = title
    
    chars.map((v, i) => {
        const block = document.createElement('div')
        block.style.outline = '.1em solid'
        block.style.backgroundColor = bgcolour
        block.style.display = 'inline-flex'
        block.style.justifyContent = 'center'
        block.style.textAlign = 'center'
        block.style.height = '1em'
        block.style.width = '1em'
        const text = document.createElement('div')
        text.innerText = v
        
        container.append(block)
        block.append(text)
        
        text.animate([
            {opacity: '0%'},
            {opacity: '100%'}
        ], {
            duration: 100 * (i + 1)
        })
    })
    container.append(titleblock)
    return container
}

solveBtn.onclick = () => {
    /** @type {string[]} bins */
    const bins = puzzleInput.value.trim().split('\n')

    const totals = bins.reduce(
        (acc, cur) => cur.split('').map((v, i) => parseInt(v, 10) + acc[i]
    ), Array(bins[0].length).fill(0))

    const g = totals.reduce((acc, cur) => acc + (cur > bins.length/2 ? '1' : '0'), '')

    const e = g.split('').map(i => i === '1' ? '0' : '1').join('')

    solution.innerText = `${g}, ${e}, ${parseInt(g, 2)*parseInt(e, 2)}`

    // part 2
    const o2 = significantReduce(bins)
    const co2 = significantReduce(bins, false)

    solution.innerText += `\nO2: ${o2}, CO2: ${co2}, SR: ${parseInt(o2,2)*parseInt(co2,2)}`
    
    // Visualise, somehow
    emptyNode(visual)
    visual.style.margin = '1em'
    visual.append(displayBlocks(g, 'green', ' G'))
    visual.append(displayBlocks(e, 'goldenrod', ' E'))
    visual.append(displayBlocks(o2, 'blue', ' O2'))
    visual.append(displayBlocks(co2, 'red', ' CO2'))
    
}