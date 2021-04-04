#11_passwordincrement.py - Incrementing an 8 letter string, and some restrictions

alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

bad = ['i','o','l']

def getalphalen(letter, increase):
    index = alpha.index(letter)
    if(index + increase > len(alpha)-1):
        return ""
    else:
        return alpha[index+increase]

def incstring(string):
    output = [''] * len(string)
    #Compute output list
    for x in range(len(string)):
        output[x] = string[x]
        
    for x in range(len(string)):
        y = len(string)-x-1
        if(string[y] == 'z'):
            output[y] = 'a'
        else:
            output[y] = alpha[alpha.index(string[y]) + 1]
            break
    #print str(output)
    outstr = ""
    for x in range(len(string)):
        outstr += output[x]
    return outstr

            
t = raw_input().strip()
valid = False
validout = ""
while(not valid):
    t = incstring(t)
    straight = False
    dup1 = False
    dup2 = False
    dup1loc = []
    prevletter = ''
    for x in range(len(t)):
        letter = t[x]
        if letter in bad:
            break
        if(x+2 < len(t)-1):
            if(t[x+1] == getalphalen(letter, 1) and\
               t[x+2] == getalphalen(letter, 2)):
                straight = True
        if(dup1loc == []):
            if(letter == prevletter):
                dup1 = True
                dup1loc = [t.index(letter), t.index(prevletter)]
        else:
            if(letter == prevletter):
                if(t.index(letter) not in dup1loc and t.index(prevletter) not in dup1loc):
                    dup2 = True
        
        prevletter = letter
    if(dup1 and dup2 and straight):
        validout = t
        valid = True

print validout
