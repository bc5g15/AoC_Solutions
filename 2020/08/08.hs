import qualified Data.Set as Set

-- State = (PC, ACC)
type State = (Int, Int)
type Instruction = (String, Int)

main = do
    instring <- readFile "in.txt"
    let code = (map ((\x -> (head x, readJump (head $ tail x))) . words) . lines) instring
    -- Part 1
    print $ runUntilRepeat code


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
proccess _ (x, _) = error "Unrecognized Instruction: " ++ x

runUntilRepeat :: [Instruction] -> State
runUntilRepeat x = runInner x (0, 0) Set.empty
    where
        runInner :: [Instruction] -> State -> Set.Set Int -> State
        runInner xs state@(pc, _) visited 
            | Set.member pc visited = state
            | otherwise = runInner xs (process state (xs !! pc)) (Set.insert pc visited)
