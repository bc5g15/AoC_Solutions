#25_diagonal.py - christmas day puzzle!

data = []
value = 18361853

def populate():
    global data
    row = col = 7000
    count = 1
    for y in range(row):
        data.append([])
        for x in range(col):
            data[y].append(0)

    #diagonal traversing
    for z in range(row):
        k = z
        c = 0
        data[z][0] = count
        count += 1

        while(k>0):
            k-=1
            c += 1
            data[k][c] = count
            count+=1
        

def get_code(itr):
    value = start = 20151125
    mult = 252533
    mod = 33554393

    if(itr==1):
        return start
    else:
        for x in range(itr-1):
            value *= mult
            value = value % mod
    return value
