#20_factors3.py - Infinite elves to infinite houses, a much quicker algorithm
#Part 2

data = 33100000
house = [0]

for k in range(data/10):
    house.append(0)

#Trial
for i in range(1, data/10):
    x = 0
    for j in range(i, data/10, i):
        house[j] += i*11
        x+=1
        if(x==51):
            #print i, j
            break

for x in range(len(house)):
    if(house[x]>=data):
        print x
        break

