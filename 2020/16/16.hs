import Data.Text (strip, pack, breakOn, unpack)
import Data.List.Split (splitOn)
import Data.List ((\\), delete, isPrefixOf)
import Data.Bifunctor (second)

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let ranges = map readRanges $ takeWhile (/="") inlines
    let tickets = map readTicket . tail $ dropWhile(/="nearby tickets:") inlines

    -- Part 1
    let noContains = all (==False) . (\x -> [contains r x | r<-ranges])
    let invalid = map (filter noContains) tickets
    print . sum $ concat invalid 

    -- Part 2
    let myTicket = readTicket . head . tail $ dropWhile(/="your ticket:") inlines
    let valid = filter (all ((==False) . noContains)) tickets
    let validByCols = [map (!! n) valid | n <-[0..length myTicket -1]]
    let rangeOrder = [filter (all (==True). (\r -> [contains r x | x <- xs])) ranges | xs <- validByCols]
    let rangePos = zip [0..] rangeOrder
    let positions = qResolve rangePos

    -- Just being lazy at this point
    let departures = map fst $ filter (\(_, (a,_)) -> "departure" `isPrefixOf` a) positions
    
    print $ product [myTicket !! x | x<-departures]

-- Range = (Label, Min, Max)
type Range = (String, [(Int, Int)])

qResolve :: [(Int, [Range])] -> [(Int, Range)]
qResolve rs
    | done = [finalOne]
    | otherwise = finalOne : qResolve cleanRemaining
    where 
        one =  head $ filter (\(_, b) -> length b == 1) rs
        oneR = (\(_, [a]) -> a) one
        finalOne = (\(x,[a]) -> (x, a)) one
        done = all ((==1) . (\(_, b) -> length b)) rs
        remaining = delete one rs 
        cleanRemaining = map (second (delete oneR)) remaining

contains :: Range -> Int -> Bool
contains (_, xs) n = any ((==True) . inner) xs
    where 
        inner :: (Int, Int) -> Bool
        inner (x, y) = x <= n && y >= n 

readRanges :: String -> Range
readRanges x = (label, ranges)
    where 
        [label, r] = splitOn ":" x
        rangeText = map (breakOn (pack "-") . strip . pack) $ splitOn " or " r
        ranges = map (\(x, y) -> (read (unpack x)::Int, read (tail $ unpack y)::Int)) rangeText

readTicket :: String -> [Int]
readTicket x = map (\y -> read y::Int) (splitOn "," x)