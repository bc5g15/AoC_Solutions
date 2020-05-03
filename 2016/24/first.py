
SPACE = '.'
WALL = '#'

maze = []
with open("test.txt",'r') as f:
    maze = f.readlines()

def find_locations(maze):
    outmap = {}
    for y in range(len(maze)):
        for x in range(len(maze[y])):
            c = maze[y][x]
            if c != SPACE and c != WALL:
                outmap[c] = (x, y)
    return outmap

def add_dirs(maze, point):
    x, y = point
    output = []
    if x>0 and maze[y][x-1] != WALL:
        output.append((x-1, y))
    if x<len(maze[y]) and maze[y][x+1] != WALL:
        output.append((x+1, y))
    if y>0 and maze[y-1][x] != WALL:
        output.append((x, y-1))
    if y<len(maze) and maze[y+1][x] != WALL:
        output.append((x, y+1))
    
    return output


def manhattan_dist(start, goal):
    x1, y1 = start
    x2, y2 = goal
    return abs(x1 - x2) + abs(y1 - y2)

def estimate_cost(node, goal):
    return node[1] + manhattan_dist(node[0], goal)

# Smallest path between two points seems to work
def find_path(maze, start, goal):
    # Find shortest path
    # x,y = start
    nodes = [(start, 0)]
    visited = set()
    steps = 0
    while True:
        cur = nodes.pop(0)
        if cur[0] == goal:
            steps = cur[1]
            break

        if cur[0] in visited:
            continue
        
        visited.add(cur[0])

        dirs = add_dirs(maze, cur[0])
        for d in dirs:
            if d not in visited:
                nodes.append((d, cur[1] +1))
        
        nodes = sorted(nodes, key=(lambda x: estimate_cost(x, goal)))
    return steps

def large_path(maze):
    points = find_locations(maze)
    names = list(points)
    # Use nearest manhattan neighbour to start
    start = "0"
    outpath = ["0"]
    names.remove(start)
    while len(names)>0:
        names = sorted(names, key=(lambda x: manhattan_dist(points[start], points[x])))
        start = names.pop(0)
        outpath.append(start)
    return outpath

def smarter_large_path(maze, insane=False, part2=False):
    points = find_locations(maze)
    states = [("0", ["0"], 0)]
    names = set(list(points))
    cur = states.pop(0)
    while len(cur[1]) <= len(names):
        # print(cur)
        curpoints = list(cur[1])
        for item in (names-set(cur[1])):
            if not insane:
                states.append((item, curpoints + [item], cur[2] + manhattan_dist(points[cur[0]], points[item])))
            else:
                states.append((item, curpoints + [item], cur[2] + find_path(maze, points[cur[0]], points[item])))
        if len(names-set(cur[1])) == 0 and part2:
            states.append(("0", curpoints + ['0'], cur[2] + manhattan_dist(points[cur[0]], points["0"])))
        elif len(names-set(cur[1]))==0 and not part2:
            return cur[1]
            # states = sorted(states, key=lambda x: x[2])
            # cur = states.pop(0)
            # break

        # print(states)
        states = sorted(states, key=lambda x: x[2])
        cur = states.pop(0)
    
    # Now we need to check
    return cur[1]
    
    
    


def test(fname):
    maze = []
    with open(fname, 'r') as f:
        maze = f.readlines()
    maze = list(map((lambda x: x.strip()), maze))
    points = find_locations(maze)
    print(find_path(maze, points["0"], points["1"]))
    print(large_path(maze))
    path = smarter_large_path(maze, part2=False)
    print(path)
    # print(smarter_large_path(maze, True))
    # path = smarter_large_path(maze)
    start = path.pop(0)
    steps = 0
    while len(path)>0:
        steps += find_path(maze, points[start], points[path[0]])
        start = path.pop(0)
    print(steps)

test("in.txt")

# 412 - Correct answer! Part 1
        
# 664 - Part 2 complete!