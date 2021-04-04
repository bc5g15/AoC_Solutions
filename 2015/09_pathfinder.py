#09_pathfinder.py - The shortest path visiting all points

locations = []
connections = {}

visited = []

def find_long():
    final_short = 0
    left = []
    final_visited = []
    for value in locations:
        #Start the algorithm
        #The for loop dictates our starting point
        short = 0
        visited = []
        current = value
        left = list(locations)
        left.remove(current)
        visited.append(current)
        while(left!=[]):
            temp_short = 0
            temp_destination = ""
            for item in connections[current]:
                if(item[0] not in visited):
                    if(item[1] > temp_short or temp_short == 0):
                        temp_short = item[1]
                        temp_destination = item[0]
            current = temp_destination
            short += temp_short
            visited.append(current)
            left.remove(current)
        #Now we have one possible path
        if(short > final_short or final_short == 0):
            final_short = short
            final_visited = visited
    return final_short, visited

def find_short():
    final_short = 0
    left = []
    final_visited = []
    for value in locations:
        #Start the algorithm
        #The for loop dictates our starting point
        short = 0
        visited = []
        current = value
        left = list(locations)
        left.remove(current)
        visited.append(current)
        while(left!=[]):
            temp_short = 0
            temp_destination = ""
            for item in connections[current]:
                if(item[0] not in visited):
                    if(item[1] < temp_short or temp_short == 0):
                        temp_short = item[1]
                        temp_destination = item[0]
            current = temp_destination
            short += temp_short
            visited.append(current)
            left.remove(current)
        #Now we have one possible path
        if(short < final_short or final_short == 0):
            final_short = short
            final_visited = visited
    return final_short, visited
        
        
            
        


#Populate the structures
t = raw_input().strip().split(" ")
while(t!=['']):
    if(t[0] not in locations):
        locations.append(t[0])
        connections[t[0]] = []
    if(t[2] not in locations):
        locations.append(t[2])
        connections[t[2]] = []

    connections[t[0]].append((t[2], int(t[4])))
    connections[t[2]].append((t[0], int(t[4])))
    t = raw_input().strip().split(" ")
locations = tuple(locations)
    
    
