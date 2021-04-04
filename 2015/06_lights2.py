#06_lights.py - Enabling and disabling from string input

lights = []
for l in xrange(1000):
    lights.append([])
    for r in xrange(1000):
        lights[l].append(0)
    

#I'm pretty sure this is the kind of array we want. Not exactly intuitive

t = raw_input().strip().split(" ")
while(t != ['']):
    if(t[0]=="toggle"):
        x1, y1 = t[1].split(",")
        x2, y2 = t[3].split(",")
        x1 ,x2, y1, y2 = int(x1), int(x2), int(y1), int(y2)
        for x in range(x1, x2+1):
            for y in range(y1, y2+1):
                lights[x][y]+=2
    elif(t[0] == "turn"):
        x1,y1 = t[2].split(",")
        x2,y2 = t[4].split(",")
        x1,x2,y1,y2 = int(x1),int(x2),int(y1),int(y2)
        if(t[1] == "on"):
            for x in range(x1,x2+1):
                for y in range(y1,y2+1):
                    lights[x][y] +=1 
        elif(t[1] == "off"):
            for x in range(x1, x2+1):
                for y in range(y1, y2+1):
                    if(lights[x][y] >0):
                        lights[x][y] -=1
                
    t = raw_input().strip().split(" ")

total = 0
for x in xrange(1000):
    total+= sum(lights[x])

print total
