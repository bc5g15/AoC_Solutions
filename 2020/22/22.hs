import qualified Data.Set as Set
import Debug.Trace (trace)

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring 
    let player1 = map toInt . takeWhile (/="") $ tail inlines
    let player2 = map toInt . tail $ dropWhile (/="Player 2:") inlines
    let winningHand = toVictory player1 player2 
    print $ score winningHand 

    -- Part 2
    let winningHand2 = uncurry (++) $ playRGame (player1, player2) Set.empty
    print $ score winningHand2

toInt :: String -> Int
toInt x = read x::Int

toVictory :: [Int] ->  [Int] -> [Int]
toVictory as bs 
    | null nas = nbs
    | null nbs = nas
    | otherwise = toVictory nas nbs
    where
        (nas, nbs) = playRound (as, bs)

playRound :: ([Int], [Int]) -> ([Int], [Int])
playRound (a:as, b:bs) 
    | a > b = (as ++ [a,b], bs)
    | b > a = (as, bs ++ [b, a])
    | otherwise = ([], [])
playRound (_, _) = ([], [])

score :: [Int] -> Int
score as = sum . zipWith (*) [1 .. ] $ reverse as

-- Part 2
type State = ([Int], [Int])

playRGame :: State -> Set.Set State -> State
playRGame ([], p2) _ = ([], p2)
playRGame (p1, []) _ = (p1, [])
playRGame state@(a:as, b:bs) s
    | Set.member state s = (a:as, [])
    | otherwise = playRGame (playRRound state) (Set.insert state s)

playRRound :: State -> State 
playRRound (a:as, b:bs) 
    | a <= length as && b <= length bs && p2win = (as, bs ++ [b, a])
    | a <= length as && b <= length bs && not p2win = (as ++ [a, b], bs)
    | a > b = (as ++ [a, b], bs)
    | b > a = (as, bs ++ [b, a])
    | otherwise = ([], [])
    where
        p2win = null . fst $ playRGame (take a as, take b bs) Set.empty
