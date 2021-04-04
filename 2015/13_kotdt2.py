#13_kotdt2.py - A second experiment with this challenge

rankings = {}
people = []

def add_rank(a, b, value):
    if((a,b) in rankings):
        rankings[a,b] += value
    elif((b,a) in rankings):
        rankings[b,a] += value
    else:
        rankings[a,b] = value

def get_rank(a,b):
    if((a,b) in rankings):
        return rankings[a,b]
    elif((b,a) in rankings):
        return rankings[b,a]
    else:
        return -999

#I don't even want to think about this moon logic
def simple(start):
    results = []
    total = 0
    first = ""
    last = ""
    current = ""

    remaining = list(people)
    first = remaining.pop(start)
    current = first
    results.append(current)
    while(current!="DONE"):
        best = ""
        result = -999
        for item in remaining:
            if(result == -999 or result < get_rank(current,item)):
                result = get_rank(current, item)
                best = item
        total += result
        #print result, current, best
        results.append(best)
        current = best
        remaining.remove(best)
        
        if(remaining == []):
            last = current
            current = "DONE"

    total += get_rank(first, last)
    #print get_rank(first, last), last, first
    print results
    return total
    
                
        


#Input scanning
#Read Data
t = raw_input().strip().split(" ")
#take out the trailing stop
t[10] = t[10][:len(t[10])-1]
while(t!=['']):
    a = t[0]
    b = t[10]
    c = 0
    if(t[0] not in people):
        people.append(t[0])
    if(t[10] not in people):
        people.append(t[10])
    if(t[2] == "gain"):
        c = int(t[3])
    elif(t[2] == "lose"):
        c = -int(t[3])

    add_rank(a,b,c)
    t = raw_input().strip().split(" ")
    try:
        t[10] = t[10][:len(t[10])-1]
    except:
        None

#Part 2... Add myself to the mix! But I don't care who I sit next too
for x in people:
    add_rank("Me", x, 0)
people.append("Me")

#Find best seating arrangement
final_result = 0
for x in range(0,len(people)):
    y = simple(x)
    if(final_result < y):
        final_result = y
print final_result
