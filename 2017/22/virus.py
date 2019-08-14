import math

START_STATE = ["..#",
        "#..",
        "..."]

UP = 0
LEFT = 1
DOWN = 2
RIGHT = 3

deltas = {
        UP: (0,-1),
        LEFT: (-1, 0),
        DOWN: (0, 1),
        RIGHT: (1, 0)}

def delta_add(d1, d2):
    return (d1[0] + d2[0], d1[1] + d2[1])

class Carrier:
    #pos = [0, 0]
    #facing = UP
    #bursts = 0
    #infects = 0

    def __init__(self, state, pos):
        self.state = state
        self.pos = pos
        self.facing = UP
        self.bursts=0
        self.infects=0

    def work(self):
        if self.state.get(self.pos, False):
            self.turn(RIGHT)
            del self.state[self.pos]
        else:
            self.turn(LEFT)
            self.state[self.pos] = True
            self.infects += 1
        self.move()
        self.bursts += 1
        
    def turn(self, dr):
        if dr== RIGHT:
            self.facing = (self.facing - 1) % 4
        else:
            self.facing = (self.facing + 1) % 4

    def move(self):
        self.pos = delta_add(self.pos, deltas[self.facing])

        
def load_map(lines):
    out = {}
    for i in range(len(lines)):
        for j in range(len(lines[i])):
            c = lines[i][j]
            if c == "#":
                out[(j, i)] = True
    return out

def run(fname, its = 7):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [x for x in lines if len(x.strip())>0]
    m = load_map(lines)
    n = math.floor(len(lines)/2)
    c = Carrier(m, (n,n))

    for i in range(its):
        c.work()

    print("infects: ", c.infects)
    print("bursts: ", c.bursts)

run("map.txt", its=10000)
