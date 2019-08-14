import parse

"""
Learning how to use the parse library,
quite happy with it!
"""

def pline(line):
    return parse.parse("[{year}-{month}-{day} {hour}:{minute}] {event}", line)

def nval(res):
    rs = ["year", "month", "day","hour","minute"]
    out = 0
    for r in rs:
        out *= 10 ** len(res[r])
        out += int(res[r])
    return out

def sleep_times(rs):
    times = {}
    myid = 0
    stime = 0
    for r in rs:
        if "#" in r["event"]:
            nr = parse.parse("Guard #{id} begins shift", r["event"])
            myid = int(nr["id"])
        elif "asleep" in r["event"]:
            stime = int(r["minute"])
        elif "wakes" in r["event"]:
            times[myid] = times.get(myid, []) + [(stime, int(r["minute"]))]
    return times

def sums(ts):
    times = []
    for t in ts:
        myid = t
        ranges = ts[t]
        value = 0
        for r in ranges:
            value += (r[1] - r[0])
        times.append((myid, value))
    return times

def best_minute(rs):
    mns = {}
    for r in rs:
        start, end = (int(x) for x in r)
        for i in range(start, end):
            mns[i] = mns.get(i, 0) + 1

    m = max(mns, key = lambda x : mns[x])
    return (m, mns[m])


def run(fname):
    lines = []
    with open(fname, 'r') as f:
        lines = f.readlines()
    lines = [l.strip() for l in lines if len(l.strip())>0]
    rs = [pline(l) for l in lines]
    rs = sorted(rs, key=lambda x: nval(x))
    
    ts = sleep_times(rs)
    g = max(sums(ts), key=lambda x: x[1])
    print(g)
    print(ts[g[0]])
    print(best_minute(ts[g[0]]))

    gs = [(t, best_minute(ts[t])) for t in ts]
    gs = sorted(gs, key=lambda x: x[1][1])
    print(gs)
    bst = max(gs, key=lambda x: x[1][1])
    print("BEST: ", bst)



    #for r in rs:
        #print("[{}-{}-{} {}:{}] {}".format(r["year"], r["month"], r["day"], r["hour"], r["minute"], r["event"]))

run("in.txt")

