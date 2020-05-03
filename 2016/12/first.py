from arpeggio.peg import ParserPEG # pylint: disable=import-error
from arpeggio import PTNodeVisitor, visit_parse_tree # pylint: disable=import-error

lang = ""
with open("lang.txt", 'r') as f:
    lang = f.read()

parser = ParserPEG(lang, 'program', debug=False)

def get(state, name):
    if name in state:
        return state[name]
    else:
        return 0

def cint(state, val, name):
    s = dict(state)
    s[name] = val
    return s

def cname(state, n1, n2):
    s = dict(state)
    s[n1] = get(s, n2)
    return s

def inc(state, name):
    s = dict(state)
    s[name] = get(s, name) +1
    return s

def dec(state, name):
    s = dict(state)
    s[name] = get(s, name) -1
    return s

def jnz(state, name, val):
    s = dict(state)
    return s

class LV(PTNodeVisitor):
    reg = {}

    def visit_cint(self, node, children):
        print(children)
    
    def visit_cname(self, node, children):
        print(children)
    
    def visit_inc(self, node, children):
        print(children)
    
    def visit_dec(self, node, children):
        print(children)
    
    def visit_jnz(self, node, children):
        print(children)
    
st = ""
with open("in.txt", 'r') as f:
    st = f.read()

t = LV()
visit_parse_tree(parser.parse(st), t)