def add_m(num, current, arr):
    x = len(arr)
    if num % 23 == 0:
        np = (current-7)%x
        s = num
        n = arr.pop(np)
        print(s, n)
        return (s+n, np)
    else:
        jmp = 2
        if x<=2:
            jmp = 1
        np = (current + jmp)%x
        arr.insert(np, num)
        return (0,np)
    
def run(players, max_m):
    arr = [0]
    pls = {}
    pl = 0
    pos = 0
    for i in range(1, max_m+1):
        scr, pos = add_m(i, pos, arr)
        if scr > 0:
            pls[pl] = pls.get(pl, 0) + scr
        pl = (pl + 1) % players
    m = max(pls, key=lambda x: pls[x])
    print(m, pls[m])

run(493, 7186300)

# Part 1 - Done! Surprised it worked

