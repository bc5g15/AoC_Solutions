#21_bossfight.py - RPG bossfight calculator!

#All items have the format (cost, damage, armour)
weapons = {}
weapons["Dagger"] = (8,4,0)
weapons["Shortsword"] = (10, 5, 0)
weapons["Warhammer"] = (25, 6, 0)
weapons["Longsword"] = (40, 7, 0)
weapons["Greataxe"] = (74, 8, 0)

armour = {}
armour["None"] = (0, 0, 0)
armour["Leather"] = (13, 0, 1)
armour["Chainmail"] = (31, 0, 2)
armour["Splintmail"] = (53, 0, 3)
armour["Bandedmail"] = (75, 0, 4)
armour["Platemail"] = (102, 0, 5)

rings = {}
rings["None"] = (0, 0, 0)
rings["dmg1"] = (25, 1, 0)
rings["dmg2"] = (50, 2, 0)
rings["dmg3"] = (100, 3, 0)
rings["def1"] = (20, 0, 1)
rings["def2"] = (40, 0, 2)
rings["def3"] = (80, 0, 3)

# [HP, Damage, Armour]
boss = [100, 8, 2]
you = [100, 0, 0]
cost = 0
def reset(boss, you, cost):
    boss = [100, 8, 2]
    you = [100, 0, 0]
    cost = 0

#Combat algorithms

def damage(attacker, defender):
    if(attacker[1] > defender[2]):
        defender[0] -= (attacker[1] - defender[2])
    else:
        defender[0] -= 1

def fight():
    while(boss[0] > 0 and you[0] > 0):
        damage(you, boss)
        if(boss[0] <= 0):
            #you win!
            return True
        damage(boss, you)
        if(you[0] <=0):
            #You lose...
            return False
            
#Cheapness algorithm
#Decide on equipment
loadout = ""
best = 0
for weap in weapons:
    for arm in armour:
        for item1 in rings:
            for item2 in rings:
                if(item2!=item1 or item1==item2=="None"):
                    #reset(boss, you, cost)
                    boss =  [100, 8, 2]
                    you = [100, 0, 0]
                    cost = 0
                    
                    cost += weapons[weap][0] + armour[arm][0]\
                            + rings[item1][0] + rings[item2][0]
                    #attack
                    you[1] += weapons[weap][1] + armour[arm][1]\
                              + rings[item1][1] + rings[item2][1]
                    #defense
                    you[2] += weapons[weap][2] + armour[arm][2]\
                              + rings[item1][2] + rings[item2][2]
                    win = fight()
                    #print you[0]
                    #print win
                    if(not win and (best == 0 or cost > best)):
                        best = cost
                        loadout = weap, arm, item1, item2
print best
print loadout
