#05_naughtynicetwo.py - More string checking!

def checkstring(string):
    tworepeat = False
    onerepeat = False
    prevletter = ' '
    for x in range(0,len(string)):
        letter = string[x]
        if(string.count((prevletter + letter)) >1):
            tworepeat = True
        if(x+2 < len(string)):
            if(letter == string[x+2]):
                onerepeat = True
        prevletter = letter
    if(onerepeat and tworepeat):
        return 1
    else:
        return 0

string = raw_input().strip()
totalnice = 0
total = 0
while(string != ""):
    total += 1
    totalnice += checkstring(string)
    string = raw_input().strip()

print totalnice
print total


    
