def read_in(fname):
    f = open(fname, 'r')
    datout = []

    for line in f:
        rec = line.strip().split()
        if len(rec[0].split("/"))>1:
            # print(rec[0].split("/")[3])
            # datout.append()
            # print(rec)
            poss = rec[0].split("/")[3].split("-")
            r = {
                "x": int(poss[1][1:]),
                "y": int(poss[2][1:]),
                "size": int(rec[1].replace("T","")),
                "used": int(rec[2].replace("T", "")),
                "avail": int(rec[3].replace("T", "")),
                "use": int(rec[4].replace("%",""))
            }
            datout.append(r)
    return datout

def find_pairs(datin):
    outls = []
    for i in range(len(datin)):
        rec1 = datin[i]
        if rec1["use"] == 0: continue
        for j in range(len(datin)):
            rec2 = datin[j]
            if (not i==j) and (rec1["used"] <= rec2["avail"]):
                outls.append((rec1, rec2))
    return outls


def adjacent(r1, r2):
    if (r1["x"] == r2["x"] and r1["y"] <= r2["y"] +1 and \
        r1["y"] >= r2["y"] -1) or \
        (r1["y"] == r2["y"] and r1["x"] <= r2["x"] +1 and \
        r1["x"] >= r2["x"] -1):
        return True
    else:
        return False

def count_zero(datin):
    for item in datin:
        if item["use"] == 0: print(item)

def space_find(datin):
    for item in datin:
        if item["avail"] >= 72: return item

def max_x(datin):
    return max(map(lambda x: x["x"], datin))

def max_y(datin):
    return max(map(lambda x: x["y"], datin))

def text_grid(datin, empty):
    # print(datin)
    outl = []
    for y in range(len(datin)):
        outl.append([])
        for x in range(len(datin[y])):
            c = '.'
            if datin[y][x]["avail"]>=empty['avail']: c = '_'
            if datin[y][x]["used"]>empty['avail']: c = '#'
            if y==0 and x==0: c = 'S'
            if y==0 and x==len(datin[y])-1: c = 'E'
            # print(c, end=' ')
            outl[y].append(c)
        # print(item)
    return outl

def make_grid(datin):
    outls = []
    mx = max_x(datin)
    my = max_y(datin)
    # Create blank list
    for i in range(my+1):
        outls.append([])
        for j in range(mx+1):
            outls[i].append(j)
    
    for item in datin:
        outls[item['y']][item['x']] = item
    
    return outls


# print_grid(grid, space_find(dat))

# pair = find_pairs(dat)
# adj = list(filter(lambda x: adjacent(x[0], x[1]), pair))
# print(len(adj))

# count_zero(dat)
# print(len(find_pairs(dat)))
# space_find(dat)

# First try: 791 - Too low... Why?
# Second try: 1003 - Correct. Needed to include reflected pairs

# 2nd mode: R to L move = 165 + 1 + 26

# for i in range(10):
#     for j in range(i+1, 10):
#         print(i, j)

def valid(grid, ms):
    if ms[1] < 0 or ms[1] >= len(grid): return False
    if ms[0] < 0 or ms[0] >= len(grid[ms[1]]): return False
    if grid[ms[1]][ms[0]] == '#': return False
    return True
    

def get_moves(grid, es):
    moves = [(es[0]+1, es[1], es[2]+1),
        (es[0]-1, es[1], es[2]+1),
        (es[0], es[1]+1, es[2]+1),
        (es[0], es[1]-1, es[2]+1)]
    
    return filter(lambda x: valid(grid, x), moves)
    

def estimate_cost(ms, ts):
    # manhattan distance
    cost = ms[2]
    # cost = 0
    cost += abs(ts[0] - ms[0]) + abs(ts[1] - ms[1])
    return cost

def swap(grid, epos, mpos):
    g = list(grid)
    temp = g[mpos[1]][mpos[0]]
    g[mpos[1]][mpos[0]] = g[epos[1]][epos[0]]
    g[epos[1]][epos[0]] = temp
    return g

def find_path(grid, epos, tpos):
    moves = []
    visited = set()
    while True:
        moves += get_moves(grid, epos)
        # print(moves)
        # print(len(moves))
        moves = sorted(moves, key=(lambda x: estimate_cost(x, tpos)))
        m = moves.pop(0)
        # print(len(visited))
        while m in visited:
            m = moves.pop(0)
        if(m not in visited):
            print(m, estimate_cost(m,tpos))
            grid = swap(grid, epos, m)
            epos = m
            visited.add(m)
            # print(len(visited))
            if epos[0] == tpos[0] and epos[1] == tpos[1]:
                return (grid, epos)

dat = read_in("in.txt")
grid = make_grid(dat)
empty = space_find(dat)
txt = text_grid(grid, empty)
epos = (empty['x'], empty['y'], 0)
target = (33, 0)
# print(txt)
pth = find_path(txt, epos, target)
print(pth[1])
# print(grid)
print(pth[0])