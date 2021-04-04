#13_kotdt.py - Finding optimal seating arrangements

seating = {}
people = []

def best_seats():
    output = 0
    for person in people:
        item1 = (0, 0)
        item2 = (0, 0)
        #Find best neighbours
        for items in seating[person]:
            #Find highest 2
            
            if (items[0] > item1[0]):
                item2 = item1
                item1 = items
        
            
            
        

#Read Data
t = raw_input().strip().split(" ")
#take out the trailing stop
t[10] = t[10][:len(t[10])-1]
while(t!=['']):
    if(t[0] not in people):
        people.append(t[0])
        seating[t[0]] = []
    if(t[10] not in people):
        people.append(t[10])
        seating[t[10]] = []
    if(t[2] == "gain"):
        seating[t[0]].append((int(t[3]), t[10]))
    elif(t[2] == "lose"):
        seating[t[0]].append((-int(t[3]), t[10]))
    t = raw_input().strip().split(" ")
    try:
        t[10] = t[10][:len(t[10])-1]
    except:
        None

