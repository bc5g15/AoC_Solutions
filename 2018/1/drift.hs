import System.IO
import qualified Data.Set as Set

main = do
    h <- openFile "in.txt" ReadMode
    contents <- hGetContents h
    let c = lines contents
    print (sum $ (translateLine c))
    print (findTwice (translateLine c))

translateLine :: [String] -> [Int]
translateLine [] = []
translateLine (i@(c:cs):xs) | c=='+' = (read cs :: Int) : translateLine xs
    | otherwise = (read i :: Int) : translateLine xs 

-- First - 427 - Correct! - Easy to do functionally

findTwice :: [Int] -> Int
findTwice xs = inner (cycle xs) Set.empty 0
 where
  inner :: [Int] -> Set.Set Int -> Int -> Int
  inner (x:xs) a acc | Set.member b a = b
   | otherwise = inner xs (Set.insert b a) b
   where b = acc + x

-- Second - 341 - Correct! - A little trickier
