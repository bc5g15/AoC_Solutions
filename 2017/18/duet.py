

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
        return regs.get(x, 0)

"""
Commands:
snd X - plays sound : Think about how to store
set X Y - set register x to the value of y
add x y - increase register x by value of y
"""

def setreg(i, lines, regs, pc, qu):
    x = i[1]
    y = i[2]
    regs[x] = getval(regs, y)
    return pc + 1

def add(i, lines, regs, pc, qu):
    x = i[1]
    y = i[2]
    regs[x] = regs.get(x,0) + getval(regs, y)
    return pc + 1

def mult(i, lines, regs, pc, qu):
    x = i[1]
    y = i[2]
    regs[x] = regs.get(x,0) * getval(regs, y)
    return pc + 1

def modul(i, lines, regs, pc, qu):
    x = i[1]
    y = i[2]
    regs[x] = regs.get(x, 0) % getval(regs, y)
    return pc + 1

def jgz(i, lines, regs, pc, qu):
    x = i[1]
    y = i[2]
    if getval(regs, x) > 0:
        return pc + getval(regs, y)
    else:
        return pc + 1

def sound(i, lines, regs, pc, qu):
    x = i[1]
    regs["sound"] = getval(regs, x)
    return pc + 1

def recover(i, lines, regs, pc, qu):
    return len(lines) + 1

def send(i, lines, regs, pc, qu):
    x = i[1]
    cur = qu["cur"]
    oth = other(qu["cur"])
    qu[oth].append(getval(regs, x))
    qu["l" + str(oth + 1)] = True
    qu["s" + str(cur+1)] += 1
    return pc + 1

def recv(i, lines, regs, pc, qu):
    x = i[1]
    cur = qu["cur"]
    if len(qu[cur]) > 0:
        regs[x] = qu[cur].pop(0)
        return pc + 1
    else:
        qu["l"+str(cur+1)] = False
        return pc

def other(i):
    output =  1 if i==0 else 0
    return output
    
def otherlife(i):
    output =  "l1" if i==0 else "l0"
    return output

funs = {
  "set": setreg,
  "add": add,
  "mul": mult,
  "mod": modul,
  "jgz": jgz,
  "snd": sound,
  "rcv": recover
        }

def run(lines, part2=False):
    if not part2:
        pc = 0
        regs = {}
        while pc < len(lines):
            inst = lines[pc].strip().split(" ")
            a = inst[0]
            # Use a function map
            pc = funs[a](inst, lines, regs, pc, qu)
        print(regs["sound"])
    else:
        funs["snd"] = send
        funs["rcv"] = recv
        progs = {}
        state1 = {"pc":0, "regs":{"p": 0}}
        state2 = {"pc":0, "regs":{"p": 1}}
        progs[0] = state1
        progs[1] = state2
        qu = {0: [], 1: [], "l1":True, "l2":True, "s1":0, "s2":0, "cur":1}
        current = 1
        while qu["l1"] or qu["l2"]:
            current = 0 if qu["l1"] else 1
            qu["cur"] = current
            inst = lines[progs[current]["pc"]].strip().split(" ")
            a = inst[0]
            progs[current]["pc"] = funs[a](inst, lines, progs[current]["regs"], progs[current]["pc"], qu)
        print(qu)

#run(glines)
run(glines, part2=True)

# part 1 - 2951 - Correct!
# part 2 - program 2 sends 7366 times - Correct!
