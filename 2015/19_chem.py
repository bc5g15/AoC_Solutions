#19_chem.py - reindeer chemistry
outputs = []
rules = {}

data = "CRnCaCaCaSiRnBPTiMgArSiRnSiRnMgArSiRnCaFArTiTiBSiThFYCaFArCaCaSiThCaPBSiThSiThCaCaPTiRnPBSiThRnFArArCaCaSiThCaSiThSiRnMgArCaPTiBPRnFArSiThCaSiRnFArBCaSiRnCaPRnFArPMgYCaFArCaPTiTiTiBPBSiThCaPTiBPBSiRnFArBPBSiRnCaFArBPRnSiRnFArRnSiRnBFArCaFArCaCaCaSiThSiThCaCaPBPTiTiRnFArCaPTiBSiAlArPBCaCaCaCaCaSiRnMgArCaSiThFArThCaSiThCaSiRnCaFYCaSiRnFYFArFArCaSiRnFYFArCaSiRnBPMgArSiThPRnFArCaSiRnFArTiRnSiRnFYFArCaSiRnBFArCaSiRnTiMgArSiThCaSiThCaFArPRnFArSiRnFArTiTiTiTiBCaCaSiRnCaCaFYFArSiThCaPTiBPTiBCaSiThSiRnMgArCaF"

def get_rules():
    t = raw_input().strip().split(" ")
    while(t!=['']):
        if(t[0] not in rules):
            rules[t[0]] = []
        rules[t[0]].append(t[2])
        t = raw_input().strip().split(" ")

def compute():
    for find in rules:
        if(find in data):
            for replace in rules[find]:
                index = data.find(find)
                while(index>=0):
                    temp = data[0:index] + replace + data[index+len(find):]
                    if(temp not in outputs):
                        outputs.append(temp)
                    index = data.find(find, index+1)

def results():
    print len(outputs)
