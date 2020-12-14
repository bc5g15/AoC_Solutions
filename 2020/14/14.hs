import Data.Char (digitToInt)
import Data.List (foldl')
import Data.List.Split (splitOn)
import qualified Data.Map.Strict as Map

data Op = Mask | Mem Int deriving (Show)
type Instr = (Op, String)

main = do
    instring <- readFile "in.txt"
    let inlines = lines instring
    let instrs = map readInstr inlines
    let (_, memory) = runAll instrs ("", Map.empty)
    print $ Map.foldl (+) 0 memory

    -- Part 2 
    let (_, mem2) = runAll2 instrs ("", Map.empty)
    print $ Map.foldl (+) 0 mem2

readContents :: String -> Char -> Char -> String
readContents a leftD rightD = let s = tail $ dropWhile (/=leftD) a 
    in takeWhile (/=rightD) s

bin2int :: String -> Int
bin2int = foldl' (\acc x -> acc * 2 + digitToInt x) 0

fillOut :: String -> String
fillOut xs = replicate (36 - length xs) '0' ++ xs 

int2bin :: Int -> String
int2bin 0 = ['0']
int2bin n = reverse (eat n)
    where
        eat :: Int -> String
        eat 0 = []
        eat n
            | odd n = '1' : eat (div n 2)
            | otherwise = '0' : eat (div n 2)

readInstr :: String -> Instr
readInstr s = (op, r)
    where 
        parts = splitOn " = " s
        l = head parts
        r = parts !! 1
        toOp :: String -> Op
        toOp "mask" = Mask
        toOp x = Mem (read (readContents x '[' ']')::Int)
        op = toOp l

runAll :: [Instr] -> State -> State
runAll [] s = s
runAll (i:is) s = runAll is next
    where
        next = runInstr i s 

-- -- State = (Mask, Memory)
type State = (String, Map.Map Int Int)
runInstr :: Instr -> State -> State 
runInstr (Mask, v) (_, m) = (v, m)
runInstr (Mem i, v) (x, m) = (x, Map.insert i readV m)
    where
        readV = bin2int . (`applyMask` x) . fillOut $ int2bin (read v::Int)

applyMask :: String -> String -> String 
applyMask [] [] = []
applyMask (v:vs) (m:ms) = case m of 
    'X' -> v : applyMask vs ms
    _ -> m : applyMask vs ms 


-- Part 2 functions
runAll2 :: [Instr] -> State -> State
runAll2 [] s = s
runAll2 (i:is) s = runAll2 is next
    where
        next = runPart2 i s

runPart2 :: Instr -> State -> State
runPart2 (Mask, v) (_, m) = (v, m)
runPart2 (Mem i, v) (x, m) = (x, Map.union total m)
    where
        vs = read v::Int
        is = map bin2int ((`applyMask2` x) . fillOut $ int2bin i)
        total = Map.fromList [(j, vs)| j<-is]

applyMask2 :: String -> String -> [String]
applyMask2 a b = mask2 $ maskString a b

maskString :: String -> String -> [String]
maskString [] [] = [] 
maskString (v:vs) (m:ms) = maskChar v m : maskString vs ms

maskChar :: Char -> Char -> [Char]
maskChar v m = case m of
    '0' -> [v]
    '1' -> ['1']
    'X' -> ['0', '1']

mask2 :: [[Char]] -> [String]
mask2 vs = inner vs ""
    where
        inner :: [[Char]] -> String -> [String]
        inner [] acc = [reverse acc]
        inner ([v]:vs) acc = inner vs (v:acc)
        inner ([v1, v2]:vs) acc = inner vs (v1:acc) ++ inner vs (v2:acc)
