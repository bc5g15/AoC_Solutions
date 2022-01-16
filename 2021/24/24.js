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

const alphabet = 'abcdefghijklmnopqrstuv'

/*
If a chunk is considered to be a series of instructions from in `inp`
command up until before the next `inp`, then they are all pretty much
the same

It becomes a series of 18 instructions, always with the same commands
Only in some cases are the second operands different

01: inp w
02: mul x 0
03: add x z
04: mod x 26
05: div z (?)
06: add x (?)
07: eql x w
08: eql x 0
09: mul y 0
10: add y 25
11: mul y x
12: add y 1
13: mul z y
14: mul y 0
15: add y w
16: add y (?)
17: mul y x
18: add z y

So only instructions 5, 6 and 16 will ever vary, and those only in specific ways

I should be able to think about the problem in terms of chunks more easily than individual instructions

We can go further than this:
05 will only ever have the parameter 26 or 1
06 and 16 seem a little more random, but 16 will always be positive

So, let's see if we can parse down what is happening

w = inp
x = z % 26
if (shrinkz) z = z/26
x += (?)
(so x = (?) + (z % 26))
if (A + (z % 26) === inp) {
    x = 0
    y = 0
} else {
    z = (z * 26) + inp + B
}

Since x and y (and w for that matter) are blanked before use the only value that is carried
forward is z.

So the only values that can vary are the input for each chunk, the z divisor, the x increment and the y increment. Plus, everything apart from the chunk input is set.

So let's look at it on a chunk by chunk basis

01: {zdiv: 01, xadd: 12, yadd: 09} 
02: {zdiv: 01, xadd: 12, yadd: 04}
03: {zdiv: 01, xadd: 12, yadd: 02}
04: {zdiv: 26, xadd: -9, yadd: 05}
05: {zdiv: 26, xadd: -9, yadd: 01}
06: {zdiv: 01, xadd: 14, yadd: 06}
07: {zdiv: 01, xadd: 14, yadd: 11}
08: {zdiv: 26, xadd: -10, yadd: 15}
09: {zdiv: 01, xadd: 15, yadd: 07}
10: {zdiv: 26, xadd: -2, yadd: 12}
11: {zdiv: 01, xadd: 11, yadd: 15}
12: {zdiv: 26, xadd: -15, yadd: 09}
13: {zdiv: 26, xadd: -9, yadd: 12}
14: {zdiv: 26, xadd: -3, yadd: 12}

It is a little bit surreal but we can consider the logic of the divisor to be equivalent to a push and a pop. So when the div is 1, we push, when it is 26 we pop.

For the above code xadd is A and yadd is B

Let's break it down in the push, pop model. Remember, the goal is for the whole thing to equal 0.

The goal in thee above function is for the (A + (z % 26)) check to always return true, so these constraints should help with that.

A   == i0 + 9
B   == i1 + 4
C   == i2 + 2
i3  == C - 9
i4  == B - 9
D   == i5 + 14
E   == i6 + 14
i7  == E - 10
F   == i8 + 7
i9  == F - 2
G   == i10 + 15
i11 == G - 15
i12 == D - 9
i13 == A - 3

I'm pretty sure that is correct. Let's boil it all together by replacing the variables
i3  == (i2 + 2) - 9
i4  == (i1 + 4) - 9
i7  == (i6 + 14) - 10
i9  == (i8 + 7) - 2
i11 == (i10 + 15) - 15
i12 == (i5 + 14) - 9
i13 == (i0 + 9) - 3

i3  = i2 - 7
i4  = i1 - 5
i7  = i6 + 4
i9  = i8 + 5
i11 = i10
i12 = i5 + 5
i13 = i0 + 6

So, to solve this, all i-value must be in the range 1-9. We want the maximum value. 
I think I can just plug the numbers in

i2 = 9  i3 = 2
i1 = 9  i4 = 4
i6 = 5  i7 = 9
i8 = 4  i9 = 9
i10 = 9 i11 = 9
i5 = 4  i12 = 9
i0 = 3  i13 = 9

Lets put this all together
i0 = 3
i1 = 9
i2 = 9
i3 = 2
i4 = 4
i5 = 4
i6 = 5
i7 = 9
i8 = 4
i9 = 9
i10 = 9
i11 = 9
i12 = 9
i13 = 9

So
39924459499999
39924489499999

// This is too low. What am I doing wrong?

Let's go back to the drawing board to test this. I should build the program that actually  resolves this

For the input I have
01: {zdiv: 01, xadd: 12, yadd: 09}  // push 3 + 9 = 12
02: {zdiv: 01, xadd: 12, yadd: 04}  // push 9 + 4 = 13
03: {zdiv: 01, xadd: 12, yadd: 02}  // push 9 + 2 = 11
04: {zdiv: 26, xadd: -9, yadd: 05}  // pop 11 - 2 = 2 (correct)
05: {zdiv: 26, xadd: -9, yadd: 01}  // pop 13 - 9 = 4 (correct)
06: {zdiv: 01, xadd: 14, yadd: 06}  // push 4 + 6 = 10 (?)
07: {zdiv: 01, xadd: 14, yadd: 11}  // push 5 + 11 = 16
08: {zdiv: 26, xadd: -10, yadd: 15} // pop 16 - 10 = 6 (wrong)
09: {zdiv: 01, xadd: 15, yadd: 07}
10: {zdiv: 26, xadd: -2, yadd: 12}
11: {zdiv: 01, xadd: 11, yadd: 15}
12: {zdiv: 26, xadd: -15, yadd: 09}
13: {zdiv: 26, xadd: -9, yadd: 12}
14: {zdiv: 26, xadd: -3, yadd: 12}

Maybe I'm thinking about it the wrong way. Let's try and get the highest values I can

01: {zdiv: 01, xadd: 12, yadd: 09}  // push 3 + 9 = 12
02: {zdiv: 01, xadd: 12, yadd: 04}  // push 9 + 4 = 13
03: {zdiv: 01, xadd: 12, yadd: 02}  // push 9 + 2 = 11
04: {zdiv: 26, xadd: -9, yadd: 05}  // pop 11 - 9 = 2 (required digit is 2 for prev 9)
05: {zdiv: 26, xadd: -9, yadd: 01}  // pop 13 - 9 = 4 (required digit 4)
06: {zdiv: 01, xadd: 14, yadd: 06}  // push 4 + 14 = 17 (?)
07: {zdiv: 01, xadd: 14, yadd: 11}  // push 8 + 11 = 19 (?) (Legal)
08: {zdiv: 26, xadd: -10, yadd: 15} // pop 19 - 10 = 9 
09: {zdiv: 01, xadd: 15, yadd: 07}  // push 4 + 7 = 11
10: {zdiv: 26, xadd: -2, yadd: 12}  // pop 11 - 2 = 9 
11: {zdiv: 01, xadd: 11, yadd: 15}  // push 9 + 15 = 24 (?)
12: {zdiv: 26, xadd: -15, yadd: 09} // pop 24 - 15 = 9
13: {zdiv: 26, xadd: -9, yadd: 12}  // pop 18 - 9 = 9
14: {zdiv: 26, xadd: -3, yadd: 12}  // pop 12 - 3 = 9

So the new number would be
39924489499999
Still too low!

Is my reading of my instructions wrong? Not impossible. I'll have to write it out again

push    x:-     y:9     // 3+9 = 12     3
push    x:-     y:4     // 9+4 = 13     9
push    x:-     y:2     // 9+2 = 11     9
pop     x:-9    y:-     // 11 - 9 = 2   2
pop     x:-9    y:-     // 13 - 9 = 4   4
push    x:-     y:6     // 9 + 6 = 15   9
push    x:-     y:11    // 8 + 11 = 19  8
pop     x:-10   y:-     // 19 - 10 = 9  9
push    x:-     y:7     // 4 + 7 = 11   4
pop     x:-2    y:-     // 11 - 2 = 9   9
push    x:-     y:15    // 9 + 15 = 24  9
pop     x:-15           // 24 - 15 = 9  9
pop     x:-9            // 15 - 9 = 6   6
pop     x:-3            // 12 - 3 = 9   9

39924489499999
39924989499969

I got it!

Now I need the same logic but for the smallest legal values

push    x:-     y:9     // 1+9 = 10     1
push    x:-     y:4     // 6+4 = 10     6
push    x:-     y:2     // 8+2 = 10     8
pop     x:-9    y:-     // 10 - 9 = 1   1
pop     x:-9    y:-     // 10 - 9 = 1   1
push    x:-     y:6     // 4 + 6 = 10   4
push    x:-     y:11    // 1 + 11 = 12  1
pop     x:-10   y:-     // 12 - 10 = 2  2
push    x:-     y:7     // 1 + 7 = 8    1
pop     x:-2    y:-     // 8 - 2 = 6    6
push    x:-     y:15    // 1 + 15 = 16  1
pop     x:-15           // 16 - 15 = 1  1
pop     x:-9            // 10 - 9 = 1   1
pop     x:-3            // 10 - 3 = 7   7

16811412161117

*/
const runChunk = (instructions, inputDigit, state) => {
    // 4 5 15
    const zdiv = parseInt(instructions[4][2], 10)
    const xadd = parseInt(instructions[5][2], 10)
    const yadd = parseInt(instructions[15][2], 10)

    let z = state.z
    z = Math.floor(z / zdiv)
    if ((z % 26) + xadd === inputDigit) {
        return z
    } else {
        return (z * 26) + inputDigit + yadd
    }
}

