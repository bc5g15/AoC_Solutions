import Data.Time.Clock (getCurrentTime, diffUTCTime)

type Layout = [[Char]]
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