#19_chem2.py - reindeer chemistry Advanced
import random
rules = {}
reverse = {}

datax = "CRnCaCaCaSiRnBPTiMgArSiRnSiRnMgArSiRnCaFArTiTiBSiThFYCaFArCaCaSiThCaPBSiThSiThCaCaPTiRnPBSiThRnFArArCaCaSiThCaSiThSiRnMgArCaPTiBPRnFArSiThCaSiRnFArBCaSiRnCaPRnFArPMgYCaFArCaPTiTiTiBPBSiThCaPTiBPBSiRnFArBPBSiRnCaFArBPRnSiRnFArRnSiRnBFArCaFArCaCaCaSiThSiThCaCaPBPTiTiRnFArCaPTiBSiAlArPBCaCaCaCaCaSiRnMgArCaSiThFArThCaSiThCaSiRnCaFYCaSiRnFYFArFArCaSiRnFYFArCaSiRnBPMgArSiThPRnFArCaSiRnFArTiRnSiRnFYFArCaSiRnBFArCaSiRnTiMgArSiThCaSiThCaFArPRnFArSiRnFArTiTiTiTiBCaCaSiRnCaCaFYFArSiThCaPTiBPTiBCaSiThSiRnMgArCaF"

def get_rules():
    t = raw_input().strip().split(" ")
    while(t!=['']):
        if(t[0] not in rules):
            rules[t[0]] = []
        rules[t[0]].append(t[2])
        reverse[t[2]] = t[0]
        t = raw_input().strip().split(" ")

def compute(data):
    outputs = []
    for find in rules:
        if(find in data):
            for replace in rules[find]:
                index = data.find(find)
                while(index>=0):
                    temp = data[0:index] + replace + data[index+len(find):]
                    if(temp not in outputs):
                        outputs.append(temp)
                    index = data.find(find, index+1)
    return outputs

def results():
    print len(outputs)

def revert(data):
    outputs = []
    for find in reverse:
        if(find in data):
            replace = reverse[find]
            index = data.find(find)
            while(index>=0):
                temp = data[0:index] + replace + data[index+len(find):]
                if(temp not in outputs):
                    outputs.append(temp)
                index = data.find(find, index+1)
    return outputs
            
    

def cheat(datak):
    start = datak
    steps = 0
    temp = []
    while("e" not in temp):
        temp = []
        shortest = 10000
        best = []
        print best
        
        k = revert(start)
        if(k == []):
            break
        for unit in k:
            temp.append(unit)
            if(len(unit) < shortest):
                 shortest = len(unit)
            #print temp
        for thing in temp:
            if(len(thing) == shortest):
                best.append(thing)
            
        #start = list(temp)
        start = best[random.randint(0, len(best)-1)]
        print start
        steps += 1
        print steps
    print "final:",steps

