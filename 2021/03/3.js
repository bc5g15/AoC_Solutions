const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

solveBtn.onclick = () => {
    /** @type {string[]} bins */
    const bins = puzzleInput.value.trim().split('\n')
    console.log(bins)

    const totals = bins.reduce(
        (acc, cur) => cur.split('').map((v, i) => parseInt(v, 10) + acc[i]
    ), Array(bins[0].length).fill(0))

    console.log(totals)

    const g = totals.reduce((acc, cur) => acc + (cur > bins.length/2 ? '1' : '0'), '')

    const e = g.split('').map(i => i === '1' ? '0' : '1').join('')

    console.log(g, e)

    solution.innerText = `${g}, ${e}, ${parseInt(g, 2)*parseInt(e, 2)}`

}