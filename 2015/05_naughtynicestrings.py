#05_naughtynicestrings.py - A whole bunch of string manipulation

vowels = ['a','e','i','o','u']
naughty = ['ab','cd','pq','xy']

def checkstring(string):
    totalvowels = 0
    repeated = False
    prevchar = ''
    for letter in string:
        if(prevchar + letter) in naughty:
            return 0
        if(letter in vowels):
            totalvowels += 1
        if(letter == prevchar):
            repeated = True
        prevchar = letter

    if (totalvowels >=3 and repeated):
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
