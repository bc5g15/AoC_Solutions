def fuel_cost(value):
    return (value//3) - 2

def fuel_cost_repeat(value):
    test = value
    output = 0
    while test > 0:
        test = fuel_cost(test)
        output += test
    return output

def run(fname, part2=False):
    output = 0
    with open(fname, 'r') as f:
        if part2:
            output = sum((fuel_cost_repeat(int(x)) for x in f))
        else:
            output = sum((fuel_cost(int(x)) for x in f)) 

    print(output)

run("input.txt", part2=True)
