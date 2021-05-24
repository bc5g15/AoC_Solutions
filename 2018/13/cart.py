CART_CHARS = ['>','<','^','v']
EMPTY = ['\n', ' ']
CORNERS = ['\\', '/']

CART_MAP = {
    '>': '-',
    '<': '-',
    'v': '|',
    '^': '|'
}

TURN_ORDER = {
    ('<', '\\') : '^',
    ('>', '\\') : 'v',
    ('v', '\\') : '>',
    ('^', '\\') : '<',
    ('<', '/') : 'v',
    ('v', '/') : '<',
    ('>', '/') : '^',
    ('^', '/') : '>'
}

MOVEMENT_DIR = {
    '>': (1, 0),
    '<': (-1, 0),
    'v': (0, 1),
    '^': (0, -1)
}

TURN_MAP = {
    0: '^',
    1: '>',
    2: 'v',
    3: '<'
}

CART_TO_TURN = {
    '^': 0,
    '>': 1,
    'v': 2,
    '<': 3
}

def read_data(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    
    grid = {}
    cart = []
    for y in range(len(lines)):
        for x in range(len(lines[y])):
            c = lines[y][x]
            if c not in EMPTY:
                if c in CART_CHARS:
                    cart.append((x, y, c, 0))
                    grid[(x, y)] = CART_MAP[c]
                else:
                    grid[(x, y)] = c

    return (grid, cart)

# cart = (x, y, character(direction), intersection count)

def turn_dir(c, j):
    ci = CART_TO_TURN[c]
    rule = {
        0: (lambda x: (x-1) % 4),
        1: (lambda x: x),
        2: (lambda x: (x+1) % 4)
    }
    result = TURN_MAP[rule[j](ci)]
    jr = (j+1) % 3
    return (result, jr)

def tick(grid, carts):
    # Check which carts go first
    carts.sort(key=lambda x: x[0])
    carts.sort(key=lambda y: y[1])

    # print(carts)
    # Move them in turn, check for collisions
    for i in range(len(carts)):
        (x, y, c, j) = carts[i]
        # Swap direction if at junction
        if grid[(x, y)] == '+':
            (c, j) = turn_dir(c, j)
            # c = c2
            # j = j2
        elif grid[(x, y)] in CORNERS:
            c = TURN_ORDER[(c, grid[(x, y)])]

        (dx, dy) = MOVEMENT_DIR[c]
        x = x + dx
        y = y + dy
        # print( c, j)
        # Check for collision
        for k in range(len(carts)):
            (a, b, _, _) = carts[k]
            if (a,b) == (x, y):
                return (True, x, y)

        carts[i] = (x, y, c, j)
    
    return (False, grid, carts)
    
def full_run(grid, carts):
    crash = False
    while not crash:
        (crash, grid, carts) = tick(grid, carts)
    print((grid, carts))

(grid, carts) = read_data('in.txt')
full_run(grid, carts)