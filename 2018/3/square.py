CONFLICTED = -1

def allocate(sqrs, myid, startpos, rng):
    x, y = startpos
    for i in range(rng[0]):
        for j in range(rng[1]):
            coords = (x+i, y+j)
            c = sqrs.get((x+i, y+j), 0)
            if c > 0:
                sqrs["cols"] += 1
                sqrs[coords] = CONFLICTED
                sqrs["ids"].discard(myid)
                sqrs["ids"].discard(c)
            elif c == 0:
                sqrs[(x+i, y+j)] = myid
            else:
                sqrs["ids"].discard(myid)

def read(line):
    l = line.split(" ")
    myid = int(l[0][1:])
    pos = l[2].replace(":", "").split(",")
    startpos = (int(pos[0]), int(pos[1]))
    size = l[3].split("x")
    rng = (int(size[0]), int(size[1]))
    return (myid, startpos, rng)

def run(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    insts = [read(l) for l in lines if len(l.strip()) > 0]

    sqrs = {"cols": 0}
    sqrs["ids"] = set()
    for i in insts:
        sqrs["ids"].add(i[0])
        allocate(sqrs, i[0], i[1], i[2])
    print("Collisions: ", sqrs["cols"])
    print("Remaining Ids: ", sqrs["ids"])

run("in.txt")

# 107663 - Correct! - Good logic
# 1166 - Got it! - Now you're thinking with sets        


