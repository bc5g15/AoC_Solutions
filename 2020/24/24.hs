import qualified Data.Set as Set
import Debug.Trace (trace)

main :: IO ()
main = do
    instring <- readFile "test.txt"
    let inlines = lines instring
    let poss = map (resolvePos . eatDirList) inlines
    print poss
    let tiles = flipMany poss Set.empty
    print . Set.size $ tiles

    -- Part 2
    print . Set.size $ fullCheck tiles
    print "Hello"

-- 241 -- Too low
-- 307 -- Correct!

type HexCoord = (Int, Int, Int)

type CoordSet = Set.Set HexCoord

eatDirList :: String -> [HexCoord]
eatDirList [] = []
eatDirList (a:b:xs) = case a of
    'n' -> case b of
        'w' -> (-1, 0, 1) : eatDirList xs
        'e' -> (0, 1, 1) : eatDirList xs
    's' -> case b of 
        'w' -> (0, -1, -1) : eatDirList xs
        'e' -> (1, 0, -1) : eatDirList xs
    'w' -> (-1, -1, 0) : eatDirList (b:xs)
    'e' -> (1,1,0) : eatDirList (b:xs)
eatDirList [a] = case a of
    'e' -> [(1, 1, 0)]
    'w' -> [(-1, -1, 0)]

resolvePos :: [HexCoord] -> HexCoord
resolvePos = foldl (\(x, y, z) (a, b, c) -> (x+a, y+b, z+c)) (0, 0, 0) 

flipTile :: HexCoord -> CoordSet -> CoordSet
flipTile c s 
    | Set.member c s = Set.delete c s
    | otherwise = Set.insert c s

flipMany :: [HexCoord] -> CoordSet -> CoordSet
flipMany as s = foldl (flip flipTile) s as

-- Part 2

neighbours :: HexCoord -> CoordSet -> Int
neighbours (a,b,c) s = length $ filter (`Set.member` s) nc
    where
        nd = [(-1, 0, 1), (0,1,1), (0,-1,-1), (1,0,-1), (-1,-1,0), (1,1,0)]
        nc = map (\(x,y,z) -> (x+a, y+b, z+c)) nd

fullCheck :: CoordSet -> CoordSet
fullCheck c = Set.fromList $ filter (`check` c) fullCoords
    where
        maxes = (maxBound::Int, maxBound::Int, maxBound::Int)
        mins = (minBound::Int, minBound::Int, minBound::Int)
        (minA, minB, minC) = Set.foldl' (\(a,b,c) (x,y,z) -> (min a x, min b y, min c z)) maxes c
        (maxA, maxB, maxC) = Set.foldl' (\(a,b,c) (x,y,z) -> (max a x, max b y, max c z)) mins c
        fullCoords = [(a,b,c) | a<-[minA-1..maxA+1], b<-[minB-1..maxB+1], c<-[minC-1..maxC+1]]
        check :: HexCoord -> CoordSet -> Bool
        check h cs
            | Set.member h cs && (ns == 0 || ns > 2) = False
            | Set.member h cs = trace (show ns) True 
            | not $ Set.member h cs && ns == 2 = True
            | otherwise = False 
            where
                ns = neighbours h cs