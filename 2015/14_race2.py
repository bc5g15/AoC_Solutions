#14_race.py - Reindeer races!

#I feel this situation calls for an OOP solution

class Deer:
    def __init__(self, name, speed, time, rest):
        self.name = name
        self.speed = speed
        self.time = time
        self.rest = rest

        self.distance = 0
        self.run_time = 0
        self.rest_time = 0

        self.points = 0

    def race(self):
        if(self.run_time < self.time):
            self.run_time += 1
            self.distance += self.speed
        else:
            self.rest_time+= 1
            if(self.rest_time > self.rest):
                self.rest_time =0
                self.run_time = 0
                self.race()


deers = []


def race(time):
    winner = ""
    winpos = 0
    for x in range(time):
        best = 0
        for deer in deers:
            deer.race()
            if(deer.distance > best):
                temp_deer = deer
                best = deer.distance
        for deer in deers:
            if(deer.distance == best):
                deer.points += 1
            
    for deer in deers:
        print deer.name
        print deer.points
        if(deer.points > winpos):
            winner = deer.name
            winpos = deer.points
    print "Winner: ", winner, winpos

t = raw_input().strip().split(" ")
while(t!=['']):
    name = t[0]
    speed = int(t[3])
    time = int(t[6])
    rest = int(t[13])
    x = Deer(name, speed, time, rest)
    deers.append(x)
    t = raw_input().strip().split(" ")

