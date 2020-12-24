import qualified Data.Set as Set
import Debug.Trace (trace)

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let poss = map (resolvePos . eatDirList) inlines

    -- Part 1
    let tiles = flipMany poss Set.empty
    print . Set.size $ tiles

    -- Part 2
    print . Set.size $ iterate fullCheck tiles !! 100


type HexCoord = (Int, Int)

type CoordSet = Set.Set HexCoord

eatDirList :: String -> [HexCoord]
eatDirList [] = []
eatDirList (a:b:xs) = case a of
    'n' -> case b of
        'w' -> (-1, 1) : eatDirList xs
        'e' -> (0, 1) : eatDirList xs
    's' -> case b of 
        'w' -> (0, -1) : eatDirList xs
        'e' -> (1, -1) : eatDirList xs
    'w' -> (-1, 0) : eatDirList (b:xs)
    'e' -> (1,0) : eatDirList (b:xs)
eatDirList [a] = case a of
    'e' -> [(1, 0)]
    'w' -> [(-1, 0)]

resolvePos :: [HexCoord] -> HexCoord
resolvePos = foldl (\(x, y) (a, b) -> (x+a, y+b)) (0, 0) 

flipTile :: HexCoord -> CoordSet -> CoordSet
flipTile c s 
    | Set.member c s = Set.delete c s
    | otherwise = Set.insert c s

flipMany :: [HexCoord] -> CoordSet -> CoordSet
flipMany as s = foldl (flip flipTile) s as

-- Part 2
listNeighbours :: HexCoord -> [HexCoord]
listNeighbours (a, b) = let nd = [(0,0), (-1, 1), (0,1), (1,0), (1,-1), (0,-1), (-1,0)] in
    map (\(x,y) -> (x+a, y+b)) nd

neighbours :: HexCoord -> CoordSet -> Int
neighbours (a,b) s = length $ filter (`Set.member` s) nc
    where
        nd = [(-1, 1), (0,1), (1,0), (1,-1), (0,-1), (-1,0)]
        nc = map (\(x,y) -> (x+a, y+b)) nd

allToCheck :: CoordSet -> [HexCoord] 
allToCheck cs = Set.elems . Set.unions $ map Set.fromList allN
    where
        lst = Set.elems cs
        allN = map listNeighbours lst

fullCheck :: CoordSet -> CoordSet
fullCheck c = Set.fromList $ filter (`check` c) bigList
    where
        bigList = allToCheck c
        check :: HexCoord -> CoordSet -> Bool
        check h cs 
            | Set.member h cs && (ns == 0 || ns > 2) = False
            | Set.member h cs && ns>0 && ns <= 2 = True
            | not (Set.member h cs) && ns == 2 = True 
            | otherwise = False 
            where
                ns = neighbours h cs 
