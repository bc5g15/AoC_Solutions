
PLAYER = 2
CHIP = 1
GEN = 0

def deep_copy(state):
    output = []
    for line in state:
        output.append(set(line))
    return output

def read_state(lines):
    output = []
    x = 0
    for line in lines:
        output.append(set())
        contents = line.strip().split("contains")[1]
        contents = contents.replace(".", "")
        contents = contents.replace(",", "")
        tmc = contents.split(" ")
        while "microchip" in tmc:
            # print(tmc)
            name = tmc[tmc.index("microchip",0)-1]
            name = name.split("-")[0]
            output[x].add((CHIP, name))
            tmc = tmc[tmc.index("microchip",0)+1:]
            # print(name)
            # print(tmc)
        tg = contents.split(" ")
        while "generator" in tg:
            name = tg[tg.index("generator",0)-1]
            output[x].add((GEN, name))
            tg = tg[tg.index("generator",0)+1:]
        x += 1
    output[0].add(PLAYER)
    return output

def get_player_floor(state):
    for x in range(len(state)):
        if PLAYER in state[x]:
            return x
    assert(False)


def apply_move(state, start, end, items):
    # print(start, end)
    state[start].remove(PLAYER)
    state[end].add(PLAYER)
    for item in items:
        state[start].remove(item)
        state[end].add(item)

def floor_contains_other_gen(floor, chip):
    for item in floor:
        if item == PLAYER or item == chip:
            continue
        t, n = item
        if t == GEN and n != chip[1]:
            return True
    return False

def legal_state(state):
    for floor in state:
        for item in floor:
            if item==PLAYER:
                continue
            if item[0] == CHIP and (GEN, item[1]) not in floor\
                and floor_contains_other_gen(floor, item):
                # print("False")
                # print((GEN, item[1]))
                # print(floor)
                return False
    # print("True")
    return True


def get_moves(state):
    pf = get_player_floor(state)
    visitable = []
    if pf > 0: visitable.append(pf-1)
    if pf < len(state)-1: visitable.append(pf+1)
    
    output = []

    for v in visitable:
        # Move a single item
        for item in state[pf]:
            if item != PLAYER:
                os = deep_copy(state)
                apply_move(os, pf, v, [item])
                output.append(os)
        
        # Move two items
        items = list(state[pf])
        items.remove(PLAYER)
        for i in range(len(items)):
            for j in range(i+1, len(items)):
                if i != j:
                    os = deep_copy(state)
                    apply_move(os, pf, v, [items[i], items[j]])
                    output.append(os)

    # print(output)
    # print(len(output))
    return list(filter(lambda x: legal_state(x), output))

def winning_state(state):
    if len(state[0]) == 0 and len(state[1]) == 0\
        and len(state[2]) == 0:
        return True

def estimate_cost(state):
    cost = 0
    for x in range(len(state)):
        height = (len(state)-1) - x
        cost += len(state[x]) * height
        # for item in state[x]:
        #     if item != PLAYER:
        #         cost += height
    # print(cost)
    return cost

def abstract_state(state):
    output = []
    x = 0
    for line in state:
        count = {GEN: 0, CHIP: 0}
        output.append({})
        for item in line:
            if item == PLAYER:
                output[x][PLAYER] = 1
            else:
                count[item[0]] += 1
                output[x][item[0]] = count[item[0]]
        x += 1
    return output

def run(fname, part2=False):
    with open(fname, 'r') as f:
        lines = f.readlines()
    s = read_state(lines)

    if part2:
        s[0].add((GEN, "elerium"))
        s[0].add((CHIP, "elerium"))
        s[0].add((GEN, "dilithium"))
        s[0].add((CHIP, "dilithium"))
    # print(s)
    states = [(s, 0, 0)]
    visited = []
    cur = states.pop(0)
    while not winning_state(cur[0]):
        moves = get_moves(cur[0])
        abstate = abstract_state(cur[0])
        # print(cur[1])

        if abstate in visited:
            cur = states.pop(0)
            # print(len(visited))
            # print(len(states))
            continue
        visited.append(abstate)

        for item in moves:
            if abstract_state(item) not in visited:
                states.append((item, cur[1]+ 1, 1 + cur[1] + estimate_cost(item)))
        
        states = sorted(states, key=lambda x: x[2])
        cur = states.pop(0)
        # print(cur[2], cur[0])
    return cur




stuff = run("in.txt", True)
print(stuff[1])
print(stuff[0])
print(stuff)

# part 2 - 55?