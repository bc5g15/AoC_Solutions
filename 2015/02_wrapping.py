#Day 2 - Wrapping up that damn maths.
#part 1, input scrubbing.

def getin():
    totalsurface = 0
    totalribbon = 0
    happyin = raw_input().strip()
    while(happyin != ""):
        a,b,c = happyin.split('x')
        # a,b,c - length,width,depth
        a,b,c = int(a),int(b),int(c)
        surface_area = 2*a*b + 2*b*c + 2*a*c
        #find extra area - smallest side
        small = a*b
        ribsmall = [a, b]
        if(small > b*c):
            small = b*c
            ribsmall = [b,c]
        if(small > a*c):
            small = a*c
            ribsmall = [a,c]
        totalsurface += surface_area + small

        #Ribbon logic
        ribvol = a*b*c
        ribround = (ribsmall[0] * 2) + (ribsmall[1]*2)
        totalribbon += ribvol + ribround
        
        happyin = raw_input().strip()
    print totalsurface
    print totalribbon

