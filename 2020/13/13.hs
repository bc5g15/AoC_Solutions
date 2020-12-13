import Data.List.Split (splitOn)
import Data.List (minimumBy, (\\))

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    -- Part 1
    let startTime = read (head inlines)::Int
    let buses = map (\x -> read x::Int) (filter (/="x") $ splitOn "," (inlines !! 1))
    let timeDiff = \x -> abs $ mod startTime x-x
    let busTimes = [(x, timeDiff x) | x<-buses]
    let bestTime = minimumBy (\(_, a) (_, b) -> compare a b) busTimes
    print $ uncurry (*) bestTime

    -- Part 2 - Modular Multiplicative Inverse edition
    let constraints = zip (splitOn "," $ inlines !! 1) [0..]
    let conNums = filter (\(x,_) -> x/="x") constraints
    let e = map (\(x,y) -> (read x::Int, y)) conNums
    let mmiVals = map (\(x,y) -> (x, mod (x-y) x)) e
    print $ solveMMI mmiVals

mypow :: Int -> Int -> Int -> Int
mypow _ 0 _ = 1
mypow x y m
    | even y = r
    | otherwise = mod (x * r) m
    where 
        p = mod (mypow x (div y 2) m) m
        r = mod (p*p) m

modInverse :: Int -> Int -> Int
modInverse a m = mypow a (m-2) m

solveMMI :: [(Int, Int)] -> Int
solveMMI xs = mod (sum 
    [modInverse (product (map fst xs \\ [x])) x 
    * product (map fst xs \\ [x]) * y| (x, y)<-full])
    lcm 
        where 
            full = filter ((/=0) .snd) xs
            lcm = product $ map fst xs