#20_factors.py - Infinite elves to infinite houses

def calc(value):
    factors = get_factors(value)
    return (sum(factors)*10 + value*10)

def get_factors(number):
    factors = []
    for x in range(0, (number)/2):
        if(number % (x+1) == 0):
            factors.append(x+1)
    return factors

def rev_calc(value):
    k = value/10
      
def prime(number):
    factors = []
    for x in range(2, (number)):
        if(number % (x) == 0):
            if(prime(x) == []):
                factors.append(x)
            else:
                k = prime(x)
                for item in k:
                    factors.append(item)
    return factors

compare = 33100000
x = 1
k = 624317
while(x<compare):
    k+=1
    x = calc(k)
    #print x
    if(k>compare):
        print "Error"
        break
print k


