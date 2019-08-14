
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

def run(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip()) > 0]
    ps = list_components(lines)
    p = True
    cur = find_next(ps, 0)
    port = connect(0, cur)
    ps.remove(cur)
    sol = [cur]
    while True:
        nxt = find_next(ps, port)
        print(nxt)
        if nxt == False:
            break
        port= connect(port,nxt)
        ps.remove(nxt)
        sol.append(nxt)

    return (sol, sum([x[0]+x[1] for x in sol]))

def poss_matchs(port, ps):
    return [p for p in ps if p[0] == port or p[1] == port]

def run_bfs(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip())>0]
    state = (0, 0, list_components(lines))
    ns = [state]
    mx = 0
    while len(ns)>0:
        acc, port, ps  = ns.pop(0)
        poss = poss_matchs(port, ps)
        if len(poss) == 0:
            if acc > mx:
                mx = acc
            continue

        for p in poss:
            l = list(ps)
            l.remove(p)
            ns.append((acc + p[0] + p[1], connect(port, p), l))
    print(mx)
    

#print(run("in.txt"))
run_bfs("in.txt")
# 1072 - Too low... Need to explore more of the bridge options


        


        
