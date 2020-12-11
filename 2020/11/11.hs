import Data.Time.Clock (getCurrentTime, diffUTCTime)
import qualified Data.Map.Strict as Map

type Layout = [[Char]]
type LayoutMap = Map.Map Pos Char
type Pos = (Int, Int)

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    -- Part 1
    start <- getCurrentTime
    let stable = processUntilStable inlines
    print . sum $ map (length . filter (=='#')) stable
    firstEnd <- getCurrentTime
    print $ diffUTCTime firstEnd start -- ~40s!

    -- Part 1 Map method
    let mymap = makeMap inlines
    start2 <- getCurrentTime
    let stableMap = processMapUntilStable mymap
    let count = Map.size $ Map.filter (=='#') stableMap
    print count
    end2 <- getCurrentTime
    print $ diffUTCTime end2 start2

makeMap :: Layout -> LayoutMap
makeMap l = Map.fromList pairs
    where 
        coords = [(x, y) | x<-[0..length (head l) -1], y<-[0..length l - 1]]
        pairs = [(k, getCell k l) | k <- coords]

getMapCell :: Pos -> LayoutMap -> Char
getMapCell = Map.findWithDefault '.'

filledAdjacent :: (Int, Int) -> Layout -> Int
filledAdjacent (x, y) l = length . filter (=='#') $ 
    [getCell (i, j) l | j<-[y-1..y+1], i<-[x-1..x+1], not (i==x && j==y)]

filledMapAdjacent :: Pos -> LayoutMap -> Int
filledMapAdjacent (x, y) l = length . filter (=='#') $ 
    [getMapCell (i, j) l | j<-[y-1..y+1], i<-[x-1..x+1], not (i==x && j==y)]

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

processMapCell :: Pos -> Char -> LayoutMap -> Char
processMapCell p _ l 
    | cell == 'L' && filledMapAdjacent p l == 0 = '#'
    | cell == '#' && filledMapAdjacent p l >= 4 = 'L'
    | otherwise = cell
    where 
        cell = getMapCell p l

processUntilStable :: Layout -> Layout
processUntilStable l
    | l == next = l
    | otherwise = processUntilStable next
    where
        coords = [[(x, y) | x<-[0..length (head l) - 1]] | y<-[0..length l - 1]]
        next = map (map (`processCell` l)) coords

processMapUntilStable :: LayoutMap -> LayoutMap
processMapUntilStable l
    | l == next = l
    | otherwise = processMapUntilStable next
    where
        next = Map.mapWithKey (\x y -> processMapCell x y l) l