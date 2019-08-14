# AoC 2017 Day 20: Particle Swarm

def collect_params(line, value):
    start = line.index(value)
    rstart = line.index('<', start)
    rend = line.index('>', start)
    relevant = line[rstart+1: rend]
    return [int(i) for i in relevant.split(",")]


def collect_particles(fname):
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [i for i in lines if len(i.strip())>0]
    output = []
    for line in lines:
        cur = {}
        for c in ['p', 'v', 'a']:
            cur[c] = collect_params(line, c)
        output.append(cur)
    return output


def min_accel(parts):
    num = 0
    val = False
    for i in range(len(parts)):
        acc = sum((abs(a) for a in parts[i]['a']))
        if val==False:
            num = i
            val=acc
        elif val > acc:
            num = i
            val = acc
    return num


ps = collect_particles("in.txt")
print(len(ps))
print(min_accel(ps))

def sumval(lst, a):
    return sum((abs(b) for b in lst[a]))

b = []
for i in range(len(ps)):
    b.append((i, ps[i], sumval(ps[i], 'a'), sumval(ps[i], 'v')))

#print(b)

#for i in sorted(b, key= lambda x: x[2]):
#    print(i)

# Slight cheating: Guessed that one of the lowest acceleration must be the
# answer - 308

def increase(l1, l2):
    return [l1[0] + l2[0], l1[1] + l2[1], l1[2] + l2[2]]

def tick(points):
    for i in points:
        points[i]['v'] = increase(points[i]['v'], points[i]['a'])
        points[i]['p'] = increase(points[i]['p'], points[i]['v'])

def matching_indexes(points, pos, start, end):
    return [i for i in range(start, end) if points.get(i, {'p':[]})['p'] == pos]

def check_collision(points, mx):
    for i in range(len(points)):
        if i not in points:
            continue
        inds = matching_indexes(points, points[i]['p'], i, mx)
        if len(inds) > 1:
            ys = sorted(inds, reverse=True)
            for y in ys: del points[y]

def run(points, nocol=1000):
    c = 0
    x = len(points)
    mx = len(points)
    ms = {}
    for n in range(x):
        ms[n] = points[n]
    print(x)
    while c < nocol:
        tick(ms)
        check_collision(ms, mx)
        if len(ms) < x:
            c = 0
            x = len(ms)
            print(x)
        else:
            c += 1
            print(c)
    print("final: ",len(ms))

run(ps)

# part 2: 504 - Simulation solution is correct!
