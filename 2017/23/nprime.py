start= 108400
end = 125400
step = 17


def is_nprime(x):
    for i in range(2, x // 2):
        if x % i == 0:
            return 1
    return 0

def find_nprimes(start, end, step):
    v = start
    acc = 0
    while v <= end:
        acc += is_nprime(v)
        v += step
    return acc

print(find_nprimes(start, end, step))

