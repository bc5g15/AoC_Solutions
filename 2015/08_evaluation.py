#08_evaluation.py - some string evaluation
t="A"
totalCode = 0
totalString = 0
t = raw_input().strip()
while(t!=""):
    totalCode += len(t)
    totalString += len(eval(t))
    t = raw_input().strip()

print totalCode - totalString
