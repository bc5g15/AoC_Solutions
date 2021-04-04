#23_assembly.py - A small assembly-ish program!

reg = {}
reg["a"] = 1
reg["b"] = 0

instructions = []

def execute(inst):
    global a
    global b

    data = inst.split(" ")

    if(data[0] == "hlf"):
        reg[data[1]] = reg[data[1]] / 2
    elif(data[0] == "tpl"):
        reg[data[1]] = reg[data[1]] * 3
    elif(data[0] == "inc"):
        reg[data[1]] += 1
    elif(data[0] == "jmp"):
        return int(data[1])
    elif(data[0] == "jie"):
        if(reg[data[1][0]] % 2 == 0):
            return int(data[2])
    elif(data[0] == "jio"):
        if(reg[data[1][0]] == 1):
            return int(data[2])
    return 1

#Get input
t = raw_input().strip()
while(t!=""):
    instructions.append(t)
    t = raw_input().strip()
x = 0
while(x in range(len(instructions))):
    k = execute(instructions[x])
    x+=k

print reg
    
    
                        
