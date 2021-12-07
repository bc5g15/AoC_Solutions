const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const positionCost = (x, positions) => positions.map(v => Math.abs(v-x)).reduce((acc, cur) => acc+cur, 0)

solveBtn.onclick = () => {
    const positions = puzzleInput.value.trim().split(',').map(v => parseInt(v, 10)).sort((a,b) => (a-b))

    const minPos = positions[0]
    const maxPos = positions[positions.length-1]

    console.log(minPos, maxPos)

    const pwCost = positions.map(v => [v, positionCost(v, positions)]).sort(([_,a], [__,b]) => (a - b))

    console.log(pwCost)

    solution.innerText = `Position: ${pwCost[0][0]} Cost: ${pwCost[0][1]}`

}