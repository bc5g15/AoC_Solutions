# config - (tapePos, tapeDict, curState)
# statedict - {(State, TapeValue): (NewState, WriteValue, TapeShift)}

def read_puzzle(lines):
    startstate = lines[0][3][0]
    endtime = int(lines[1][5])
    
    sd = {}
    x = 2
    while x<len(lines):
        name = lines[x][2][0]
        y = 0
        while y < 2:
            st = x + (4 * y) + 1
            val = int(lines[st][5][0])
            wr = int(lines[st+1][4][0])
            mstr = lines[st+2][6]
            mv = 0
            if mstr == "right.":
                mv = 1
            else:
                mv = -1
            nxst = lines[st+3][4][0]
            y += 1
            sd[(name, val)] = (nxst, wr, mv)
        x += 9

    return (startstate, endtime, sd)


def run(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip().split() for l in lines if len(l.strip())>0]
    
    start, time, statedict = read_puzzle(lines)
    tape = {}
    pos = 0
    t = 0
    state = start
    while t < time:
        curval = tape.get(pos, 0)
        nxt, wr, mv  = statedict[(state, curval)]
        state = nxt
        tape[pos] = wr
        pos += mv
        t += 1

    # print checksum
    print("Checksum: ", sum([tape[p] for p in tape]))

run("in.txt")
