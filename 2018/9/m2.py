import math

def position(value, scur=1, sval=2):
    if value == 1:
        return 1
    if value == 0:
        return 0
    cur = scur
    for i in range(sval, value+1):
        if i % 23 == 0:
            cur = (cur - 7) % ((i+1) - math.floor(i/23))
        else:
            #print(cur, i)
            cur = ((cur+1) % ((i) - math.floor(i/23))) + 1
    return cur

