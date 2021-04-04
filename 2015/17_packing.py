#17_packing.py - Fitting things exactly into containers

contain = []

def get_containers():
    #Should be a number
    t = raw_input().strip()
    while(t!=""):
        contain.append(int(t))
        t = raw_input().strip()
    contain.sort(None, None, True)

def pack(val):
    right = []
    current = []
    comb = 0
    finished = False
    done = []
    while(not finished):
        current = []
        temp = []
        total = 0
        x=0
        for x in range(len(contain)):

            if(total + sum(contain[x:len(contain)]) <val):
                done.append(current)
            else:
                current.append(x)
                total += contain[x]
                
                if(current in done):
                    current.remove(x)
                    total -= contain[x]
                elif(total > val):
                    total -= contain[x]
                    current.remove(x)
                elif(total == val):
                    temp = list(current)
                    done.append(temp)
                    right.append(temp)
                    current.remove(x)
                    total -= contain[x]
                    comb += 1

        temp = list(current)
        #print temp
        done.append(temp)
        if(current == []):
            finished = True
            print comb

    smallest = 0
    best = []
    for item in right:
        if(len(item) < smallest or smallest == 0):
            smallest = len(item)
            best = item
    print smallest, best
        
