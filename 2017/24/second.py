
def find_next(points, port):
    ps = sorted(points, key=lambda x: x[0] + x[1])
    for p in ps:
        if p[0] == port or p[1] == port:
            return p
    return False

def list_components(lines):
    out = []
    for l in lines:
        p = l.split("/")
        out.append((int(p[0]), int(p[1])))
    return out

def match(p, ports):
    for x in p:
        if x in ports:
            return x

def connect(port, piece):
    if piece[0] == port:
        return piece[1]
    else:
        return piece[0]

def get_longest(ps):
    stage = {}
    for p in ps:
        if p[0] in stage:
            stage[p[0]].append( p[1])
        else:
            stage[p[0]] = [p[1]]
        if p[1] in stage:
            stage[p[1]].append(p[0])
        else:
            stage[p[1]] = [p[0]]

def run(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip()) > 0]
    ps = list_components(lines)

def poss_matchs(port, ps):
    return [p for p in ps if p[0] == port or p[1] == port]

def run_bfs(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip())>0]
    state = (0, 0, 0, list_components(lines))
    ns = [state]
    ml = 0
    mx = 0
    while len(ns)>0:
        acc, length, port, ps  = ns.pop(0)
        poss = poss_matchs(port, ps)
        if len(poss) == 0:
            print(length, acc)
            if length >= ml:
                ml = length
                if acc > mx:
                    mx = acc
            continue

        for p in poss:
            l = list(ps)
            l.remove(p)
            ns.append((acc + p[0] + p[1], length+1, connect(port, p), l))
    print(mx, ml)
    

#print(run("in.txt"))
run_bfs("in.txt")
# 1072 - Too low... Need to explore more of the bridge options


        


        
