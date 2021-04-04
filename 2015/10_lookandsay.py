#10_lookandsay.py - An implementation of the look and say algorithm


def looksee(t):
    l=t[0]
    num = 0

    output = ""

    for x in range(len(t)):
        if(t[x] == l):
            num += 1
        else:
            output += str(num) + l
            l = t[x]
            num = 1

    output += str(num) + l
    return output


t = raw_input().strip()
for n in range(50):
    t = looksee(t)

print len(t)
