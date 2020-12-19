import Data.List.Split (splitOn)
import qualified Data.Map.Strict as Map 
import Debug.Trace (trace)

type Rules = Map.Map Int Rule

main::IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let ruleLines = takeWhile (/="") inlines
    let stringLines = tail $ dropWhile (/="") inlines
    let rules = Map.fromList $ map readMapRule ruleLines
    let topRule = resolve (rules Map.! 0) rules
    print . length . filter ((==True). snd) $ map (\x -> (x, qCheck x topRule)) stringLines

data Rule = C Char | OR (Rule, Rule) | LNK Int | SEQ [Rule] deriving (Show)

qCheck :: String -> Rule -> Bool
qCheck xs r = case r of
    C a -> head xs == a
    OR (r1, r2) -> qCheck xs r1 || qCheck xs r2
    SEQ rs -> eatSeq xs rs
    LNK _ -> error "Not permitting unlinked rules"
    where
        eatSeq :: String -> [Rule] -> Bool
        eatSeq [] [] = True
        eatSeq _ [] = False
        eatSeq xs (r:rs) = let rl = ruleLength r in
            qCheck (take rl xs) r && eatSeq (drop rl xs) rs

ruleLength :: Rule -> Int
ruleLength r = case r of 
    C a -> 1
    OR (r1, _) -> ruleLength r1
    SEQ rs -> sum $ map ruleLength rs
    LNK _ -> error "No Links here either!"

resolve :: Rule -> Rules -> Rule
resolve r rs = case r of
    C a -> C a
    OR (a, b) -> OR (resolve a rs, resolve b rs)
    SEQ as -> SEQ (map (`resolve` rs) as)
    LNK i -> resolve (rs Map.! i) rs

readMapRule :: String -> (Int, Rule)
readMapRule xs = (i, readRule rs)
    where
        i = read (takeWhile (/=':') xs)::Int
        rs = splitOn " " . tail $ dropWhile (/=' ') xs

readRule :: [String] -> Rule
readRule xs 
    | "|" `elem` xs = let (a,b) = break (=="|") xs in 
        OR (readRule a, readRule $ tail b)
    | xs == ["\"a\""] = C 'a'
    | xs == ["\"b\""] = C 'b'
    | otherwise = SEQ (map (\x -> LNK (read x::Int)) xs)
