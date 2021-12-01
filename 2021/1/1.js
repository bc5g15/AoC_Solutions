const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')

const measureIncreases = (numbers) => {
    let count = 0
    for (let i = 1; i < numbers.length; i++) {
        const prev = numbers[i-1]
        const now = numbers[i]
        if (prev < now) {
            count++
        }
    }
    return count
}

solveBtn.onclick = () => {
    const depths = puzzleInput.value.split('\n').map(i => parseInt(i.trim(), 10))

    // Count number of times a measurement increases
    let count = 0;
    for (let i = 1; i < depths.length; i++) {
        const prev = depths[i-1]
        const now = depths[i]
        if (prev < now) {
            count++
        }
    }

    solution.innerText = count

    // Part 2

    const windows = []

    for (let i = 1; i < depths.length-1; i++) {
        windows.push(depths[i] + depths[i-1] + depths[i+1])
    }

    const count2 = measureIncreases(windows)

    solution.innerText += `\t new: ${count2}`
}