
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
        return regs.get(x, 0)

def setreg(i, regs, pc):
    x = i[1]
    y = getval(regs, i[2])
    regs[x] = y
    return pc + 1

def sub(i, regs, pc):
    x = i[1]
    y = getval(regs, i[2])
    regs[x] = regs.get(x, 0) - y
    return pc+1

def mult(i, regs, pc):
    x = i[1]
    y = getval(regs, i[2])
    regs[x] = regs.get(x, 0) * y
