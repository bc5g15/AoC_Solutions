import Data.Time.Clock (getCurrentTime, diffUTCTime)
import qualified Data.Map.Strict as Map

type Layout = [[Char]]
type LayoutMap = Map.Map Pos Char
type Pos = (Int, Int)

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let mymap = makeMap inlines
    -- Part 1
    -- start <- getCurrentTime
    -- let stable = processUntilStable inlines
    -- print . sum $ map (length . filter (=='#')) stable
    -- firstEnd <- getCurrentTime
    -- print $ diffUTCTime firstEnd start -- ~40s!

    -- Part 1 Map method
    start2 <- getCurrentTime
    let stableMap = processMapUntilStable mymap processMapCell
    let count = Map.size . Map.filter (=='#')
    print $ count stableMap
    end2 <- getCurrentTime
    print $ diffUTCTime end2 start2 -- ~17s

    -- Part 2 Map method
    start3 <- getCurrentTime
    let stable2 = processMapUntilStable mymap part2Process
    print $ count stable2
    end3 <- getCurrentTime
    print $ diffUTCTime end3 start3 -- ~15s

-- Layout Methods
filledAdjacent :: (Int, Int) -> Layout -> Int
filledAdjacent (x, y) l = length . filter (=='#') $ 
    [getCell (i, j) l | j<-[y-1..y+1], i<-[x-1..x+1], not (i==x && j==y)]

getCell :: (Int, Int) -> Layout -> Char
getCell (x, y) l 
    | withinYBounds && withinXBounds = l !! y !! x
    | otherwise = '.'
    where 
        withinXBounds = x >= 0 && x < length (l !! y)
        withinYBounds = y >= 0 && y < length l

processCell :: Pos -> Layout -> Char
processCell p l 
    | cell == 'L' && filledAdjacent p l == 0 = '#'
    | cell == '#' && filledAdjacent p l >= 4 = 'L'
    | otherwise = cell
    where 
        cell = getCell p l

processUntilStable :: Layout -> Layout
processUntilStable l
    | l == next = l
    | otherwise = processUntilStable next
    where
        coords = [[(x, y) | x<-[0..length (head l) - 1]] | y<-[0..length l - 1]]
        next = map (map (`processCell` l)) coords

-- Map methods
makeMap :: Layout -> LayoutMap
makeMap l = Map.fromList pairs
    where 
        coords = [(x, y) | x<-[0..length (head l) -1], y<-[0..length l - 1]]
        pairs = [(k, getCell k l) | k <- coords]

getMapCell :: Pos -> LayoutMap -> Char
getMapCell = Map.findWithDefault '.'

filledMapAdjacent :: Pos -> LayoutMap -> Int
filledMapAdjacent (x, y) l = length . filter (=='#') $ 
    [getMapCell (i, j) l | j<-[y-1..y+1], i<-[x-1..x+1], not (i==x && j==y)]

part2Process :: Pos -> Char -> LayoutMap -> Char
part2Process p _ l
    | cell == 'L' && filledVisible p l == 0 = '#'
    | cell == '#' && filledVisible p l >= 5 = 'L'
    | otherwise = cell
    where 
        cell = getMapCell p l

processMapCell :: Pos -> Char -> LayoutMap -> Char
processMapCell p _ l 
    | cell == 'L' && filledMapAdjacent p l == 0 = '#'
    | cell == '#' && filledMapAdjacent p l >= 4 = 'L'
    | otherwise = cell
    where 
        cell = getMapCell p l

processMapUntilStable :: LayoutMap -> (Pos -> Char -> LayoutMap -> Char) -> LayoutMap
processMapUntilStable l f
    | l == next = l
    | otherwise = processMapUntilStable next f
    where
        next = Map.mapWithKey (\x y -> f x y l) l

inMap :: Pos -> LayoutMap -> Bool
inMap = Map.member

filledVisible :: Pos -> LayoutMap -> Int
filledVisible (x, y) l = total
    where
        count = [1..]
        left    = [(x-n, y) | n<-count]
        top     = [(x, y-n)| n<-count]
        right   = [(x+n, y) | n<-count]
        down    = [(x, y+n) | n<-count]
        tl = [(x-n, y-n) | n<-count]
        tr = [(x+n, y-n) | n<-count]
        dl = [(x-n, y+n) | n<-count]
        dr = [(x+n, y+n) | n<-count]
        allDirs = map (map (`getMapCell` l) . takeWhile (`inMap` l)) [left, top, right, down ,tl, tr, dl, dr]
        eater :: [Char] -> Int
        eater [] = 0
        eater ('#':_) = 1
        eater ('L':_) = 0
        eater (_:xs) = eater xs
        check = map eater allDirs
        total = sum check
