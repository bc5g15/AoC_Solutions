#07_logic.py - doing some bitwise logic
MAX = (2**16) - 1
numbers = ["0","1","2","3","4","5","6","7","8","9"]

stor = {}
stor["1"] = ["1"]
stor["0"] = ["0"]

values = {}

def get(key):
    if(key in stor):
        return stor[key]
    else:
        stor[key] = 0
        return stor[key]



def logic(t):
    if(t[0] == "NOT"):
        stor[t[3]] = MAX - get(t[1])
    elif(t[1] == "->"):
        if(t[0][0] in numbers):
            stor[t[2]] = int(t[0])
        else:
            stor[t[2]] = get(t[0])
    elif(t[1] == "AND"):
        stor[t[4]] = get(t[0]) & get(t[2])
    elif(t[1] == "OR"):
        stor[t[4]] = get(t[0]) | get(t[2])
    elif(t[1] == "LSHIFT"):
        stor[t[4]] = (get(t[0]) << int(t[2])) % MAX
    elif(t[1] == "RSHIFT"):
        stor[t[4]] = get(t[0]) >> int(t[2])

def logic2(key):
    #find the value of a specific wire!
    #First character of first item in a specific entry in dictionary
    #print stor[key], key
    if(key in values):
        return values[key]

    if(len(stor[key]) == 1):
        if(stor[key][0][0] in numbers):
            #print int(stor[key][0])
            k = int(stor[key][0])
        else:
            k= logic2(stor[key][0])
    elif(stor[key][0] == "NOT"):
         k= (MAX - logic2(stor[key][1]))
    elif(stor[key][1] == "AND"):
         a= logic2(stor[key][0])
         b = logic2(stor[key][2])
         k = a & b      
    elif(stor[key][1] == "OR"):
         a= logic2(stor[key][0])
         b= logic2(stor[key][2])
         k = a | b
    elif(stor[key][1] == "LSHIFT"):
         a= logic2(stor[key][0])
         b= int(stor[key][2])
         k= (a << b) % MAX
    elif(stor[key][1] == "RSHIFT"):
         a= logic2(stor[key][0])
         b= int(stor[key][2])
         k = a >> b
    values[key] = k
    return k
    
    


t = raw_input().strip().split("->")
print t
while(t!=['']):
    stor[t[1].strip()] = t[0].strip().split(" ")
    t = raw_input().strip().split("->")

#Part 2 - comment out to get part 1
stor['b'] = [str(logic2('a'))]
#Reset the shortcut table
values = {}
print logic2('a')

