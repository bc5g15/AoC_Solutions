import Data.Char (digitToInt)
import Data.List (foldl')

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let ids = map getId inlines
    -- Part 1
    print $ foldl' max 0 ids
    -- Part 2
    let _min = foldl' min 9999 ids
    let _max = foldl' max 0 ids
    print . head $ filter (`notElem` ids) [_min.._max]

getId :: String -> Int 
getId xs = (toDec . toBin $ take 7 xs) * 8 + (toDec. toBin $ drop 7 xs) 

toBin :: String -> String
toBin [] = []
toBin (x:xs) = conv x : toBin xs
    where
        conv :: Char -> Char 
        conv 'F' = '0'
        conv 'B' = '1'
        conv 'L' = '0'
        conv 'R' = '1'
        conv _ = error "Unrecognized Char"

toDec :: String -> Int
toDec = foldl' (\acc x -> acc * 2 + digitToInt x) 0