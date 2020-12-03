main = do
    instring <- readFile "in.txt"
    let myData = lines instring
    let dataCheck = \x -> map (`check` x) myData
    print (count True $ dataCheck part1)
    print (count True $ dataCheck part2)
    
type Rule = (Int, Int, Char)

rule :: String -> Rule
rule xs = (myMin, myMax, myChar)
    where
        myMin = read (takeWhile (/='-') xs)::Int
        myMax = read (takeWhile (/=' ') (tail (dropWhile (/='-') xs)))::Int
        myChar = (dropWhile (/=' ') xs !! 1)::Char

code :: [Char] -> [Char] 
code = tail . dropWhile (/=':')

part1 :: Rule -> String -> Bool
part1 (myMin, myMax, c) code = myCount <= myMax && myCount >= myMin
    where
        myCount = count c code

part2 :: Rule -> String -> Bool 
part2 (posOne, posTwo, c) code = 
    (posOneRight || posTwoRight) &&
    not (posOneRight && posTwoRight)
    where
        posOneRight = code !! posOne == c
        posTwoRight = code !! posTwo == c

-- Borrowed from https://stackoverflow.com/questions/19554984/haskell-count-occurrences-function/29307068
count :: Eq a => a -> [a] -> Int
count c = length . filter (==c)

check :: String -> (Rule -> String -> Bool) -> Bool
check x apply = apply myRule myCode
    where 
        myRule = rule x
        myCode = code x
