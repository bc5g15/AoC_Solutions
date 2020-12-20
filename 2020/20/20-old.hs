import qualified Data.Set as Set
import Data.List.Split (splitOn)
import Data.List ((\\))

-- Left-to-right, top-to-bottom
type Edge = [Char]
-- Piece = (Top, Right, Buttom, Left)
type Piece = (Edge, Edge, Edge, Edge)

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring

    let tiles = map (\x -> (takeTitle (head x), readEdges $ tail x)) $ splitOn [""] inlines

    let allPieces = map snd tiles
    let edgesMatches = map (\(x, y) -> (x, Set.size $ totalMatches y (allPieces \\ [y]))) tiles

    print . map fst $filter (\(_,y) -> y==2) edgesMatches

takeTitle :: String -> Int
takeTitle x = read (drop 5 $ init x)::Int

readEdges :: [String] -> Piece
readEdges xs = (top, right, bottom, left)
    where
        top = head xs
        bottom = last xs
        left = map head xs
        right = map last xs

flipH :: Piece -> Piece
flipH (t, r, b, l) = (reverse t, l, reverse b, r)

flipV :: Piece -> Piece
flipV (t, r, b, l) = (b, reverse r, t, reverse l)

clockwise :: Piece -> Piece
clockwise (t, r, b, l) = (reverse l, t, reverse r, b)

checkMatch :: Piece -> Piece -> (Int, Int)
checkMatch (t1, r1, b1, l1) (t2, r2, b2, l2) 
    | t1 == b2 = (0, 1)
    | r1 == l2 = (1, 0)
    | l1 == r2 = (-1,0)
    | b1 == t2 = (0,-1)
    | otherwise = (0,0)

fullMatches :: Piece -> Piece -> Set.Set (Int, Int) 
fullMatches p1 p2 = Set.fromList . filter (/=(0,0))$ map (\f -> checkMatch p1 (f p2)) transforms
    where
        flips = [id, flipH, flipV, flipH . flipV]
        rotates = [id, clockwise, clockwise . clockwise, clockwise . clockwise . clockwise]
        transforms = [x . y | x<-flips, y<-rotates]

totalMatches :: Piece -> [Piece] -> Set.Set (Int, Int)
totalMatches _ [] = Set.empty
totalMatches s (p:ps) = Set.union (fullMatches s p) (totalMatches s ps)