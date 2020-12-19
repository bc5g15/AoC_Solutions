import Data.List.Split (splitOn)
import qualified Data.Map.Strict as Map 

type Rules = Map.Map Int Rule

main::IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let ruleLines = takeWhile (/="") inlines
    let stringLines = tail $ dropWhile (/="") inlines
    let rules = Map.fromList $ map readMapRule ruleLines
    -- Part 1
    let topRule = resolve (rules Map.! 0) rules
    print . length . filter ((==True). snd) $ map (\x -> (x, qCheck x topRule)) stringLines
    -- Part 2
    let rule8 = INF8 (LNK 42)
    let rule11 = INF11 (LNK 42, LNK 31)
    let newRules = Map.insert 8 rule8 $ Map.insert 11 rule11 rules
    let newTop = resolve (newRules Map.! 0) newRules
    print . length . filter (==True) $ map (`qCheck` newTop) stringLines

data Rule = C Char | OR (Rule, Rule) | LNK Int | SEQ [Rule] | INF8 Rule | INF11 (Rule, Rule) deriving (Show)

qCheck :: String -> Rule -> Bool
qCheck xs r = case r of
    C a -> take 1 xs == a:""
    OR (r1, r2) -> qCheck xs r1 || qCheck xs r2
    SEQ rs -> eatSeq xs rs
    LNK _ -> error "Not permitting unlinked rules"
    where
        eatSeq :: String -> [Rule] -> Bool
        eatSeq [] [] = True
        eatSeq _ [] = False
        eatSeq xs ((INF8 r):rs) 
            | null r8l = False
            | otherwise = any (\k -> eatSeq (drop k xs) rs) r8l
            where
                r8l = r8i xs r 0
        eatSeq xs ((INF11 (r1,r2)):rs)
            | r11l == 0 = False
            | otherwise = eatSeq (drop r11l xs) rs
            where
                r11l = r11i xs r1 r2
        eatSeq xs (r:rs) = let rl = ruleLength r in
            qCheck (take rl xs) r && eatSeq (drop rl xs) rs

r11i :: String -> Rule -> Rule -> Int 
r11i xs r1 r2 
    | not (null eatL) && rl2 * timesL `elem` eatR  = maxL + (rl2 * timesL)
    | otherwise = 0
    where
        rl1 = ruleLength r1
        rl2 = ruleLength r2
        eatL = r8i xs r1 0
        maxL = maximum eatL
        timesL = div maxL rl1
        eatR = r8i (drop maxL xs) r2 0

r8i :: String -> Rule -> Int -> [Int]
r8i xs r i 
    | rl <= length xs && edible = (i+rl) : r8i (drop rl xs) r (i+rl)
    | otherwise = []
    where 
        rl = ruleLength r 
        edible = canEat xs r

canEat :: String -> Rule -> Bool
canEat xs r = qCheck (take (ruleLength r) xs) r

ruleLength :: Rule -> Int
ruleLength r = case r of 
    C a -> 1
    OR (r1, _) -> ruleLength r1
    SEQ rs -> sum $ map ruleLength rs
    LNK _ -> error "No Links here either!"
    INF8 r1 -> ruleLength r1
    INF11 (r1, r2) -> ruleLength r1 + ruleLength r2

resolve :: Rule -> Rules -> Rule
resolve r rs = case r of
    C a -> C a
    OR (a, b) -> OR (resolve a rs, resolve b rs)
    SEQ as -> SEQ (map (`resolve` rs) as)
    LNK i -> resolve (rs Map.! i) rs
    INF8 r-> INF8 (resolve r rs)
    INF11 (r1, r2) -> INF11 (resolve r1 rs, resolve r2 rs)

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
