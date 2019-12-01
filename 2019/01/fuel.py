def fuel_cost(value):
    return (value//3) - 2

def run(fname, part2=False):
    output = 0
    with open(fname, 'r') as f:
        for line in f:
            if part2:
                temp_total = fuel_cost(int(line))
                while temp_total > 0:
                    output += temp_total
                    temp_total = fuel_cost(temp_total)
            else:
                output += fuel_cost(int(line))

    print(output)

run("input.txt", part2=True)
