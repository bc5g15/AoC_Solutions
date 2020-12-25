import Debug.Trace (trace)
import Control.DeepSeq (deepseq)

main :: IO ()
main = do 
    instring <- readFile "test.txt"
    let inlines = lines instring

    let key1 = read (head inlines)::Int
    let key2 = read (last inlines)::Int 
    let subj = 7

    let size1 = loopSize key1 subj
    let size2 = loopSize key2 subj

    let f1 = transform 1 key2 size1
    let f2 = transform 1 key1 size2
    print (f1, f2)

transform :: Int -> Int -> Int -> Int
transform val _ 0 = val
transform val subj n = trace (show val) transform (singleTransform val subj) subj (n-1)

t2 :: Int -> Int -> Int
t2 n subj = (subj ^ n) `mod` 20201227

singleTransform :: Int -> Int -> Int
singleTransform v subj = (v*subj) `mod` 20201227

loopSize :: Int -> Int -> Int 
loopSize key subj = inner 0 1 key subj
    where
        inner :: Int -> Int -> Int -> Int -> Int
        inner i val key subj 
            | val == key = i
            | otherwise = val `deepseq` inner (i+1) (singleTransform val subj) key subj 
