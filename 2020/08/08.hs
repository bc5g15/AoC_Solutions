import qualified Data.Set as Set
import Data.Maybe (isJust)

-- State = (PC, ACC)
type State = (Int, Int)
type Instruction = (String, Int)

main = do
    instring <- readFile "in.txt"
    let code = (map ((\x -> (head x, readJump (head $ tail x))) . words) . lines) instring
    -- Part 1
    print $ runUntilRepeat code
    -- Part 2
    let k = zip code [0..]
    let swapPos = map snd $ filter (\((x, _), _) -> x == "nop" || x == "jmp") k
    let codesSwaps = map (swapOne code) swapPos
    print . filter isJust $ map strictRun codesSwaps


readJump :: String -> Int
readJump x 
    | sign == '-' = - value
    | otherwise = value
    where
        sign = head x
        value = read (tail x)::Int

process :: State -> Instruction -> State
process (pc, acc) ("nop", _)    = (pc+1, acc)
process (pc, acc) ("acc", val)  = (pc+1, acc+val)
process (pc, acc) ("jmp", val)  = (pc+val, acc)
process _ (x, _) = error ("Unrecognized Instruction: " ++ x)

runUntilRepeat :: [Instruction] -> State
runUntilRepeat x = runInner x (0, 0) Set.empty
    where
        runInner :: [Instruction] -> State -> Set.Set Int -> State
        runInner xs state@(pc, _) visited 
            | Set.member pc visited = state
            | otherwise = runInner xs (process state (xs !! pc)) (Set.insert pc visited)

strictRun :: [Instruction] -> Maybe State
strictRun xs = runInner xs (0, 0) Set.empty
    where 
        runInner :: [Instruction] -> State -> Set.Set Int -> Maybe State
        runInner xs state@(pc, _) visited
            | Set.member pc visited = Nothing
            | pc == length xs = Just state
            | pc < 0 || pc > length xs = Nothing
            | otherwise = runInner xs (process state (xs !! pc)) (Set.insert pc visited)

swap :: Instruction -> Instruction
swap ("nop", x) = ("jmp", x)
swap ("jmp", x) = ("nop", x)
swap other = other

swapOne :: [Instruction] -> Int -> [Instruction]
swapOne xs i = take i xs ++ [swap (xs !! i)] ++ drop (i+1) xs