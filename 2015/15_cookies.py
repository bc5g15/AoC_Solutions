#15_cookies.py - Creating the perfect blend

#5 factors: capacity, durability, flavour, texture, calories
ing = []

def four_best():
    #sprinkles
    best = 0
    bw=0
    bx=0
    by=0
    bz=0
    for w in range(101):
        #PeanutButter
        for x in range(101):
            #Frosting
            for y in range(101):
                #Sugar
                for z in range(101):
                    if(w+x+y+z == 100):
                        cap = (w*ing[0][0] + x*ing[1][0] + y*ing[2][0] + z*ing[3][0]) 
                        dur = w*ing[0][1] + x*ing[1][1] + y*ing[2][1] + z*ing[3][1] 
                        flv = w*ing[0][2] + x*ing[1][2] + y*ing[2][2] + z*ing[3][2] 
                        tex = w*ing[0][3] + x*ing[1][3] + y*ing[2][3] + z*ing[3][3] 
                        cal = w*ing[0][4] + w*ing[1][4] + y*ing[2][4] + z*ing[3][4]
                        if(cap <=0 or dur<=0 or flv<=0 or tex<=0):
                            break
                        if(cap*dur*flv*tex > best and cal == 500):
                            best = cap*dur*flv*tex
                            bw,bx,by,bz = w,x,y,z
                            print best
    print best
    print bw,bx,by,bz

t = raw_input().strip().split(" ")
while(t!=['']):
    ing.append([int(t[2][:-1]), int(t[4][:-1]), int(t[6][:-1]), int(t[8][:-1]), int(t[10])])
    t = raw_input().strip().split(" ")
