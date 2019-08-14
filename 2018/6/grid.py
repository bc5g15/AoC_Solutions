def dist(p1, p2):
    return abs(p1[0] - p2[0]) + abs(p1[1] -p2[1])

def nearest(point, ps):
    mymin = dist(point, ps[0][1])
    mindex = ps[0][0]
    dup = False
    total = mymin
    for i in range(1, len(ps)):
        d = dist(point, ps[i][1])
        total += d
        if d < mymin:
            mymin = d
            mindex = ps[i][0]
            dup = False
        elif d == mymin:
            dup = True
    return (dup, mindex, total)

def read_points(fname):
    ps = []
    index = 0
    with open(fname, 'r') as f:
        ps = f.readlines()
    ps = [((int(x.split(",")[0])), int(x.split(",")[1])) for x in ps if len(x.strip())>0]
    return list(zip(range(len(ps)), ps))

def myrange(ps):
    xs = [i[1][0] for i in ps]
    ys = [i[1][1] for i in ps]
    return ((min(xs),min(ys)),(max(xs),max(ys)))


def run(fname):
    ps = read_points(fname)
    tl, br = myrange(ps)
    scores = {}
    safe = 0
    inf = set()
    for i in range(tl[0], br[0]+1):
        for j in range(tl[1], br[1]+1):
            x = nearest((i, j), ps)
            if x[2] < 10000:
                safe += 1
            if not x[0]:
                scores[x[1]] = scores.get(x[1], 0) + 1
                if i in (tl[0], br[0]) or j in (tl[1], br[1]):
                    inf.add(x[1])
    print(scores)
    mx = max(scores, key=lambda x: scores[x])
    print(mx, scores[mx])
    for i in inf:
        del scores[i]
    print(scores)
    mx = max(scores, key=lambda x: scores[x])
    print(mx, scores[mx])
    print(safe)

run("in.txt")
# 3840 - Correct! - Was forgetting to discount infinite areas 
# 46542 - Correct! - Easy enough

