const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

/**
 * 
 * @param {string[]} arr 
 * @param {boolean} most 
 * @returns 
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
    

}