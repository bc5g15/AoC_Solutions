import Data.Set (size, fromList)
import Data.List (foldl', intersect)

main = do
    instring <- readFile "in.txt"
    let ingroups = inputJoiner . map words $ lines instring
    -- Part 1
    let inlines = map (foldl' (++) "") ingroups
    let insets = map fromList inlines
    print . sum $ map size insets
    -- Part 2
    let distinct = map (foldl' intersect ['a'..'z']) ingroups
    print . sum $ map length distinct

inputJoiner :: [[String]] -> [[String]]
inputJoiner [] = []
inputJoiner [a] = [a]
inputJoiner (a:[]:xs) = a : inputJoiner xs
inputJoiner (a:b:xs) = inputJoiner ((a++b):xs)
