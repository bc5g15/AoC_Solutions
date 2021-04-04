#12_json.py - Reading a json format file
import json

def sumarray(k):
    total = 0
    for i in k:
        if(type(i) == dict):
            total += sumdict(i)
        elif(type(i) == list):
            total += sumarray(i)
        else:
            try:
                total += i
            except:
                None
    return total

def sumdict(k):
    total = 0
    for i in k:
        if(type(k[i]) == list):
            total += sumarray(k[i])
        elif(type(k[i]) == dict):
            total += sumdict(k[i])
        else:
            try:
                total += k[i]
            except:
                None
    return total
    
    
t = raw_input().strip()
k = json.loads(t)

if(type(k) == list):
    total = sumarray(k)
else:
    total = sumdict(k)

print total

