
def getLowers(i, xs, myMap):
    for _ in range(i-1):
        i = i-1
        if i not in xs and i >= 1:
            return i
    return getLowerMax(max(myMap), xs)

def getLowerMax(maxx, xs):
    if maxx not in xs:
        return maxx
    else:
        return getLowerMax(maxx-1, xs)

def findDest(i, xs, myMap):
    return getLowers(i, xs, myMap)

def addAt(i, xs, myMap):
    [a,b,c] = xs
    myEnd = myMap[i]
    myMap[i] = a
    myMap[c] = myEnd

def move(current, myMap):
    a = myMap[current]
    b = myMap[a]
    c = myMap[b]
    endpoint = myMap[c]
    dest = findDest(current, [current, a,b,c], myMap)
    addAt(dest, [a,b,c], myMap)
    myMap[current] = endpoint
    return (endpoint, myMap)

def fromOne(myMap):
    myOut = "1"
    myOut = myOut + str(myMap[1])
    current = myMap[1]
    while myMap[current] != 1:
        myOut = myOut + str(myMap[current])
        current = myMap[current]
    return myOut[1:]


def relevant2(myMap):
    fst = myMap[1]
    snd = myMap[fst]
    return (fst, snd)

def main(instring):
    cups = [int(r) for r in instring]
    first = int(instring[0])
    last = int(instring[len(instring)-1])
    cd = {}
    for c in range(len(cups)-1):
        cd[cups[c]] = cups[c+1]
    cd[last] = first
    current = first
    mp = cd
    for _ in range(100):
        (current, mp) = move(current, mp)
    print(fromOne(mp))

    # Part 2

    cups2 = cups + list(range(10, 1000001))
    cd2 = {} 
    for c in range(len(cups2)-1):
        cd2[cups2[c]] = cups2[c+1]
    last = cups2[len(cups2)-1]
    cd2[last] = first
    current = first
    mp = cd2
    for _ in range(10000000):
        (current, mp) = move(current, mp)

    (a, b) = relevant2(mp)
    print(a*b)

main("318946572")