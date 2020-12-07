-- AoC 2019 Day 3
-- Crossed Wires

-- Answer 1: correct!
import Data.List.Split
import qualified Data.Set as Set
import qualified Data.Map as Map

-- Wire data helpers
data Direction = Up | Down | Left | Right deriving (Show, Eq)
type Instruction = (Direction, Int)
type Wire = [Instruction]
type Grid = Set.Set (Int, Int)
type Coord = (Int, Int)
type Origin = (Int, Int)
type Overlaps = Set.Set (Int, Int)


main = do 
    contents <- readFile "test.txt"
    let myStuff = myParse contents
    -- putStrLn $ show $ myStuff !! 0
    -- let dataman = splitOn "\n" contents
    -- print (splitOn "," (dataman !! 0))
    -- let myStuff = readInstructions contents
    -- putStrLn $ show $ makeGrid (myStuff !! 0)

    let wire1 = myStuff !! 0
    let wire2 = myStuff !! 1

    let grid = makeGrid wire1
    -- -- putStrLn $ show $ checkOverlap grid (myStuff !! 1)
    let overlaps = checkOverlap grid (myStuff !! 1)
    -- putStrLn $ show $ minManhattanDistance overlaps
    -- print $ partTwoAnswer wire1 wire2 overlaps
    let map1 = createWireMap wire1 overlaps
    let map2 = createWireMap wire2 overlaps
    print overlaps
    print map1

-- Input Reading logic
myParse :: String -> [Wire]
myParse x = [readInstructions (xs !! 0), readInstructions (xs !! 1)]
    where xs = splitOn "\n" x

readInstructions :: String -> Wire
readInstructions x = map readInstruction (splitOn "," x)

readInstruction :: String -> Instruction
readInstruction (x:xs) = (readDirection x, read xs :: Int)

readDirection :: Char -> Direction
readDirection c
    | c == 'U' = Up
    | c == 'D' = Down
    | c == 'R' = Main.Right
    | c == 'L' = Main.Left
    | otherwise = (error "Only feed me the valid characters!")

-- Grid Population logic
makeGrid :: Wire -> Grid
makeGrid is = fillByInstructions is (0, 0) Set.empty

fillByInstructions :: Wire -> Origin -> Grid -> Grid
fillByInstructions [] _ g = g
fillByInstructions (i:is) o g = fillByInstructions is no ng 
    where (ng, no) = fillByInstruction i o g

fillByInstruction :: Instruction -> Origin -> Grid -> (Grid, Origin)
fillByInstruction i o g = (Set.union g (Set.fromList (instructionRange i o)), newOrigin i o)

newOrigin :: Instruction -> Origin -> Origin
newOrigin (c, v) (x, y)
    | c == Up = (x, y+v)
    | c == Down = (x, y-v)
    | c == Main.Left = (x-v, y)
    | c == Main.Right = (x+v, y)

instructionRange :: Instruction -> Origin -> [Coord]
instructionRange (c, v) (x, y)
    | c == Main.Right = map (\a -> (a, y)) [x..x+v]
    | c == Main.Left = map (\a -> (a, y)) [x,x-1..x-v]
    | c == Down = map (\a -> (x, a)) [y,y-1..y-v]
    | c == Up = map (\a -> (x, a)) [y..y+v]

fillSpace :: Coord -> Grid -> Grid
fillSpace c g = Set.insert c g

quickRange :: Int -> Int -> [Int]
quickRange a b = [(minimum [a, b])..(maximum [a, b])]

-- Overlap Checking logic
checkOverlap :: Grid -> Wire -> Overlaps
checkOverlap g w = checkInstructionsOverlap g w (0, 0) Set.empty

checkInstructionsOverlap :: Grid -> Wire -> Origin -> Overlaps -> Overlaps
checkInstructionsOverlap _ [] _ ov = ov
checkInstructionsOverlap g (i:is) o ov = checkInstructionsOverlap g is no nv
    where 
        no = newOrigin i o
        nv = checkInstructionOverlap g i o ov

checkInstructionOverlap :: Grid -> Instruction -> Origin -> Overlaps -> Overlaps
checkInstructionOverlap g i o ov = Set.union ov (simpleOverlaps g (instructionRange i o))

simpleOverlaps :: Grid -> [Coord] -> Overlaps
simpleOverlaps g c = Set.delete (0, 0) (Set.intersection g (Set.fromList c))

-- Final Answer Checking
minManhattanDistance :: Overlaps -> Int
minManhattanDistance o = manhattanWorkings (Set.toList (Set.delete (0, 0) o))

manhattanWorkings :: [Coord] -> Int
manhattanWorkings c = minimum (map (\(a, b) -> (abs a) + (abs b)) c) 

-- Part 2: Don't want to replace how I build them. 
-- So play a game of follow-the-wire
type WireDistance = Map.Map (Int, Int) Int
type WireStep = Int
type Segment = ((Int, Int), Int)

partTwoAnswer :: Wire -> Wire -> Overlaps -> Int
partTwoAnswer w1 w2 o = Set.findMin $ Set.map (\a -> partTwoCalculation a wm1 wm2) o
    where 
        wm1 = createWireMap w1 o
        wm2 = createWireMap w2 o

partTwoCalculation :: Coord -> WireDistance -> WireDistance -> Int
partTwoCalculation c w1 w2 = (w1 Map.! c) + (w2 Map.! c)

sharedKeys :: WireDistance -> WireDistance -> [Coord]
sharedKeys w1 w2 = Map.keys (Map.intersection w1 w2)

createWireMap :: Wire -> Overlaps -> WireDistance
createWireMap w o = followDirections w o Map.empty (0, 0) 0
    where
        followDirections :: Wire -> Overlaps -> WireDistance -> Origin -> WireStep -> WireDistance
        followDirections [] _ wd _ _ = wd
        followDirections (i:is) os wd o c = followDirections is os nd no (c+1)
            where 
                nd = handleInst i os wd o c
                no = newOrigin i o

        handleInst :: Instruction -> Overlaps -> WireDistance -> Origin -> WireStep -> WireDistance
        handleInst i os wds o c = handleSegments segs os wds
            where segs = localInst i o c
        
        handleSegments :: [Segment] -> Overlaps -> WireDistance -> WireDistance
        handleSegments [] _ wd = wd
        handleSegments (((a, b), s):ss) o wd
            | Set.member (a, b) o = handleSegments ss o (addIfNotThere ((a,b), s) wd)
            | otherwise = handleSegments ss o wd
        
        addIfNotThere :: Segment -> WireDistance -> WireDistance
        addIfNotThere (q, s) wd
            | Map.member q wd = wd
            | otherwise = Map.insert q s wd

        localInst :: Instruction -> Origin -> WireStep -> [Segment]
        localInst (c, v) (x, y) ws
            | c == Up           = map (\a -> ((x, y + (v-a)), ws+a)) [1..v]
            | c == Down         = map (\a -> ((x, y - (v-a)), ws+a)) [1..v]
            | c == Main.Left    = map (\a -> ((x - (v-a), y), ws+a)) [1..v]
            | c == Main.Right   = map (\a -> ((x + (v-a), y), ws+a)) [1..v] 