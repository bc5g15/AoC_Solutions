from collections import deque, defaultdict

# Sample solution, learning about high performance container datatypes
# With thanks to marcusandrews on AoC reddit

def play_game(max_players, last_marble):
    scores = defaultdict(int) # A dictionary with default values
    circle = deque([0]) # A ring-like data structure

    for marble in range(1, last_marble+1):
        if marble % 23 == 0:
            circle.rotate(7)
            scores[marble % max_players] += marble + circle.pop()
            circle.rotate(-1)
        else:
            circle.rotate(-1)
            circle.append(marble)

    return max(scores.values()) if scores else 0

print(play_game(493, 71863))
print(play_game(493, 7186300))
