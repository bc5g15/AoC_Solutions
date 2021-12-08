const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

// acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab cdfeb fcadb cdfeb cdbaf

/*
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
*/

// top, left, right, middle, left, right, bottom
const digitCodes = {
    '1110111': 0, 
    '0010010': 1, 
    '1011101': 2, 
    '1011011': 3, 
    '0111010': 4, 
    '1101011': 5, 
    '1101111': 6, 
    '1010010': 7, 
    '1111111': 8, 
    '1111011': 9  
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

const findKnownValues = (codes) => {
    const charsets = codes.map(v => new Set(v))
    const findCode = (l) => charsets.filter(s => s.size === l)
    const one = findCode(2)
    const seven = findCode(3)
    const four = findCode(4)
    const eight = findCode(7)

    // Get top segment
    const topChar = [...difference(one, seven)][0]
}

solveBtn.onclick = () => {
    // Separate this out for the visualisation
    const codes = puzzleInput.value.trim().split('\n').map(v => v.split(' | ').map(w => w.split(' ')))
    

    const check1478 = codes.flatMap(([_, b]) => b).filter(v => [2,4,3,7].includes(v.length)).length

    solution.innerText = `1, 4, 7 or 8 output values: ${check1478}`


}