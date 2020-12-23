import Data.Char (digitToInt, intToDigit)
import Debug.Trace (trace)
import Data.Time.Clock (getCurrentTime, diffUTCTime)

main :: IO ()
main = do
    let cupString = "318946572"
    let cups = map digitToInt cupString

    print . concatMap show $ fromOne (playNTimes 100 cups)

    -- Part 2
    -- let cups2 = cups ++ [maximum cups+1..1000000]
    -- -- print . take 2 . fromOne $ move cups2
    -- -- print . take 2 . fromOne $ playNTimes 10000000 cups2

    -- -- start <- getCurrentTime 
    -- -- print . take 2 . fromOne $ move cups2
    -- -- now <- getCurrentTime
    -- -- print $ diffUTCTime now start

    -- -- print . take 10 $ map fromOne (iterate move cups)

pickDestination :: Int -> [Int] -> Int
pickDestination i xs 
    | not $ null lowers = head lowers
    | otherwise = maxx
    where
        minx = minimum xs
        maxx = maximum xs
        lowers = reverse $ filter (`elem` xs) [1..i]

pickDest :: Int -> [Int] -> Int
pickDest i xs
    | not $ null lowers = head lowers
    | otherwise = maxx
    where
        maxx = 1000000
        lowers = reverse $ filter (not . (`elem` xs)) [1..i]

rotateTo :: Eq a => a -> [a] -> [a]
rotateTo i xs = let (end, start) = span (/=i) xs in
    start ++ end

addAt :: Int -> [Int] -> [Int] -> [Int]
addAt dest vals lst = let (start, end) = span (/=dest) lst in
    start ++ (dest:vals) ++ tail end


move :: [Int] -> [Int]
move (a:as) = finalLst ++ [a]
    where
        (pickup, remainder) = splitAt 3 as
        dest = pickDestination a remainder
        finalLst = addAt dest pickup remainder

playNTimes :: Int -> [Int] -> [Int]
playNTimes 0 xs = xs
playNTimes n xs = playNTimes (n-1) (move xs)

fromOne :: [Int] -> [Int]
fromOne = tail . rotateTo 1