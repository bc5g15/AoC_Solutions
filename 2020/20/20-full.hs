import Data.List (transpose)
import qualified Data.Map.Strict as Map
import Data.List.Split (splitOn)
import Debug.Trace (trace)

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring

    let tiles = map (\x -> (takeTitle (head x), tail x)) $ splitOn [""] inlines

    let puzzle = buildPuzzle (head tiles) (tail tiles)
    print . product $ corners puzzle

type Piece = (Int, [String])
type Puzzle = Map.Map (Int, Int) Piece
type Shift = Piece -> Piece

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
    | t v1 == b v2 = (0, 1)
    | r v1 == l v2 = (1, 0)
    | b v1 == t v2 = (0,-1)
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
        -- inner acc _ (x, y) [] seen [] = acc
        inner acc _ _ [] seen (t:todo) =  inner acc (acc Map.! t) t seen [] todo
        inner acc o (x, y) (p:ps) seen todo = case am of 
            Nothing -> inner acc o (x, y) ps (p:seen) todo
            Just ((i, j), np) -> inner (Map.insert (x+i, y+j) np acc) o (x, y) ps seen ((x+i,y+j):todo)
            where
                am = anyMatch o p