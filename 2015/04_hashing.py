#Day 4 challenge - AdventCoin mining with MD5 hashing!
import hashlib

prelim = 'bgvyzdsv'

m = hashlib.md5()

running = True

value = 0

while(running):
    value += 1
    m = hashlib.md5(prelim + str(value))
    r = m.hexdigest()
    if (str(r[:6]) == '000000'):
        running = False
        

print m.hexdigest()
print value
