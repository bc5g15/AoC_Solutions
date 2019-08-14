
def build_node(nums):
    ns = []
    ms = []
    cnum = nums.pop(0)
    mnum = nums.pop(0)
    for i in range(cnum):
        ns.append(build_node(nums))
    for j in range(mnum):
        ms.append(nums.pop(0))
    return (ns, ms)


def readme(fname):
    c = ""
    with open(fname, 'r') as f:
        c = f.read()
    c = c.strip().split(" ")
    c = [int(x) for x in c]
    return c

def tree_sum(root):
    s = sum(root[1])
    for i in root[0]:
        s += tree_sum(i)
    return s


def n_value(node):
    if len(node[0]) == 0:
        return sum(node[1])
    else:
        s = 0
        for i in node[1]:
            if i <= len(node[0]):
                s += n_value(node[0][i-1])
        return s


def run(fname, part2=False):
    ns = readme(fname)
    root = build_node(ns)
    if not part2:
        print(tree_sum(root))
    else:
        print(n_value(root))

run("in.txt", part2=True)

# Part 1 - Correct! - Worked with my recursive hat on
# Part 2 - Correct!
