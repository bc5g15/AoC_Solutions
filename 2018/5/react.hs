import System.IO
import Data.Char
import qualified Data.Set as Set

-- 9390 - Correct! - After a bit of troubleshooting
--
-- Takes about 14:30 minutes. Can we speed that up with concurrency?

main = do
    h <- openFile "in.txt" ReadMode
    c <- hGetContents h
    let cs = filter (not . isSpace) c
    --print (length $ fullReact cs)
    let ys = distinct ( map toUpper cs)
    --print (fullCompute ys cs)
    pCompute ys cs
    hClose h

pCompute :: [Char] -> String -> IO ()
pCompute [] _ = return ()
pCompute (a:as) xs = do
    let y = length $ fullReact $ remove' a xs
    print ((show a) ++ ":" ++ (show y))
    pCompute as xs

fullCompute :: [Char] -> String -> [(Char, Int)]
fullCompute [] _ = []
fullCompute (a:as) xs = (a, length $ fullReact $ remove' a xs) : fullCompute as xs

fullReact :: String -> String
fullReact xs | (length xs) > (length ys) = fullReact ys
 | otherwise = xs
 where ys = react xs

react :: String -> String
react [] = []
react (a:[]) = a:[]
react (a:b:xs) | opp a b = react xs
 |otherwise = (a:(react $ b:xs))

opp :: Char -> Char -> Bool
opp a b | x && not y && z = True
 | not x && y && z = True
 | otherwise = False
 where
  x = isUpper a
  y = isUpper b
  z = (toUpper a) == (toUpper b)

distinct :: String -> String
distinct xs = inner Set.empty xs where
 inner s (x:xs)
  | x `Set.member` s = inner s xs
  | otherwise        = x : inner (Set.insert x s) xs
 inner _ _           = []

remove' :: Char -> String -> String
remove' _ [] = []
remove' a (x:xs)
 | (toUpper x) == a = remove' a xs
 | otherwise = x : (remove' a xs)