const execute = (instructions, inputs) => {

    const startState = {
        w: 0,
        x: 0,
        y: 0,
        z: 0
    }

    const vars = 'wxyz'

    let index = 0
    const run = (instruction, state) => {
        const newState = {...state}
        const [code, operand1, operand2] = instruction

        const getValue = (n) => {
            if (vars.includes(n)){
                return newState[n]
            } else {
                return parseInt(n, 10)
            }
        }

        const ops = {
            'add': (a, b) => a + b,
            'mul': (a, b) => a * b,
            'eql': (a, b) => a === b ? 1 : 0,
            'div': (a, b) => Math.floor(a/b),
            'mod': (a, b) => a % b
        }

        const value1 = newState[operand1]

        if (code === 'inp') {
            const newValue = parseInt(inputs[index], 10)
            newState[operand1] = newValue
            console.log(state, newValue)
            index++
            return [true, newState]
        }

        const value2 = getValue(operand2)

        const sensitive = ['div', 'mod']
        if (sensitive.includes(code) && value2 === 0) return [false]

        newState[operand1] = ops[code](value1, value2)
        return [true, newState]
    }

    let state = startState
    for (let instruction of instructions) {
        const [valid, newState] = run(instruction, state)
        if (!valid) {
            console.error('Attempted something by 0')
            return -1
        }
        state = newState
    }

    return state
}

const displayChunks = (instructions) => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    let currentRow = 0
    let currentColumn = 1

    const rowMemory = {}

    for (const [code, op1, op2] of instructions) {
        const cell = document.createElement('div')
        if (code === 'inp') {
            currentRow = 0
            currentColumn++
        }
        currentRow++
        cell.style.gridRow = currentRow
        cell.style.gridColumn = currentColumn

        const instructionString = `${code} ${op1} ${op2 ?? ''}`

        if (currentRow in rowMemory) {
            if (instructionString !== rowMemory[currentRow]) {
                cell.style.textDecoration = 'underline'
            }
        } else {
            rowMemory[currentRow] = instructionString
        }

        cell.innerText = instructionString
        container.append(cell)
    }
    return container
}

solveBtn.onclick = () => {
    const instructions = puzzleInput.value.trim().split('\n').map(v => v.split(' '))

    console.log(execute(instructions, '39924989499969'))
    console.log(execute(instructions, '16811412161117'))
    // console.log(execute(instructions, '99999495442993'))
    
    // Instruction: opcode operand1 operand2

    // Visualise for debug
    emptyNode(visual)
    visual.append(displayChunks(instructions))


}