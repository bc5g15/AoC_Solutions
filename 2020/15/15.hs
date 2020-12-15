import qualified Data.Map.Strict as Map
main = do 
    let innums = [6,4,12,1,20,0,16]

    let start = initialRead innums
    print . (\(x,y,_) -> (x,y)) $ iterate takeTurn start !! (2020 - length innums)

-- State = (Turn, LastSaid, Memory)
type State = (Int, Int, Map.Map Int Int)

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
