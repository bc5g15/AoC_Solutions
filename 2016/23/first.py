import re

ls = ""
with open("in.txt", 'r') as f:
    ls = f.readlines()

i = 0
reg = {'a': 0,
    'b':0, 'c':1, 'd':0}

def get_val(st, reg):
    if st in reg:
        return reg[st]
    else:
        return int(st)

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
    if i[2] not in s:
        return 
    m = re.search(r'\d+', i[1])
    if m:
        so = sets(so, i[2], int(i[1]))
    else:
        so = sets(so, i[2], gets(so, i[1]))
    return so

def inc(s, i):
    return sets(s, i[1], gets(s, i[1])+1)

def dec(s, i):
    return sets(s, i[1], gets(s, i[1])-1)


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
    # print("Enter")
    rout = dict(reg)
    ils = ls[i+int(inst[2]):i]
    print(ils)
    if check_basic(inst): return reg

    # print(inst)
    
    control = inst[1]
    delta = simple_delta(ils)
    n = (-int(reg[control]))/delta[control]

    if n % 1 > 0:
        return reg

    for item in delta:
        rout[item] += int(n * delta[item])

    return rout

# def loop_prediction(s, i, index):
#     instructions = ls[index-int(i[1]): index+1]
#     # predict how22278=-8888 long the loop will run

#     pass

funs = {
    "cpy": copy,
    "inc": inc,
    "dec": dec
}

toggle = {
    "inc": "dec",
    "dec": "inc",
    "jnz": "cpy",
    "cpy": "jnz",
    "tgl": "inc",
}

reg['a'] = 7

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
                i = i + get_val(inst[2], reg)
        elif gets(reg, inst[1]) == 0:
            i = i + 1
        elif int(inst[2]) < 0:
            lpls = ls[i+int(inst[2]):i]
            # print(lpls)
            # print(check_basic(lpls))
            if check_basic(ls[i+int(inst[2]):i]):
                # print(lpls)
                reg = simple_loop(inst, i, reg)
                i = i+1
            else:
                i = i+int(inst[2])
        else:
            i = i+int(inst[2])
    elif inst[0] == 'tgl':
        v = get_val(inst[1], reg)
        if i+v>=0 and i+v<len(ls):
            ti = ls[i+v].strip().split()
            ti[0] = toggle[ti[0]]
            ls[i+v] = " ".join(ti)
        i = i+1
    else:
        i = i+1
        # print("Increment")
        reg = funs[inst[0]](reg, inst)
    # print(reg)
    # print(inst)
    
    if(i>=len(ls)):
        print(ls)
        break

    # if(reg['b']<0): break

# 12480 is too low

print(reg)
    