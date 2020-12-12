data Dir = East | North | West | South deriving (Show)
type Pos = (Int, Int)
type Ship = (Dir, Pos)
type Instr = (Char, Int)

type Ship2 = (Pos, Pos)

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let instructions = map readInst inlines
    let startShip = (East, (0, 0))
    let endShip = fullMove startShip instructions move
    print $ (\(x, y) -> abs x + abs y) $ snd endShip
    -- Part 2
    let startShip2 = ((10, 1), (0, 0))
    let endShip2 = fullMove startShip2 instructions move2 
    print $ (\(x, y) -> abs x + abs y) $ snd endShip2

readInst :: String -> Instr
readInst (x:xs) = (x, read xs::Int)

-- Part 1
fullMove :: a -> [Instr] -> (a -> Instr -> a) -> a
fullMove s [] _ = s
fullMove s (i:is) moveF = fullMove nexts is moveF
    where
        nexts = moveF s i

move :: Ship -> Instr -> Ship
move (d, (x, y)) (c, n) = case c of 
    'N' -> (d, (x, y+n))
    'S' -> (d, (x, y-n))
    'E' -> (d, (x+n, y))
    'W' -> (d, (x-n, y))
    'L' -> (iterate turnL d !! div n 90, (x, y))
    'R' -> (iterate turnR d !! div n 90, (x, y))
    'F' -> (d, forwardFun d n (x, y))

forwardFun :: Dir -> Int -> ((Int, Int) -> (Int, Int))
forwardFun d n (x,y) = case d of
    East -> (x+n, y)
    North -> (x, y+n)
    West -> (x-n, y)
    South -> (x, y-n)

turnR :: Dir -> Dir
turnR East = South
turnR South = West
turnR West = North
turnR North = East

turnL :: Dir -> Dir
turnL East = North
turnL North = West
turnL West = South
turnL South = East

-- Part 2
turnWR :: Pos -> Pos
turnWR (x, y) = (y, -x)

turnWL :: Pos -> Pos
turnWL (x, y) = (-y, x)

move2 :: Ship2 -> Instr -> Ship2
move2 (wp@(i, j), p@(x,y)) (c, n) = case c of
    'N' -> ((i, j+n), p)
    'S' -> ((i, j-n), p)
    'E' -> ((i+n, j), p)
    'W' -> ((i-n, j), p)
    'L' -> (iterate turnWL wp !! div n 90, p)
    'R' -> (iterate turnWR wp !! div n 90, p)
    'F' -> (wp, (x+(i*n), y+(j*n)))
