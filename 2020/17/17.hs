import qualified Data.Set as Set

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let state = Set.fromList $ readInitialState inlines 0 0 0

    -- print $ neighbours (0, 0, 0)
    -- print $ Set.size state
    -- print state
    -- print $ countNeighbours (0, 1, -1) state
    print . Set.size $ iterate turn state !! 6
    -- print . Set.filter (\(_,_,z) -> z==0) $ turn state
    -- print $ countNeighbours (1, 0, 0) state
    -- print . filter (`Set.member` state) $ neighbours (1,0,0)

    -- print $ neighboursA [0, 0]

type Cube = (Int, Int, Int)
type Hypercube = (Int, Int, Int, Int)
type Cubes = Set.Set Cube
type Hypercubes = Set.Set Hypercube

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
-- type Coord = [Int]
-- type Active = Set.Set Coord

-- agNeighbours :: Coord -> [Coord]
-- agNeighbours x = filter (/=x) $ neighboursA x

-- neighboursA :: [Int] ->[[Int]]
-- neighboursA [a] = [[a-1], [a], [a+1]]
-- neighboursA (a:as) = map (a-1:) (neighboursA as) ++ 
--     map (a:) (neighboursA as) ++ map (a+1:) (neighboursA as)

-- countNei