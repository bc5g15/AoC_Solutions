import qualified Data.Map.Strict as Map
import qualified Data.Set as Set
import Data.List.Split (splitWhen)

type Rule = (String, [(String, Int)])
type Contain = Map.Map String [String]
type Contents = Map.Map String [(String, Int)]

main = do
    instring <- readFile "test.txt"
    let inlines = lines instring
    let rules = map readRule inlines
    -- Part 1
    let contains = Map.fromListWith (++) $ concatMap readContains rules
    print . Set.size $ allContainers "shiny gold" contains
    -- Part 2
    -- print $ head rules
    -- print rules
    -- let contents = Map.fromList rules
    -- print $ allContents "shiny gold" contents

    print "Hello"

readRule :: String -> Rule
readRule xs = (col, rules)
    where
        xws = words xs
        col = unwords $ take 2 xws
        rest = tail $ dropWhile (/="contain") xws
        ruleStr = splitWhen (==',') $ unwords rest
        rules = map (\x -> (unwords . take 2 . drop 1 $ words x, read (unwords . take 1 $ words x)::Int )) ruleStr

readContains :: Rule -> [(String, [String])]
readContains (_, []) = []
readContains (a, (x, _):xs) = (x, [a]) : readContains (a, xs)

allContainers :: String -> Contain -> Set.Set String
allContainers a m = Set.fromList opts `Set.union` otherSets
    where 
        opts = Map.findWithDefault [] a m
        otherSets = Set.unions $ map (`allContainers` m) opts

allContents :: String -> Contents -> Int
allContents a m = sum (map snd opts) + sum (map ((`allContents` m) . fst) opts)
    where
        opts = Map.findWithDefault [] a m