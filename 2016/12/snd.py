import re

ls = ""
with open("in.txt", 'r') as f:
    ls = f.readlines()

i = 0
reg = {'a': 0,
    'b':0, 'c':1, 'd':0}

def gets(s, n):
    if n in s:
        return s[n]
    else:
        return 0

def sets(s, n, v):
    so = dict(s)
    so[n] = v
    return so

def copy(s, i):
    so = s
    m = re.search(r'\d+', i[1])
    if m:
        so = sets(so, i[2], int(m.group(0)))
    else:
        so = sets(so, i[2], gets(so, i[1]))
    return so

def inc(s, i):
    return sets(s, i[1], gets(s, i[1])+1)

def dec(s, i):
    return sets(s, i[1], gets(s, i[1])-1)


# def loop_prediction(s, i, index):
#     instructions = ls[index-int(i[1]): index+1]
#     # predict how long the loop will run

#     pass

def get_vars(iset):
    output = []
    for item in iset:
        i = item.split().strip()
        if i[0]=="cpy":
            output.append(i[2])
        elif i[0] == "inc" or i[0] == "dec":
            output.append(i[1])
    return output

def safe_loop(iset, var):
    for item in iset:
        i = item.split().strip()
        if i[0] == "cpy" and i[2] == var:
            return False
        elif i[0] == "jnz":
            return False
    return True

def isnum(val):
    m = re.search(r'\d+', val)
    if m:
        return True
    else:
        return False

def check_delta(iset):
    rout = {'a':['a', 0], 'b':['b', 0], 'c':['c', 0], 'd':['d', 0]}
    for item in iset:
        i = item.split().strip()
        if i[0] == "inc":
            rout[i[1]][1] += 1
        elif i[0] == "dec":
            rout[i[1]][1] -= 1
        elif i[0] == "cpy":
            rout[i[2]][0] = i[1]
            rout[i[2]][1] = 0
    return rout

# Look for loops in the process
# Whenever we are about to step backwards
def close_loop(inst, i, step, reg):
    loop_i = ls[i-step:i]
    con_var = inst[2]
    if not safe_loop(loop_i, con_var):
        return
    if con_var not in get_vars(loop_i):
        return
    
    pass

def check_basic(ilst):
    for item in ilst:
        i = item.strip().split()
        if not i[0] == 'inc' and not i[0] == 'dec':
            return False
    return True

def simple_delta(ilst):
    reg = {'a': 0, 'b':0, 'c':0, 'd':0}
    for item in ilst:
        i = item.strip().split()
        if i[0] == 'inc':
            reg[i[1]] += 1
        elif i[0] == 'dec':
            reg[i[1]] -= 1
    return reg


def simple_loop(inst, i, reg):
    rout = dict(reg)
    ils = ls[i+int(inst[2]):i]
    # print(ils)
    if check_basic(inst): return reg
    
    control = inst[1]
    delta = simple_delta(ils)
    n = (-int(reg[control]))/delta[control]

    if n % 1 > 0:
        return reg

    for item in delta:
        rout[item] += int(n * delta[item])

    # print(reg)
    # print(delta)
    # print(rout)
    return rout
    


funs = {
    "cpy": copy,
    "inc": inc,
    "dec": dec
}

while True:
    # print(i)
    inst = ls[i].strip().split(" ")

    # print(inst, i)
    if inst[0] == 'jnz':
        m = re.search(r'\d+', inst[1])
        if m:
            if int(inst[1]) == 0:
                i = i+1
            else:
                i = i + int(inst[2])
        elif gets(reg, inst[1]) == 0:
            i = i + 1
        elif int(inst[2]) < 0:
            lpls = ls[i+int(inst[2]):i]
            # print(lpls)
            # print(check_basic(lpls))
            if check_basic(ls[i+int(inst[2]):i]):
                reg = simple_loop(inst, i, reg)
                i = i+1
            else:
                i = i+int(inst[2])
        else:
            i = i+int(inst[2])
    else:
        i = i+1
        # print("Increment")
        reg = funs[inst[0]](reg, inst)
    # print(reg)
    
    
    if(i>=len(ls)):
        break

    if(reg['b']<0): break

print(reg)
    

    
