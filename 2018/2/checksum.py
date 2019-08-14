
def count_letters(st):
    out = {}
    for l in st:
        out[l] = out.get(l, 0) + 1
    return out

def diff(s1, s2):
    df = 0
    norm = []
    for i in range(len(s1)):
        if s1[i] == s2[i]:
            norm.append(s1[i])
        else:
            df += 1
    return (df, norm)

def run(fname, part2=False):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip())>0]
    
    twos = 0
    threes = 0

    for l in lines:
        lets = count_letters(l)
        if 3 in lets.values():
            threes += 1
        if 2 in lets.values():
            twos += 1
    #return twos * threes
    if part2:
        l = len(lines)
        for i in range(l):
            for j in range(i+1, l):
                df, n = diff(lines[i], lines[j])
                if df == 1:
                    return "".join(n)

print(run("in.txt", part2=True))

# 6150 - Correct!

