#22_magefight.py - Magic spells and status effects
import random

#Player = [HP, Mana]
player = [50, 500]
armour = 0
#boss = [HP, Damage]
boss = [51, 9]

poisonTime = 0
shieldTime = 0
regenTime = 0

done = []

log = []

def damage(value):
    global boss
    boss[0] -= value

def heal(value):
    global player
    player[0] += value

#A null object, for safety
class MagicMissile:
    name = "Magic Missile"
    cost = 53
    cast = damage
    value = 4
    def Cast(self):
        global boss
        boss[0] -= 4
def mm():
    global boss
    boss[0] -= 4
#All spells are [cost, effect]
magicmissile = [53, mm]

def drn():
    global boss
    global player
    boss[0] -= 2
    player[0] += 2


class Drain:
    name = "Drain"
    cost = 73
    def Cast(self):
        damage(2)
        heal(2)

class Shield:
    name = "Shield"
    cost = 113
    def Cast(self):
        global shieldTime
        #print "shielded"
        shieldTime = 7

class Poison:
    name = "Poison"
    cost = 173
    def Cast(self):
        global poisonTime
        poisonTime = 6

class Recharge:
    name = "Recharge"
    cost = 229
    def Cast(self):
        global regenTime
        regenTime = 5


def pick_spell():
    spellbook = []
    if(poisonTime == 0):
        spellbook.append(Poison())
    if(shieldTime == 0):
        spellbook.append(Shield())
    if(regenTime == 0):
        spellbook.append(Recharge())
    spellbook.append(Drain())
    spellbook.append(MagicMissile())
    #print spellbook
    return spellbook

def check_effects():
    global poisonTime
    global shieldTime
    global regenTime
    global boss
    global player
    global armour
    
    if(poisonTime > 0):
        poisonTime -= 1
        boss[0] -= 3
    if(shieldTime > 0):
        shieldTime -= 1
        armour = 7
    else:
        armour = 0
    if(regenTime > 0):
        regenTime -= 1
        player[1] += 101

def get_new_spell(path):
    temp = list(path)
    book = pick_spell()
    for item in book:
        temp.append(item.name)
        if(temp in done or item.cost > player[1]):
            temp.pop()
        else:
            return item
    return None

def reset():
    global boss
    global player
    global poisonTime
    global shieldTime
    global regenTime
    global log
    log = []
    poisonTime = 0
    shieldTime = 0
    regenTime = 0
    player = [50, 500]
    boss = [51, 9]

#Here are the spells and effects
#spell format - (cost, damage, effect)
def battle(maxCost):
    reset()
    global log
    global player
    global boss
    cost = 0

    turn = 0
    spells = []
    if(maxCost ==0):
        maxCost = 1000000
    
    while(True):
        logval = []
        logval.append("turn " + str(turn))
        logval.append("player " + str(player))
        logval.append("boss " + str(boss))
        #print player
        ##print boss
        #Player health drain
        player[0] -= 2
        #print player[0]
        if(player[0] <= 0):
            done.append(spells)
            return 0, []
        
        check_effects()
        if(boss[0] <= 0):
            done.append(spells)
            return cost, spells

        spell = get_new_spell(spells)
        if(spell == None):
            done.append(spells)
            #print "No new spells"
            return 0, []
        spells.append(spell.name)
        
                
        cost += spell.cost
        player[1] -= spell.cost

        if(cost>=maxCost):
            done.append(spells)
            #print "expense failure"
            return 0, []
        
        spell.Cast()
        #print spell.name
        logval.append(spell.name)

        check_effects()
        if(boss[0] <= 0):
            done.append(spells)
            return cost, spells
        
        player[0] -= boss[1] - armour
        #print player[0]
        
        if(player[0] <= 0):
            done.append(spells)
            #print "Player Dead"
            return 0, []

        log.append(logval)


#get best
best_cost = 0
spells = []
winlog = []
x = 0
while(x<=10):
    temp, tspells = battle(best_cost)
    if(temp > 0):
        print x
        x += 1
        if(best_cost == 0 or temp<best_cost):
            best_cost = temp
            spells = tspells
            winlog = list(log)
        
print best_cost
        
        
