# Pretty much the same start as myself.
# Get the input commands and remove whitespace

# Reading bytes? Have to check if that changes the equation
"""
Not sure how reading bytes will change this. Might be a problem
since I'm on Python 3, but we'll have to see.
As far as I can tell, it is easier to work with strings,
but perhaps more efficient to work with bytes. Will 
have to see.
"""
raw_lines = open("input.txt", "rb").read()
glines = raw_lines.strip().split("\n")


# Basic function for identifying a number
# I use a regex for this, but this is more concise
def is_num(s):
    try:
        int(s)
    except:
        return False
    return True

# Get the value of a variable/number
# Useful to have is_num extracted to support this
def getval(regs, x):
    if is_num(x):
        return int(x)
    else:
        return regs[x]

# The toggling function
"""
Personally, I think my method here is more efficient, but
it comes down to personal taste. I have been trained to prefer
mappings to if statements.
"""
def toggle(tline):
    sp = tline.split(" ")

    instr = sp[0]
    if instr == "inc":
        return " ".join(["dec"] + sp[1:])
    elif instr == "dec" or instr == "tgl":
        return " ".join(["inc"] + sp[1:])
    elif instr == "jnz":
        return " ".join(["cpy"] + sp[1:])
    elif instr == "cpy":
        return " ".join(["jnz"] + sp[1:])
    else:
        assert False

# Big Run function. Arguably the heart of the application
def run(lines, part2=False):
    # pc = Program Counter = current line
    pc = 0
    regs = {"a": 7, "b": 0, "c": 0, "d": 0}
    if part2:
        regs["a"] = 12

    while True:
        # Break out of the global loop if we exceed the number of
        # command lines
        if pc >= len(lines):
            break
        line = lines[pc]

        # Instruction tracing to find the loop to optimize:
        #print pc, line

        """
        From my basic observation we are only optimising on certain commands
        Program counter is manually updated after each operation
        """

        a, b = line.split(" ", 1)

        """
        Copy: Always carried out
        Get the value of the second operator and replace
        the registry value with it
        Special condition for checking that the 2nd argument
        exists in the registry
        """
        if a == "cpy":
            b, c = b.split(" ")
            b = getval(regs, b)
            if c in regs:
                regs[c] = b
            else:
                print("invalid")
            pc += 1
            """
            This is where key optimisation takes place
            It works by recognising inner and outer loops
            There is a very specific pattern it is looking for
            """
        elif a == "inc":
            if b in regs:
                # Peephole optimize inc/dec/jnz loops

                # 4 cpy b c
                # 5 inc a          <<<< 0
                # 6 dec c          <<<< +1
                # 7 jnz c -2       <<<< +2
                # 8 dec d          <<<< +3
                # 9 jnz d -5       <<<< +4

                if pc + 3 < len(lines) and pc - 1 >= 0 and lines[pc-1].startswith("cpy ") and \
                    lines[pc+1].startswith("dec") and lines[pc+2].startswith("jnz") and \
                    lines[pc+3].startswith("dec") and lines[pc+4].startswith("jnz"):

                    incop = b

                    cpysrc, cpydest = lines[pc-1].split(" ")[1:]
                    dec1op = lines[pc+1].split(" ")[1]
                    jnz1cond, jnz1off = lines[pc+2].split(" ")[1:]
                    dec2op = lines[pc+3].split(" ")[1]
                    jnz2cond, jnz2off = lines[pc+4].split(" ")[1:]

                    if cpydest == dec1op and dec1op == jnz1cond and \
                        dec2op == jnz2cond and \
                        jnz1off == "-2" and jnz2off == "-5":
                            # inner loop:
                            # incop += cpysrc
                            # dec1op <- 0

                            # outer loop:
                            # dec2op times

                            # net result:  incop += (cpysrc * dec2op)
                            # dec1op, dec2op <- 0
                            regs[incop] += (getval(regs, cpysrc) * getval(regs, dec2op))
                            regs[dec1op] = 0
                            regs[dec2op] = 0
                            pc += 5
                            continue


                regs[b] += 1
            pc += 1
        elif a == "dec":
            if b in regs:
                regs[b] -= 1
            pc += 1
        elif a == "jnz":
            b, c = b.split(" ")
            b = getval(regs, b)
            c = getval(regs, c)
            if b != 0:
                pc = pc + int(c)
            else:
                pc += 1
        elif a == "tgl":
            xr = b
            x = getval(regs, xr)

            iidx = pc + x
            #print "tgl", x, iidx

            if iidx >= 0 and iidx < len(lines):
                tline = lines[iidx]
                lines[iidx] = toggle(tline)
                #print tline, "->", lines[iidx]
            pc += 1
        else:
            assert False

    return regs["a"]


# Run without optimisation for part 1
print("part 1:", run(glines[:]))

# Run with optimisation for part 2
print("part 2:", run(glines[:], part2=True))
