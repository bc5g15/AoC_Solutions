import math

start = [".#.",
         "..#",
         "###"]

def create_square(size):
    output = []
    for i in range(size):
        output.append([])
        for j in range(size):
            output[i].append('.')
    return output

def boxprint(matrix):
    for r in matrix:
        print(r)

def rotate(rule):
    """
    Create a clockwise rotated rule string
    """
    r = rule.split("/")
    n = len(r)
    x = math.floor(n/2)
    y = n - 1
    out = create_square(n)
    for i in range(x):
        for j in range(i, y-i):
            out[i][j] = r[y-j][i]
            out[y-j][i] = r[y-i][y-j]
            out[y-i][y-j] = r[j][y-i]
            out[j][y-i] = r[i][j]
    if n%2 == 1:
        out[x][x] = r[x][x]

    for i in range(len(out)):
        out[i] = "".join(out[i])
    #boxprint(r)
    #boxprint(out)
    return "/".join(out)

def stringify(matrix):
    for i in range(len(matrix)):
        matrix[i] = "".join(matrix[i])

def flip(rule):
    """
    flip a rule on the x axis
    """
    r = rule.split("/")
    n = len(r)
    o = create_square(n)

    for i in range(n):
        for j in range(n):
            o[i][j] = r[i][n-j-1]
    
    stringify(o)
    #boxprint(r)
    #boxprint(o)
    return "/".join(o)

#flip("..#/.#./..#")

#flip(".##./.##./..../....")

#flip("#..../.#.../..#../...#./....#")

def create_rule(rstring, rdict):
    rs = rstring.split(" => ")
    res = rs[1]
    rule = rs[0]
    
    for i in range(4):
        rule = rotate(rule)
        f_rule = flip(rule)
        rdict[rule] = res
        rdict[f_rule] = res

def ruleify(m, size):
    n = len(m)
    s = math.floor(n/size)
    out = create_square(s)
    for i in range(s):
        for j in range(s):
            ts = []
            for k in range(size):
                ts.append(m[i*size+k][j*size:(j*size)+size])
                #print(ts)
            out[i][j] = "/".join(ts)
    return out

def joinify(m, size):
    n = len(m)
    s = n * size
    out = [] 

    for i in range(n):
        for j in range(n):
            m[i][j] = m[i][j].split("/")

    for i in range(n):
        for k in range(size+1):
            line = []
            for j in range(n):
                line.append(m[i][j][k])
            out.append("".join(line))
            
    """        
    for i in range(n):
        for j in range(n):
            cs = m[i][j].split("/")
            for k in range(len(cs)):
                for l in range(len(cs[k])):
                    print(i,j,k,l)
                    out[(i*size) + k][(j*size) + l] = cs[k][l]
    """
    stringify(out)
    return out

def handle_it(state, rdict):
    n = len(state)

    cells = []
    size = 0
    if n % 2 == 0:
        size = 2
    elif n % 3 == 0:
        size = 3
    
    #print(n, size)
    #print(state)
    v = ruleify(state, size)
    #boxprint(state)
    #boxprint(v)
    k = len(v)
    #boxprint(v)
    for i in range(k):
        for j in range(k):
            v[i][j] = rdict[v[i][j]]
    #boxprint(v)
    l = joinify(v, size)
    #boxprint(l)
    return l

#handle_it([".#..","..##","###.", "##.."],{})

def count_on(state):
    i = 0
    for x in state:
        i += x.count('#')
    return i

def run(fname, istate, i=2):
    rs = []
    with open(fname, 'r') as f:
        rs = f.readlines()
    rs = [r for r in rs if len(r.strip()) > 0]
    rules = {}
    for r in rs:
        create_rule(r.strip(), rules)
    state = istate
    for its in range(i):
        print("OLD:")
        boxprint(state)
        state = handle_it(state, rules)
        print("NEW:")
        boxprint(state)
        print("ON: ", count_on(state))

run("real.txt", start, 18)

# part 1 - 176, correct!
# part 2 - 2368161, correct! - V slow to run, perhaps could have done this more easily
