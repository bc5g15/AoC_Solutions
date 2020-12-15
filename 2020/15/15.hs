import qualified Data.Map.Strict as Map
import Data.Time.Clock (getCurrentTime, diffUTCTime)

main = do 
    let innums = [6,4,12,1,20,0,16]

    let start = initialRead innums
    -- part 1
    print . (\(x,y,_) -> (x,y)) $ iterate takeTurn start !! (2020 - length innums)
    -- part 2
    startTime <- getCurrentTime
    print . (\(_,y,_) -> y) $ runUntilTurn start 30000000
    endTime <- getCurrentTime
    print $ diffUTCTime endTime startTime -- ~90s

-- State = (Turn, LastSaid, Memory)
type State = (Int, Int, Map.Map Int Int)

runUntilTurn :: State -> Int -> State
runUntilTurn state@(t, _, _) x
    | t == x = state
    | otherwise = runUntilTurn (takeTurn state) x

initialRead :: [Int] -> State 
initialRead xs = (t, l, m)
    where
        m = Map.fromList $ zip (init xs) [1..]
        l = last xs
        t = length xs

takeTurn :: State -> State 
takeTurn (t, l, m)
    | Map.member l m = (t+1, t-(m Map.! l), newM)
    | otherwise =  (t+1, 0, newM)
        where
            newM = Map.insert l t m
