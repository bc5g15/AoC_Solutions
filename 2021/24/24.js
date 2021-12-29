const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

const alphabet = 'abcdefghijklmnopqrstuv'

const readInst = (instr, state) => {
    // What does JS do if I just read the input into a lambda?
    // Nothing useful, unless I'm intending to run it

    const newState = {...state}
    // Let's try reading things as strings for now
    const [code, op1, op2] = instr
    const vars = ['w','x','y','z']

    // Op1 will always be a variable name
    // Op2 might be a name or a numeric literal

    const checkValue = (n) => {
        if (vars.includes(n)) {
            return newState[n]
        } else {
            return n
        }
    }

    const bifun = (symbol) =>{
        const a = newState[op1]
        const b = checkValue(op2)
        return `(${a}${symbol}${b})`
    } 
        

    switch (code) {
        case 'inp':
            const letter = alphabet[state.next]
            newState[op1] = letter
            newState.next = state.next+1 
            break
        case 'add':
            newState[op1] = bifun('+')
            break
        case 'mul':
            newState[op1] = bifun('*')
            break
        case 'div':
            newState[op1] = bifun('/')
            break
        case 'mod':
            newState[op1] = bifun('%')
            break
        case 'eql':
            // Here's where it gets messy
            const a = newState[op1]
            const b = checkValue(op2)
            newState[op1] = `${a}===${b} ? 1 : 0`
            break
    }

    return newState
}

const altRead = (instr, state) => {
    const ns = {...state}

    const [code, op1, op2] = instr
    const vars = ['w','x','y','z']
    
}

solveBtn.onclick = () => {
    const instructions = puzzleInput.value.trim().split('\n').map(v => v.split(' '))
    
    // Instruction: opcode operand1 operand2

    const tempList = instructions.slice()
    let state = {w:0, x:0, y:0, z:0, next:0}
    while(tempList.length > 0) {
        const cur = tempList.shift()
        state = readInst(cur, state)
        console.log(state)
    }
    console.log(state)


}