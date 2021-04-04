#24_quantum.py - packing in 3 containers

data = [11, 10, 9, 8, 7, 5, 4, 3, 2, 1]

def get_pack_size(array):
    k = sum(array)
    return (k/3)

def pack(arr):
    max_pack = get_pack_size(arr)
    results = []
    attempt = []
    temp = list(arr)
    x = 0
    while(len(temp) > 0):
        x = (x+1) % len(temp)
        item = temp[x]
        attempt.append(item)
        
        if(sum(attempt) == max_pack):
            results.append(attempt)
            print results
            temp.remove(item)
            attempt = []
            
        elif(sum(attempt) > max_pack):
            attempt.remove(item)
        else:
            temp.remove(item)

        if(len(results) == 2 and sum(temp) == max_pack):
            final = [results[0], results[1], temp]
            m = max(final)
            final.remove(m)

            return m, final[0], final[1]
        elif(len(results) == 2 and sum(temp) > max_pack):
             #Algorithm failure
             return 0
    
def pack2(arr):
    max_pack = get_pack_size(arr)
    results = []
    temp = list(arr)
    attempt = []
    packed = False
    done = []
    bad = []
    tried = []
    while(not packed):
        ttried = []
        for item in temp:
            if(item not in done):
                if(sum(attempt) + item < max_pack):
                    attempt.append(item)
                    ttried.append(item)
                    done.append(item)
                elif(sum(attempt) + item == max_pack):
                    if(attempt not in bad):
                        attempt.append(item)
                        done.append(item)
                        results.append(attempt)
                        attempt = []
        if(len(results) == 2):
            for item in done:
                temp.remove(item)
            if(sum(temp) == max_pack):
                return results[0], results[1], temp
        
                
        if(len(results) == 3):
            return results[0], results[1], results[2]
            
def pack3(arr):
    max_pack = get_pack_size(arr)
    packs = []
    attempt = []
    packed = False
    bad = []
    
    while(True):
        found = 0
        attempt = []
        oldpak = len(packs)
        oldbad = len(bad)
        for item in arr:
            k = sum(attempt)
            if(item + k == max_pack):
                attempt.append(item)
                if(attempt in packs):
                    attempt.remove(item)
                else:
                    packs.append(attempt)
                    print len(packs)
                    attempt = []
            if(item + k < max_pack):
                attempt.append(item)
                if(attempt in bad):
                    attempt.remove(item)
        if(not (attempt == [])):
            bad.append(attempt)
        if(len(packs) == oldpak and len(bad) == oldbad):
            return packs

def simple_rec(max_pack, attempt, remain):
    for item in remain:
        k = sum(attempt)
        
def get_next(max_pack, total, arr):
    results = []
    for item in arr:
        if(total + item == max_pack):
            results.append(item)
        elif(total + item < max_pack):
            None
        

def recursion(max_pack, arr):
    xpos = 0
    for x in range(arr):
        attempt = [arr[x]]
        
        
    
    

def pack4(arr):
    max_pack=get_pack_size(arr)
    packs = []
    
    
        
def combo(arr):
    packs = pack3(arr)
    one = []
    two = []
    three = []
    results = []
    for item1 in packs:
        one = item1
        for item2 in packs:
            goodtwo=True
            for unit in item2:
                if(unit in one):
                    goodtwo = False
            if(goodtwo):
                two = item2
                for item3 in packs:
                    goodthree = True
                    for unit2 in item3:
                        if(unit2 in one or unit2 in two):
                                goodthree=False
                    if(goodthree):
                        three = item3
                        results.append((one,two,three))

    #Strip out duplicates
    remove = []
    for x in range(len(results)-1):
        one = results[x][0]
        two = results[x][1]
        three = results[x][2]
        for y in range(x+1, len(results)):
            k = results[y]
            if(one in k and two in k and three in k):
                remove.append(k)
        
    for item in remove:
        try:
            results.remove(item)
        except:
            None
    return results

def get_qe(item):
    x = item[0]
    for n in range(1, len(item)):
        x *= item[n]
    return x

def best(arr):
    results = combo(arr)
    best = []
    short = 100
    qe = 0
    for item in results:
        for unit in item:
            if(len(unit) < short):
                best = item
                short = len(unit)
                qe = get_qe(unit)
            elif(len(unit) == short):
                temp = get_qe(unit)
                if(temp < qe):
                    best = item
                    short = len(unit)
                    qe = get_qe(unit)
    return best, short, qe
                
                   
arr = []
t = raw_input().strip()
while(t!=""):
    arr.append(int(t))
    t = raw_input().strip()

