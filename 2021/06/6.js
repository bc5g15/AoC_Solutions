const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const newFish = 8
const oldFish = 6

const nextDay = (oldArr) => {
    const newArr = [0,0,0,0,0,0,0,0,0]

    for (let i = 1; i < newArr.length; i++) {
        newArr[i-1] = oldArr[i]
    }

    // Update first day
    newArr[newFish] += oldArr[0]
    newArr[oldFish] += oldArr[0]
    return newArr
}

const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0)

solveBtn.onclick = () => {
    const fish = puzzleInput.value.trim().split(',').map(v => parseInt(v, 10))

    const atDayOne = [0,0,0,0,0,0,0,0,0]
    fish.forEach(v => atDayOne[v]++)

    let nowFish = atDayOne
    for (let i = 0; i<80; i++) {
        nowFish = nextDay(nowFish)
    }
    solution.innerText += `\n80 Days: ${sum(nowFish)}`

    let tooManyFish = atDayOne
    for (let i = 0; i<256; i++) {
        tooManyFish = nextDay(tooManyFish)
    }
    solution.innerText += `\n256 Days: ${sum(tooManyFish)}`

}