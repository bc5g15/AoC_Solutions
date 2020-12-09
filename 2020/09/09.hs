import Data.List (inits, tails)
import Data.Maybe (isJust, fromJust)
import Data.Time.Clock (getCurrentTime, diffUTCTime)

main = do
    instring <- readFile "in.txt"
    let inlines = map (\x -> read x::Int) $ lines instring
    -- Part 1
    let poss = possibilities 25 inlines
    let part1 = fst . head. filter (null . snd) $ map (uncurry sums) poss
    print part1

    -- Part 2
    start <- getCurrentTime
    let allSublists = concatMap inits $ tails inlines
    let result = head $ filter (\x -> sum x == part1 && length x >= 2) allSublists
    print (minimum result + maximum result)
    firstEnd <- getCurrentTime
    print $ diffUTCTime firstEnd start -- ~7.5s

    -- Part 2 Imperative
    let result2 = head $ sumImper part1 inlines
    print (minimum result2 + maximum result2)
    secondEnd <- getCurrentTime
    print $ diffUTCTime secondEnd firstEnd -- ~0.5s

sums :: Int -> [Int] -> (Int, [(Int, Int)])
sums r xs = (r, [(a, b) | a <- xs, b <- xs, a/=b, a+b==r])

possibilities :: Int -> [Int] -> [(Int, [Int])]
possibilities pre xs = [(xs !! n, take pre $ drop (n-pre) xs) | n <- [pre..length xs-1]]

sumImper :: Int -> [Int] -> [[Int]]
sumImper _ [] = []
sumImper r full@(_:xs)
    | isJust n = fromJust n : sumImper r xs
    | otherwise = sumImper r xs
    where 
        check :: Int -> Int -> [Int] -> Maybe [Int]
        check r a xs 
            | total < r = check r (a+1) xs
            | total > r = Nothing
            | otherwise = Just (take a xs)
            where total = sum $ take a xs
        n = check r 2 full