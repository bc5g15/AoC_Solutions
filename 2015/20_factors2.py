#20_factors2.py - Infinite elves to infinite houses, a much quicker algorithm

data = 33100000
house = []
#Trial
for i in range(1, data/10):
    for j in range(i, data/10, i):
        if(j<len(house)):
            house[j] += i*10
        else:
            house.append(i*10)

for x in range(len(house)):
    if(house[x]>=data):
        print x
        break

