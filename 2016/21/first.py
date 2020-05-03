LISTIN = ["a","b","c","d","e", 'f', 'g', 'h']

def swap_pos(x, y, lin):
    l = list(lin)
    temp = l[x]
    l[x] = l[y]
    l[y] = temp
    return l

def swap_letter(a, b, lin):
    l = list(lin)
    ina = l.index(a)
    inb = l.index(b)
    return swap_pos(ina, inb, l)

def reverse_pos(x, y, lin):
    l = list(lin)
    # print(LISTIN[x:y+1])
    l2 = l[x:y+1]
    l2 = l2[::-1]
    # print(LISTIN[x:y+1].reverse())
    l[x:y+1:1] = l2
    return l

def rotate_pos(x, lin):
    l = list(lin)
    return l[x:] + l[:x]

def move_pos(x, y, lin):
    l = list(lin)
    letter = l[x]
    l.remove(letter)
    l.insert(y, letter)
    return l

def rotate_letter(a, lin):
    l = list(lin)
    index = l.index(a) + 1
    if(index>4): index+=1
    return rotate_pos(-index % len(LISTIN), l)


# print(LISTIN)
# swap_pos(0, 4)
# print(LISTIN)
# swap_letter('d', 'b')
# print(LISTIN)
# reverse_pos(0, 4)
# print(LISTIN)
# rotate_pos(1)
# print(LISTIN)
# move_pos(1, 4)
# print(LISTIN)
# move_pos(3,0)
# print(LISTIN)
# rotate_letter('b')
# print(LISTIN)
# rotate_letter('d')
# print(LISTIN)

def fancyPrint(l):
    myOut = ""
    for letter in l:
        myOut = myOut + letter
    
    print(myOut)

def parse_in(fname):
    f = open(fname, 'r')
    l = LISTIN
    for line in f:
        lang = line.strip().split(" ")

        if lang[0] == "swap":
            if lang[1] == "position":
                l = swap_pos(int(lang[2]), int(lang[5]), l)
            elif lang[1] == "letter":
                l = swap_letter(lang[2], lang[5], l)

        elif lang[0] == "rotate":
            if lang[1] == "left":
                l = rotate_pos(int(lang[2]), l)
            elif lang[1] == "right":
                l = rotate_pos(-int(lang[2]), l)
            elif lang[1] == "based":
                l = rotate_letter(lang[6], l)
        
        elif lang[0] == "reverse":
            l = reverse_pos(int(lang[2]), int(lang[4]), l)
        
        elif lang[0] == "move":
            l = move_pos(int(lang[2]), int(lang[5]), l)
        print(line.strip())
        print(l)
        fancyPrint(l)
        
def test(fname):
    global LISTIN
    LISTIN = ['a', 'b', 'c', 'd', 'e']
    parse_in(fname)

# test('test.txt')
# parse_in("in.txt")

"""
Consider reversing the operations...
Swapping positions and letters don't need to be changed at all
Likewise reversing is just the same
Moving is the same, except with the start and destination
values swapped.
A left rotation is cancelled by a right one, so that is easy
Rotating based on the position of a letter is the most tricky one

"""

# def rev_rotate_letter(a):
#     index = len(LISTIN) - (LISTIN.index(a)+1)
#     if(index>4): index-=1
#     rotate_pos(-index % len(LISTIN))

# LISTIN = ['a','b','c','d','e']
# fancyPrint(LISTIN)
# l = LISTIN
# for i in range(len(LISTIN)+1):
#     l2 = rotate_letter("c",l)
#     fancyPrint()
# rotate_letter("c")
# fancyPrint()
# rotate_letter("c")
# fancyPrint()
# rev_rotate_letter("e")
# fancyPrint()

# Rotate mappings
mymap = {}
l = ['a','x','x','x','x','x','x','x']
# print(len(l))
for i in range(len(LISTIN)):
    a = l.index('a')
    l2 = rotate_letter('a', l)
    b = l2.index('a')
    # fancyPrint(l)
    # fancyPrint(l2)
    # print(str(l) + " -> " + str(l2))
    
    if b in mymap:
        mymap[b] += [a]
    else:
        mymap[b] = [a]
    
    l = rotate_pos(-1, l)

def rev_rotate_letter(letter, lin):
    a = lin.index(letter)
    b = mymap[a][0]
    r = (a-b) % len(lin)
    return rotate_pos(r, lin)

# l = LISTIN
# print(l)
# l = rotate_letter("c", l)
# print(l)
# l = rev_rotate_letter("c", l)
# print(l)
# print(l==LISTIN)

for i in range(len(LISTIN)):
    l = LISTIN
    print(l)
    l = rotate_letter(LISTIN[i], l)
    print(l)
    l = rev_rotate_letter(LISTIN[i], l)
    print(l)
    print(l==LISTIN)

# print(mymap)
# for i in range(len(LISTIN)):
#     if i not in mymap:
#         print(i + " not reachable")
#     else:
#         print(str(i) + " from " + str(mymap[i]))

def reverse_in(fname):
    f = open(fname, 'r')
    l = LISTIN
    cmd = []
    for line in f:
        cmd.append(line)

    for line in cmd[::-1]:
        lang = line.strip().split(" ")

        if lang[0] == "swap":
            if lang[1] == "position":
                l = swap_pos(int(lang[2]), int(lang[5]), l)
            elif lang[1] == "letter":
                l = swap_letter(lang[2], lang[5], l)

        elif lang[0] == "rotate":
            if lang[1] == "left":
                l = rotate_pos(-int(lang[2]), l)
            elif lang[1] == "right":
                l = rotate_pos(int(lang[2]), l)
            elif lang[1] == "based":
                l = rev_rotate_letter(lang[6], l)
        
        elif lang[0] == "reverse":
            l = reverse_pos(int(lang[2]), int(lang[4]), l)
        
        elif lang[0] == "move":
            l = move_pos(int(lang[5]), int(lang[2]), l)
        print(line.strip())
        print(l)
    fancyPrint(l)

LISTIN = ['f','b','g','d','c','e','a','h']
reverse_in("in.txt")