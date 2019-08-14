import math

START_STATE = ["..#",
        "#..",
        "..."]

UP = 0
LEFT = 1
DOWN = 2
RIGHT = 3

CLEAN = 0
WEAK = 1
INF = 2
FLAG = 3

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
        c = self.state.get(self.pos, 0)
        if c==0:
            self.turn(LEFT)
            self.state[self.pos] = WEAK
        elif c==1:
            self.state[self.pos] = INF
            self.infects += 1
        elif c==2:
            self.turn(RIGHT)
            self.state[self.pos] = FLAG
        else:
            self.turn(DOWN)
            del self.state[self.pos]
        self.move()
        self.bursts += 1

        """
        if self.state.get(self.pos, False):
            self.turn(RIGHT)
            del self.state[self.pos]
        else:
            self.turn(LEFT)
            self.state[self.pos] = True
            self.infects += 1
        self.move()
        self.bursts += 1
        """

    def turn(self, dr):
        if dr== RIGHT:
            self.facing = (self.facing - 1) % 4
        elif dr==DOWN:
            self.facing = (self.facing + 2) % 4
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
                out[(j, i)] = INF
    return out

def run(fname, its = 7):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [x.strip() for x in lines if len(x.strip())>0]
    m = load_map(lines)
    n = math.floor(len(lines)/2)
    print(lines)
    c = Carrier(m, (n,n))
    print(m)

    print(c.pos)
    for i in range(its):
        c.work()
        #print(c.pos)
        #print(c.state.get(c.pos, 0))

    print("infects: ", c.infects)
    print("bursts: ", c.bursts)

run("map.txt", its=10000000)
