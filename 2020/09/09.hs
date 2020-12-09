import Data.List (inits, tails)

main = do
    instring <- readFile "in.txt"
    let inlines = map (\x -> read x::Int) $ lines instring
    -- Part 1
    let poss = possibilities 25 inlines
    let part1 = fst . head. filter (null . snd) $ map (uncurry sums) poss
    print part1
    -- Part 2
    let k = concatMap inits $ tails inlines
    let result = head $ filter (\x -> sum x == part1 && length x >= 2) k
    print (minimum result + maximum result)

sums :: Int -> [Int] -> (Int, [(Int, Int)])
sums r xs = (r, [(a, b) | a <- xs, b <- xs, a/=b, a+b==r])

possibilities :: Int -> [Int] -> [(Int, [Int])]
possibilities pre xs = [(xs !! n, take pre $ drop (n-pre) xs) | n <- [pre..length xs-1]]