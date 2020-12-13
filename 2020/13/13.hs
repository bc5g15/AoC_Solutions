import Data.List.Split (splitOn)
import Data.List (minimumBy, maximumBy, (\\))

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    -- Part 1
    let startTime = read (head inlines)::Int
    let buses = map (\x -> read x::Int) (filter (/="x") $ splitOn "," (inlines !! 1))
    let timeDiff = \x -> abs $ mod startTime x-x
    let busTimes = [(x, timeDiff x) | x<-buses]
    let bestTime = minimumBy (\(_, a) (_, b) -> compare a b) busTimes
    print bestTime
    print $ uncurry (*) bestTime

    -- Part 2
    let constraints = zip (splitOn "," $ inlines !! 1) [0..]
    let conFs = map conF constraints
    -- -- print $ head . dropWhile (not . all . map ($) conFs) [1..]
    let step = maximumBy (\(a,_) (b,_) -> compare a b) . map (\(a,b) -> (read a::Int, b)) $ filter (\(a,_) -> a/="x") constraints
    -- print step
    let range = \(a, b) -> [x-b | x<-[0, a..]] 
    -- -- print constraints
    -- let k = map ($ 1068781) conFs
    -- -- print k
    -- -- print $ map ($ 1068781) conFs
    let check = \x -> map ($ x) conFs
    print . head $ dropWhile (not . and . check) $ range step
    -- print constraints

conF :: (String, Int) -> (Int -> Bool)
conF ("x", _) _ = True
conF (a, i) x = mod (x+i) n == 0
    where n = read a::Int