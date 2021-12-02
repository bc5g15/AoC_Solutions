const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

solveBtn.onclick = () => {
    const commands = puzzleInput.value.trim().split('\n').map(i => i.split(' '))

    let down = 0
    let across = 0

    let aim = 0
    let down2 = 0
    let across2 = 0

    const mods = {
        'down': (v) => { down +=v; aim += v },
        'forward': (v) => { across += v; across2 += v; down2 += (aim * v) },
        'up': (v) => { down -= v; aim -= v }
    }

    for (let [command, value] of commands) {
        let num = parseInt(value, 10)
        mods[command](num)
    }

    solution.innerText = `down: ${down} across: ${across} solution: ${down * across}\n down2: ${down2} across2: ${across2} solution: ${down2 * across2}`
}