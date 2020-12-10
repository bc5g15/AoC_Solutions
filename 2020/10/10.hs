import Data.List (sort)
import qualified Data.Set as Set

main = do
    instring <- readFile "in.txt"
    let inlines = map (\x -> read x::Int) $ lines instring
    -- Part 1
    let sorted = sort inlines
    let myDiffs =  1 : diffs sorted -- first jump is always 1
    let [ones, threes] = [length $ filter x myDiffs | x <- [(==3), (==1)]]
    print $ ones * threes
    -- Part 2
    let groups = filter (/=0) $ oneGroups myDiffs
    let ones = repeat 1
    let numPerms = Set.size . Set.fromList . fullPerms
    let m = map (\x -> numPerms $ take x ones) groups
    print $ product m

diffs :: [Int] -> [Int]
diffs [_] = [3] -- Final jump is always 3
diffs (a:b:xs) = (b-a) : diffs (b:xs)

oneGroups :: [Int] -> [Int]
oneGroups [] = []
oneGroups (1:xs) = 1 + length (takeWhile (==1) xs) : oneGroups (dropWhile (==1) xs)
oneGroups (_:xs) = oneGroups xs

fullPerms :: [Int] -> [[Int]]
fullPerms [] = [[]]
fullPerms [1] = [[1]]
fullPerms [1,1] = [[2], [1,1]]
fullPerms [1,1,1] = [[3], [2,1], [1,2], [1,1,1]]
fullPerms xs = [1:x | x<-fullPerms (drop 1 xs)] ++ [y++x| x<-fullPerms (drop 2 xs), y<-fullPerms (take 2 xs)] ++ [y++x| x<- fullPerms (drop 3 xs), y<-fullPerms (take 3 xs)]