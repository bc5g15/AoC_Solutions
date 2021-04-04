#16_aunts.py - Which aunt is this?

sue = {}

check = {}

def get_aunts():
    t = raw_input().strip().split(" ")
    while(t!=['']):
        no = int(t[1][:-1])
        sue[no] = {}
        for x in range(len(t)):
            if(t[x] == "cars:"):
                sue[no]["cars"] = int(t[x+1].strip(','))
            elif(t[x] == "cats:"):
                sue[no]["cats"] = int(t[x+1].strip(','))
            elif(t[x] == "samoyeds:"):
                sue[no]["samoyeds"] = int(t[x+1].strip(','))
            elif(t[x] == "pomeranians:"):
                sue[no]["pomeranians"] = int(t[x+1].strip(','))
            elif(t[x] == "akitas:"):
                sue[no]["akitas"] = int(t[x+1].strip(','))
            elif(t[x] == "vizslas:"):
                sue[no]["vizslas"] = int(t[x+1].strip(','))
            elif(t[x] == "goldfish:"):
                sue[no]["goldfish"] = int(t[x+1].strip(','))
            elif(t[x] == "trees:"):
                sue[no]["trees"] = int(t[x+1].strip(','))
            elif(t[x] == "cars:"):
                sue[no]["cars"] = int(t[x+1].strip(','))
            elif(t[x] == "perfumes:"):
                sue[no]["perfumes"] = int(t[x+1].strip(','))
        t = raw_input().strip().split(" ")
    
def check_match():
    t = raw_input().strip().split(" ")
    while(t!=['']):
        check[t[0][:-1]]= int(t[1])
        t = raw_input().strip().split(" ")

def get_best_match():
    best = 0
    num = 0
    for x in range(1, 501):
        match = 0
        for item in sue[x]:
            if (sue[x][item] == check[item]):
                match += 1
        if(match > best):
            best = match
            num = x
    print "best match:", num, "matches", best
