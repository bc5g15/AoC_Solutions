
SIDE = 300

def populate(s_num):
    out = []
    for i in range(SIDE):
        out.append([])
        for j in range(SIDE):
            out[i].append(grid_val(j+1, i+1, s_num))
    return out

def grid_val(x, y, s_num):
    rid = x + 10
    pwr = (rid * y) + s_num 
    pwr *= rid
    pwr = (pwr // 100) % 10
    pwr -= 5
    return pwr

def largest(grid, size):
    m_val = None
    m_index = (0, 0)
    for i in range(SIDE-size):
        for j in range(SIDE-size):
            t_sum = sum([x for y in grid[i:i+size] for x in y[j:j+size]])
            if not m_val or t_sum > m_val:
                m_val = t_sum
                m_index = (j+1, i+1)
    return m_val, m_index

def l_num(serial_no, size):
    m_val = None
    m_index = (0, 0)
    for i in range(1, SIDE+1-size):
        for j in range(1, SIDE+1-size):
            t_sum = sum([grid_val(x, y, serial_no) for y in range(i, i+size) \
                    for x in range(j, j+size)])
            if not m_val or m_val < t_sum:
                m_val = t_sum
                m_index = (j, i)
    return m_val, m_index

def gsum(grid, x, y, size):
    return sum([i for j in grid[y:y+size] for i in j[x:x+size]])

# Too easy to get thrown off the scent
def drill_down(grid):
    s1 = 300
    x, y = 0, 0
    val = gsum(grid, x, y, s1)
    deltas = [(0,0), (1,0), (0,1), (1,1)]
    maxes = None
    while s1 > 0:
        s1 -= 1
        # Four nested squares
        ds = (0,0)
        # Pick temporary best
        vt = None
        for d in deltas:
            v = gsum(grid, x+d[0], y+d[1], s1)
            if not vt or v>vt:
                vt = v
                ds = d
        x += ds[0]
        y += ds[1]
        if val < vt:
            val = vt
            maxes = (val, (x, y), s1)
    return maxes

# Also too inaccurate
def box_grow(grid):
    maxes = None
    mval = grid[0][0]
    for i in range(SIDE):
        for j in range(SIDE):
            s = 1
            val = grid[i][j]
            check = 0
            while i+s<SIDE and j+s<SIDE:
                tv = sum([x for y in grid[i:i+s] for x in y[j:j+s]])
                if tv < val:
                    check += 1
                elif mval < tv:
                    mval = tv
                    print(mval)
                    maxes = (mval, (j+1, i+1), s)
                    check = 0
                else:
                    check = 0
                if check>5:
                    break
                val = tv
                s += 1
    return maxes


def pretty_print(grid):
    for i in grid:
        for j in i:
            print(i, end='')
        print()

def run(serial_no):
    g = populate(serial_no)
    #print(l_num(serial_no, 3))
    #pretty_print(g)
    #print(drill_down(g))
    print(box_grow(g))

    #print(max([(largest(g, s),s) for s in range(1, 301)], \
    #        key=lambda x: x[0])) 
    #print(largest(g, 3))

        

run(5093)

