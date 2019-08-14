
def read_data(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()

    out = []
    for l in lines:
        if len(l.strip())>0:
            ls = l.strip().split(" ")
            out.append((ls[1], ls[7]))

    return out

def build_tlist(reqs):
    out = {}
    for r in reqs:
        for i in r:
            if i not in out:
                out[i] = False
    return out

def build_ptree(reqs):
    rs = {}
    ds = {}
    for r in reqs:
        rs[r[1]] = rs.get(r[1], []) + [r[0]]
        ds[r[0]] = ds.get(r[0], []) + [r[1]] 
    return (rs, ds)

def roots(reqs, tsks):
    out = []
    for t in tsks:
        if t not in reqs:
            out.append(t)
    return out

def can_do(task, reqs, tsks):
    for r in reqs.get(task, []):
        if not tsks[r]:
            return False
    return True

def run(fname, part2=False):
    rules = read_data(fname)
    reqs, deps = build_ptree(rules)
    tsks = build_tlist(rules)
    #print(reqs, deps)

    out = ""
    ns = roots(reqs, tsks)
    ns = sorted(ns)

    if not part2:
        while len(ns)>0:
            cur = ns.pop(0)
            out += cur
            tsks[cur] = True
            ns = ns + [d for d in deps.get(cur, []) if can_do(d, reqs, tsks)]
            ns = sorted(ns)
    else:
        workers = 2
        itime = 60
        widle = 5
        wwork = []
        offset = ord('A') - 1
        total = 0
        while not all((tsks[t] for t in tsks)):
            # Assign tasks
            while widle > 0 and len(ns) > 0:
                t = ns.pop(0)
                wwork.append([t, itime + ord(t) - offset])
                widle -= 1
            # Pass time
            t = min(wwork, key=lambda x: x[1])
            tsks[t[0]] = True
            wwork.remove(t)
            total += t[1]
            out += t[0]
            widle += 1
            for i in range(len(wwork)):
                wwork[i][1] -= t[1]
            ns = ns + [d for d in deps.get(t[0], []) if can_do(d, reqs, tsks)]
            ns = sorted(ns)
        print(total)
    print(out)

run("in.txt", part2=True)
# Part 1 - Got it!
# Part 2 - Done!
