import Data.List (transpose)
import qualified Data.Map.Strict as Map
import qualified Data.Set as Set 
import Data.List.Split (splitOn)

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring

    let tiles = map (\x -> (takeTitle (head x), tail x)) $ splitOn [""] inlines

    -- Part 1
    let puzzle = buildPuzzle (head tiles) (tail tiles)
    print . product $ corners puzzle

    -- Part 2
    let puzString = joinPuzzle puzzle

    let flips = [id, reverse, map reverse, reverse . map reverse]
    let turn = reverse.transpose
    let turns = [id, turn, turn.turn, turn.turn.turn]

    let transforms = [x . y | x<-flips, y<-turns]
    let monsters = map (\f -> f monStr) transforms
    let maxx = length $ head puzString
    let maxy = length puzString
    let puzSet = strToSet puzString
    let monSets = map strToSet monsters
    let monCount = maximum (map (\x -> monSearch x puzSet (maxx, maxy)) monSets)
    
    -- Final calculations!
    let monSize = Set.size $ head monSets
    let puzSize = Set.size puzSet 
    print (puzSize - (monCount * monSize))

type Piece = (Int, [String])
type Puzzle = Map.Map (Int, Int) Piece

corners :: Puzzle -> [Int]
corners p = [fst $ p Map.! (x, y)| x<-[minx,maxx], y<-[miny,maxy]]
    where
        keys = Map.keys p
        minx = minimum $ map fst keys
        maxx = maximum $ map fst keys
        miny = minimum $ map snd keys 
        maxy = maximum $ map snd keys 

takeTitle :: String -> Int
takeTitle x = read (drop 5 $ init x)::Int

prettyPrint :: Piece -> String
prettyPrint (_, y) = unlines y

flipV :: Piece -> Piece
flipV (x, v) = (x, reverse v)

flipH :: Piece -> Piece
flipH (x, v) =(x, map reverse v)

clockwise :: Piece -> Piece
clockwise (x, v) = (x, reverse $ transpose v)

checkMatch :: Piece -> Piece -> (Int, Int) 
checkMatch (_, v1) (_, v2)
    | t v1 == b v2 = (0,-1)
    | r v1 == l v2 = (1, 0)
    | b v1 == t v2 = (0,1)
    | l v1 == r v2 = (-1,0)
    | otherwise = (0, 0)
    where
        t = head 
        b = last
        l = map head
        r = map last

anyMatch :: Piece -> Piece -> Maybe ((Int, Int), Piece)
anyMatch p1 p2 
    | not (null ts) = Just (head ts)
    | otherwise = Nothing
    where
        flips = [id, flipH, flipV, flipH.flipV]
        rotates = [id, clockwise, clockwise . clockwise, clockwise . clockwise . clockwise]
        transforms = [x . y | x<-flips, y<-rotates]
        ts = filter ((/=(0,0)) . fst) $ map (\f -> (checkMatch p1 (f p2), f p2)) transforms


buildPuzzle :: Piece -> [Piece] -> Puzzle
buildPuzzle p ps = inner (Map.singleton (0, 0) p) p (0, 0) ps [] []
    where
        inner :: Puzzle -> Piece -> (Int, Int) -> [Piece] -> [Piece] -> [(Int, Int)] -> Puzzle
        inner acc _ _ [] [] [] = acc
        inner acc _ _ [] seen (t:todo) =  inner acc (acc Map.! t) t seen [] todo
        inner acc o (x, y) (p:ps) seen todo = case am of 
            Nothing -> inner acc o (x, y) ps (p:seen) todo
            Just ((i, j), np) -> inner (Map.insert (x+i, y+j) np acc) o (x, y) ps seen ((x+i,y+j):todo)
            where
                am = anyMatch o p

-- Part 2 
stripEdges :: Piece -> Piece
stripEdges (x, n) = (x, tail . init $ map (tail . init) n)

joinPuzzle :: Puzzle -> [String]
joinPuzzle n = final
    where
        keys = Map.keys n
        minx = minimum $ map fst keys
        maxx = maximum $ map fst keys
        miny = minimum $ map snd keys
        maxy = maximum $ map snd keys
        enrow = \y -> [snd . stripEdges $ n Map.! (x, y) | x<-[minx..maxx]]
        rows = map enrow [miny..maxy]
        rowJoin :: [[String]] -> [String]
        rowJoin ([]:_) = []
        rowJoin ms@(_:_) = concatMap head ms : rowJoin (map tail ms)
        final = concatMap rowJoin rows

strToSet :: [String] -> Set.Set (Int, Int) 
strToSet xs = Set.fromList (innery 0 xs)
    where
        innerx :: Int -> Int -> String -> [(Int, Int)]
        innerx _ _ [] = []
        innerx i j ('#':xs) = (i, j) : innerx (i+1) j xs
        innerx i j (_:xs) = innerx (i+1) j xs
        innery :: Int -> [String] -> [(Int, Int)]
        innery _ [] = []
        innery j (x:xs) = innerx 0 j x ++ innery (j+1) xs

monStr :: [String]
monStr = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   " ]

monSearch :: Set.Set (Int, Int) -> Set.Set (Int, Int) -> (Int, Int) -> Int 
monSearch mons stage (maxx, maxy)= length [(x,y)|x<-[0..maxx], y<-[0..maxy], Set.size (Set.intersection (Set.map (\(a, b) -> (a+x, b+y)) mons) stage) == Set.size mons ]