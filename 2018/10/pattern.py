import parse

def read_input(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip())>0]
    
    out = []
    for l in lines:
        r = parse.parse("position=<{x},{:s}{y:d}> velocity=<{i},{:s}{j:d}>", l)
        out.append((int(r["x"]), r["y"], int(r["i"]), r["j"]))

    return out

def tick(points, time=1):
    out = []
    for p in points:
        out.append((p[0]+(p[2]*time), p[1]+(p[3]*time), p[2], p[3]))
    return out

def create_pset(points):
    out = set()
    for p in points:
        out.add((p[0], p[1]))
    return out

def check_hv(points):
    ps = create_pset(points)
    h = 0
    v = 0

    while len(ps)>0:
        p = ps.pop()
        for d in [1, -1]:
            if (p[0]+d, p[1]) in ps:
                h += 1
            if (p[0], p[1]+d) in ps:
                v += 1
    return (h, v)
        
def display(points):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    minx = min(xs)
    maxx = max(xs)
    miny = min(ys)
    maxy = max(ys)

    ps = create_pset(points)

    for i in range(miny, maxy+1):
        line = []
        for j in range(minx, maxx+1):
            if (j, i) in ps:
                line.append("#")
            else:
                line.append(" ")
        print("".join(line))
            
def remove_trailing(points):
    # Remove points with no neighbours
    ps = create_pset(points)
    print(len(ps))
    out = set()
    while len(ps)>0:
        p = ps.pop()
        for d in [1, -1]:
            tp1 = (p[0] + d, p[1])
            tp2 = (p[0], p[1] + d)
            if tp1 in ps:
                out.add(p)
                out.add(tp1)
            elif tp2 in ps:
                out.add(p)
                out.add(tp2)
    print(len(out))
    return list(out)


def run(fname):
    points = read_input(fname)
    maxes = [(points, sum(check_hv(points)))]

    # 100 frames, keep the 10 best
    for _ in range(100000):
        points = tick(points)
        h, v = check_hv(points)
        print(h+v)
        if(len(maxes)) < 10:
            maxes.append((points, h+v))
            maxes = sorted(maxes, key=lambda x: x[1], reverse=True)
        else:
            m = maxes.pop()
            if m[1] >= h+v:
                maxes.append(m)
            else:
                maxes.append((points, h+v))
                maxes = sorted(maxes, key=lambda x: x[1], reverse=True)

    m = max(maxes, key=lambda x: x[1])
    remove_trailing(m[0])
    print(m[1])

    #for m in maxes:
    #    display(m[0])
    #    print(m[1])
            
run("in.txt")

        



