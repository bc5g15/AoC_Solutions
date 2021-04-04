#08_repr.py - reverting a string into a rawer state
bs = "\\"[0]
print bs
dq = '"'[0]
print dq
sq = "'"[0]
print sq

def raw(string):
    output = 0
    for letter in string:
        if(letter == dq or letter == sq or letter == bs):
           output+= 2
        else:
             output += 1
    return output

original = 0
encoded = 0
t = raw_input().strip()
while(t!=""):
    original += len(t)
    encoded += raw(t) + 2
    t = raw_input().strip()

print encoded - original
print original
print encoded
