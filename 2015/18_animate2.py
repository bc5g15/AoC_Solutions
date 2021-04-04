#18_animate.py - Animated lighting system!

data = []

def get_start():
    t = raw_input().strip()
    while(t!=""):
        data.append(t)
        t = raw_input().strip()

    #retranslate
        output = ""
    for index in range(len(data[0])):
        if(index == 0 or index == len(data[0])-1):
            output += '#'
        else:
            output += data[0][index]
    data[0] = output
    output = ""
    
    for index in range(len(data[len(data)-1])):
        if(index == 0 or index == len(data[len(data)-1])-1):
            output += '#'
        else:
            output += data[len(data)-1][index]
    data[len(data)-1] = output
        

def get_neighbours(y, x):
    on = 0
    for a in range(y-1, y+2):
        for b in range(x-1, x+2):
            if((not (a==y) or not (b==x)) and (a>=0 and a<len(data)) and\
               (b>=0 and b<len(data[a]))):
                try:
                    if(data[a][b] == '#'):
                        on += 1
                except:
                    print "out of range!"
    return on

def update(datax):
    output = []
    for y in range(len(datax)):
        hapstring = ""
        for x in range(len(datax[y])):
            neighbours = get_neighbours(y, x)
            if((y == 0 and x == 0) or (y==len(datax)-1 and x == len(datax[y])-1)\
               or (y==len(datax)-1 and x == 0) or (y==0 and x == len(datax[y])-1)):
                hapstring += '#'
            elif(datax[y][x] == '#'):
                if(neighbours == 2 or neighbours == 3):
                    hapstring += "#"
                else:
                    hapstring += "."
            else:
                if(neighbours == 3):
                    hapstring += "#"
                else:
                    hapstring += "."
        output.append(hapstring)
    return list(output)

def lightson():
    count = 0
    for row in data:
        for letter in row:
            if(letter == "#"):
                count += 1
    return count

get_start()

for x in range(100):
    data = update(data)

print lightson()
