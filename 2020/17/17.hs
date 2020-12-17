import qualified Data.Set as Set

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    -- Part 1
    let state = Set.fromList $ readInitialState inlines 0 0 0
    print . Set.size $ iterate turn state !! 6
    -- Part 2
    let state2 = Set.fromList $ aReadInitialState inlines [0,0,0,0]
    print . Set.size $ iterate aTurn state2 !! 6

type Cube = (Int, Int, Int)
type Cubes = Set.Set Cube

readInitialState :: [String] -> Int -> Int -> Int -> [Cube]
readInitialState [] _ _ _ = []
readInitialState ([]:as) x y z = readInitialState as 0 (y+1) z
readInitialState ((a:as):bs) x y z
    | a=='#' = (x, y, z) : readInitialState (as:bs) (x+1) y z
    | otherwise = readInitialState (as:bs) (x+1) y z

neighbours :: Cube -> [Cube]
neighbours (x, y, z) = [(i, j, k) | i<-[x-1..x+1], j<-[y-1..y+1], k<-[z-1..z+1], not (i==x && j==y && k==z)]

countNeighbours :: Cube -> Cubes -> Int
countNeighbours c cs = length . filter (==True) . map (`Set.member` cs) $ neighbours c

checkRange :: Cubes -> (Cube, Cube)
checkRange cs = ((minX, minY, minZ), (maxX, maxY, maxZ))
    where 
        muchMin = (minBound::Int, minBound::Int, minBound::Int)
        muchMax = (maxBound::Int, maxBound::Int, maxBound::Int)
        (minX, minY, minZ) = Set.foldl' (\(x,y,z) (i,j,k) -> (min x i, min y j, min z k)) muchMax cs
        (maxX, maxY, maxZ) = Set.foldl' (\(x,y,z) (i,j,k) -> (max x i, max y j, max z k)) muchMin cs

turn :: Cubes -> Cubes
turn cs = result
    where
        ((minX, minY, minZ), (maxX, maxY, maxZ)) = checkRange cs
        check :: Cubes -> Cube -> Bool
        check cs c
            | Set.member c cs = countNeighbours c cs `elem` [2,3]
            | otherwise = countNeighbours c cs == 3
        fullCoords = [(x, y, z) | x<-[minX-1..maxX+1], y<-[minY-1..maxY+1], z<-[minZ-1..maxZ+1]]
        result = Set.fromList $ filter (check cs) fullCoords

-- Dimension agnostic version
type Coord = [Int]
type Active = Set.Set Coord

aReadInitialState :: [String] -> [Int] -> [Coord]
aReadInitialState [] _ = []
aReadInitialState ([]:as) (x:y:os) = aReadInitialState as (0:(y+1):os)
aReadInitialState ((a:as):bs) (x:y:os)
    | a=='#' = (x:y:os) : next
    | otherwise = next
    where
        next = aReadInitialState (as:bs) ((x+1):y:os)

agNeighbours :: Coord -> [Coord]
agNeighbours x = filter (/=x) $ neighboursA x

neighboursA :: [Int] ->[[Int]]
neighboursA [a] = [[a-1], [a], [a+1]]
neighboursA (a:as) = map (a-1:) (neighboursA as) ++ 
    map (a:) (neighboursA as) ++ map (a+1:) (neighboursA as)

aCountNeighbours :: Coord -> Active -> Int
aCountNeighbours c cs = length . filter (==True) . map (`Set.member` cs) $ agNeighbours c

aCheckRange :: Active -> (Coord, Coord)
aCheckRange cs = (mins, maxes)
    where 
        myMin = minBound::Int
        myMax = maxBound::Int
        mins = Set.foldl' (\x y -> eat x y min) (repeat myMax) cs
        maxes = Set.foldl' (\x y -> eat x y max) (repeat myMin) cs
        eat :: Coord -> Coord -> (Int -> Int -> Int) -> Coord
        eat [] _ _ = []
        eat _ [] _ = []
        eat (a:as) (b:bs) f = f a b : eat as bs f

aTurn :: Active -> Active
aTurn cs = result
    where
        (mins, maxes) = aCheckRange cs
        fullCoords :: Coord -> Coord -> [Coord]
        fullCoords [] [] = [[]]
        fullCoords (a:smalls) (b:bigs) = [(x:)|x<-[a-1..b+1]] <*> fullCoords smalls bigs
        check :: Active -> Coord -> Bool
        check cs c
            | Set.member c cs = aCountNeighbours c cs `elem` [2,3]
            | otherwise = aCountNeighbours c cs == 3
        result = Set.fromList $ filter (check cs) (fullCoords mins maxes)