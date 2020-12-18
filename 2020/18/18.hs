import Data.List.Split (splitOn)
import Data.Char (digitToInt)
import Debug.Trace (trace)

data Op = Read | Plus | Mult deriving (Show)

main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let insymbols = map (concat . splitOn " ") inlines
    -- part 1
    print . sum $ map (\x -> eat2 x 0 Read) insymbols
    -- part 2
    print . sum $ map (\x -> eat3 x 0 Read) insymbols

eat2 :: String -> Int -> Op -> Int
eat2 [] acc _ = acc
eat2 (a:as) acc op = case a of
    '+' -> eat2 as acc Plus
    '*' -> eat2 as acc Mult
    '(' -> eat2 (drop (findMatchingParen as) as) (apply op acc (eat2 (take (findMatchingParen as) as) 0 Read)) op
    ')' -> eat2 as acc op -- Ignore
    n -> eat2 as (apply op acc (digitToInt n)) Read
    where
        apply :: Op -> Int -> Int -> Int
        apply op x y = case op of
            Plus -> x + y
            Mult -> x * y
            Read -> y

findMatchingParen :: String -> Int
findMatchingParen xs = eat xs 1 0
    where
        eat :: String -> Int -> Int -> Int
        eat [] _ acc = acc
        eat _ 0 acc = acc-1
        eat ('(':xs) n acc = eat xs (n+1) (acc+1)
        eat (')':xs) n acc = eat xs (n-1) (acc+1)
        eat (x:xs) n acc = eat xs n (acc+1)

eat3 :: String -> Int -> Op -> Int
eat3 [] acc _ = acc
eat3 (a:as) acc op = case a of
    '+' -> eat3 as acc Plus
    '*' -> acc * eat3 as 0 Read
    '(' -> eat3 (drop (findMatchingParen as) as) (apply op acc (eat3 (take (findMatchingParen as) as) 0 Read)) op
    ')' -> eat3 as acc op -- Ignore
    n -> eat3 as (apply op acc (digitToInt n)) Read
    where
        apply :: Op -> Int -> Int -> Int
        apply op x y = case op of
            Plus -> x + y
            Mult -> x * y
            Read -> y
