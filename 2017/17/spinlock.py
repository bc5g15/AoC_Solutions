
STEP = 376

arr = []

def check_writes(max_len=50000000):
    index = 0
    output = []
    n = 0 
    old = 0
    while n < max_len:
        p = (old + 1 + STEP) % (n+1)
        if p == 0:
            #output.append(n+1)
            print(n+1)
        old = p
        n += 1
    return output

print(check_writes())
    

