# Second attempt at solving the puzzle

# Get the input
with open("in.txt", 'r') as f:
    glines = f.readlines()

def is_num(s):
    try:
        int(s)
    except:
        return False
    return True

def getval(regs, x):
    if is_num(x):
        return int(x)
    else:
        return regs[x]

def dec(i, lines, regs, pc):
    b = i[1]
    if b in regs:
        regs[b] -= 1
    return pc + 1

def cpy(i, lines, regs, pc):
    b, c = i[1:]
    b = getval(regs, b)
    if c in regs:
        regs[c] = b
    else:
        print("invalid")
    return pc + 1

def jnz(i, lines, regs, pc):
    b = getval(regs, i[1])
    c = getval(regs, i[2])
    if b != 0:
        return pc + c
    else:
        return pc + 1

toggle = {
    "inc": "dec",
    "dec": "inc",
    "jnz": "cpy",
    "cpy": "jnz",
    "tgl": "inc"
}

def tgl(i, lines, regs, pc):
    x = getval(regs, i[1])
    dx = pc + x

    if dx >= 0 and dx <len(lines):
        ti = lines[dx].strip().split()
        ti[0] = toggle[ti[0]]
        lines[dx] = " ".join(ti)
    
    return pc + 1

"""
This is where optimisation takes place
"""
def inc(i, lines, regs, pc):
    b = i[1]
    if b in regs:
        # Start checking for operation
        
        # 4 cpy b c
        # 5 inc a       <<<< 0
        # 6 dec c       <<<< +1
        # 7 jnz c -2    <<<< +2
        # 8 dec d       <<<< +3
        # 9 jnz d -5    <<<< +4
    
        if pc + 3 < len(lines) and pc - 1 >= 0 and lines[pc-1].startswith("cpy") and \
            lines[pc+1].startswith("dec") and lines[pc+2].startswith("jnz") and \
            lines[pc+3].startswith("dec") and lines[pc+4].startswith("jnz"):

            incop = b

            cpysrc, cpydest = lines[pc-1].split()[1:]
            dec1op = lines[pc+1].split()[1]
            jnz1cond, jnz1off = lines[pc+2].split()[1:]
            dec2op = lines[pc+3].split()[1]
            jnz2cond, jnz2off = lines[pc+4].split()[1:]

            if cpydest == dec1op and dec1op == jnz1cond and\
                dec2op == jnz2cond and \
                jnz1off == "-2" and jnz2off == "-5":

                regs[incop] += (getval(regs, cpysrc) * getval(regs, dec2op))
                regs[dec1op] = 0
                regs[dec2op] = 0
                return pc + 5
        else:
            regs[b] += 1
            return pc + 1

funs = {
    "cpy": cpy,
    "inc": inc,
    "dec": dec,
    "jnz": jnz,
    "tgl": tgl
}

def run(lines, snd=False):
    pc = 0
    regs = {"a": 7, "b":0, "c": 0, "d": 0}
    if snd:
        regs["a"] = 12
    while True:
        inst = lines[pc].strip().split(" ")
        a = inst[0]
        pc = funs[a](inst, lines, regs, pc)
        if(pc>=len(lines)):
            break
    
    print(regs)

run(list(glines))

run(list(glines), True)