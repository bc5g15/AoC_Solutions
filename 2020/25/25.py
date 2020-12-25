def process(val, subj):
    val = val * subj
    val = val % 20201227
    return val

def processTimes(n, subj):
    v = 1
    while n > 0:
        n = n - 1
        v = process(v, subj)
    return v 

def gs(key, sub):
    n = 1
    val = process(1, sub)
    while not val == key:
        n = n + 1
        val = process (val, sub)
    return n

# Test input
# key1 = 5764801
# key2 = 17807724

# Live input
key1 = 17607508
key2 = 15065270

size1 = gs(key1, 7)
size2 = gs(key2, 7)

p1 = processTimes(size1, key2)
p2 = processTimes(size2, key1)
print(p1, p2)