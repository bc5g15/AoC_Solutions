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
    # Start with difference from zero point
        out.append((p[0] + (p[2]*time), p[1] + (p[3]*time), p[2], p[3]))
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
            
def connected(points):
    # False if any nodes don't have a neighbour
    ps = create_pset(points)
    for p in points:
        c = False
        for d in [1, -1]:
            if (p[0]+d, p[1]) in ps or (p[0], p[1] + d) in ps:
                c = True
        if not c:
            return False
    return True

def proxy(points):
    # find a proximity value for points
    # try distance between the furthest two points
    return max(abs(x[0]+y[0])+abs(x[1]+y[1]) for x in points for y in points)
    

def search(left, right, points):
    lp = proxy(tick(points, left))
    rp = proxy(tick(points, right))
    mid = int((left+right)/2)
    while left != right:
        print(left, mid, right)
        mr = mid + int((right-mid)/2)
        ml = mid - int((mid-left)/2)
        if proxy(tick(points,ml)) < proxy(tick(points,mr)):
            right = mid
            mid = ml
        else:
            left = mid
            mid = mr
        if mid==left:
            return left
        elif mid==right:
            return right
    return left
        #prox = proxy(tick(points, mid))
        


def run(fname):
    points = read_input(fname)

    pts = points
    prox = proxy(points)
    i = 0
    time = 1
    prev = 0
    lprox = 0
    while True:
        pts = tick(points, time)
        print(prox)
        print(time)
        if proxy(pts) > prox:
            # optimum point behind us
            break
        else:
            lprox = prox
            prox = proxy(pts)
            prev = time
            time *= 2
        i+=1

    # Search for the solution
    t = (search(prev, time, points))

    for i in range(t-2, t+3):
        print(i)
        display(tick(points, i))
    #m = display(tick(points,t))
    #display(tick(points, 10076))
    #display(tick(points, 10077))
    #display(tick(points, 10078))
    

    #for m in maxes:
    #    display(m[0])
    #    print(m[1])
            
run("in.txt")

        



