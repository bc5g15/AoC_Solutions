#24_quantum4.py - The END!
datax = [1, 3, 5, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]
data = [11, 10, 9, 8, 7, 5, 4, 3, 2, 1]
def get_pack_size(array):
    k = sum(array)
    return (k/4)

def match(num, size, arr, total=0, mine = []):
    if num > 1:
        result = []
        l = list(mine)
        for x in range(len(arr)-1):
            tot = total + arr[x]
            l.append(arr[x])
            k = match(num-1, size, arr[x+1:], tot, l)
            if(k!=0):
                result += k
            l.remove(arr[x])
        if(result != []):
            if(len(result) == 1):
                return result[0]
            else:
                return result
        else:
            return 0
        
    if (num == 1):
        l = list(mine)
        for item in arr:
            if(total + item == size):
                l.append(item)
                return l
        return 0

def get_best(arr, num):
    bestqe = 0
    k = []
    qe = 0
    for x in range(0, len(arr), num):
        qe = arr[x]
        for y in range(1,num):
            qe *= arr[x+y]
        if(bestqe == 0 or qe < bestqe):
            for l in range(num):
                k.append(arr[l+x])
            bestqe = qe
    print k, bestqe

def two_box(arr, pack):
    total = 0
    arr.sort(None, None, True)
    #array of indexes
    used = []
    for item in arr:
        if(total + item < pack):
            total += item
            used.append(item)
            print arr.index(item)
        elif(total + item == pack):
            used.append(arr.index(item))
            temp = list(arr)
            print temp
            print used
            for stuff in used:
                temp.remove(stuff)
            print sum(temp)
            print temp
            if(sum(temp) == pack):
                return True
            used.remove(arr.index(item))
    return False

def two_again(arr, pack):
    x = 0
    y = 1
    while(x==0):
        y+=1
        x = match(y, pack, arr)
    for n in range(0, len(x), y):
        k = []
        for m in range(y):
            k.append(x[n+m])
        temp = list(arr)
        for item in k:
            temp.remove(item)

        if(sum(temp) == pack):
            return True
    return False

def three_box(arr, pack):
    x=0
    y=1
    while(x==0):
        y+=1
        x = match(y, pack, arr)
    for n in range(0, len(x), y):
        k = []
        for m in range(y):
            k.append(x[n+m])
        temp = list(arr)
        for item in k:
            temp.remove(item)
        good = two_again(temp, pack)
        if(good):
            return True
        

def get_all_valid(arr, data, num):
    valid = []
    pack = get_pack_size(data)
    for x in range(0, len(arr), num):
        k = []
        for y in range(num):
            k.append(arr[x+y])
        temp = list(data)
        for item in k:
            #print item
            temp.remove(item)
        check = three_box(temp, pack)
        if(check):
            for item in k:
                valid.append(item)
    return valid
        
    

def test(arr, num):
    size = get_pack_size(arr)
    return match(num, size, arr)
    
def finaltest(arr):
    size = get_pack_size(arr)
    print size
    x = 0
    y = 1
    while(x==0):
        y+=1
        x = match(y, size, arr)

    print len(x), y
    truth = get_all_valid(x, arr, y)
    print len(truth)
    get_best(truth, y)
        
    
