with open("maze.txt") as f:
    glines = f.readlines()

def find_start(maze):
    """
    The start of the maze is always
    a pipe character at the top line
    """
    return (maze[0].index('|'), 0)

UP = 0
DOWN = 2
LEFT = 1
RIGHT = 3

deltas = {
        UP: (0, -1),
        DOWN: (0, 1),
        LEFT: (-1, 0),
        RIGHT: (1, 0),
        }

def opposite(d):
    return (d + 2) % 4

def get_char(maze, p):
    return maze[p[1]][p[0]]

def next_point(maze, d, start):
    delta = deltas[d]
    current = [start[0]+delta[0], start[1]+delta[1]]
    outchars = []
    c = get_char(maze, current)
    steps = 1
    while c != '+':
        if c not in ['-', '|']:
            outchars.append(c)
        current[0] += delta[0]
        current[1] += delta[1]
        if current[1] < 0 or current[1]>=len(maze) or \
                current[0] < 0 or current[0]>=len(maze[current[1]]) or\
                get_char(maze, current) == ' ':
            return ((), outchars, steps)
        c = get_char(maze, current)
        steps += 1
    return ((current[0], current[1]), outchars, steps)
        
def get_dirs(maze, start):
    out = []
    for key in deltas:
        d = deltas[key]
        cur = (start[0] + d[0], start[1] + d[1])
        if cur[1]<0 or cur[1]>=len(maze) or \
            cur[0]<0 or cur[0]>=len(maze[0]):
            continue
        if get_char(maze, cur) != " ":
            out.append(key)
    return out

def run(lines):
    start = find_start(lines)
    maze = lines
    # First part can only go down
    d = DOWN
    letters = []
    newpoint = next_point(maze, d, start)
    letters += newpoint[1]
    steps = 1 + newpoint[2]
    print(steps)
    while len(newpoint[0])>0:
        # get new direction
        drs = get_dirs(maze, newpoint[0])
        drs.remove(opposite(d))
        d = drs[0]
        # get new point
        newpoint = next_point(maze, d, newpoint[0])
        print(newpoint)
        letters += newpoint[1]
        steps += newpoint[2]
    print(newpoint)
    print("Part 1: ", "".join(letters))
    print("Part 2: ", steps)

run(glines)

# part 1 - UICRNSDOK - Correct answer!
# part 2 - 16064 - Correct!
