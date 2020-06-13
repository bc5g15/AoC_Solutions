type Code = [Int]

main = do
    let code = [1,9,3,6,5,1]
    let low = 193651
    let high = 649729
    print $ counter low high

counter :: Int -> Int -> Int
counter l h = length $ filter (valid . readAsCode) [l..h]

valid :: Code -> Bool
valid x  = (hasStrictDouble x) && (sixDigit x) && (digitsIncrease x)

hasDouble :: Code -> Bool
hasDouble [] = False
hasDouble (_:[]) = False
hasDouble (a:b:xs)
    | a==b = True
    | otherwise = hasDouble (b:xs)

hasStrictDouble :: Code -> Bool
hasStrictDouble [] = False
hasStrictDouble (_:[]) = False
hasStrictDouble (a:b:[])
    | a == b = True
    | otherwise = False
hasStrictDouble (a:b:c:xs) 
    | a == b && b /= c = True
    | a == b && b == c = hasStrictDouble (eatDupes xs a)
    | otherwise = hasStrictDouble (b:c:xs)
    where 
        eatDupes :: Code -> Int -> Code 
        eatDupes [] _ = []
        eatDupes (x:xs) a
            | x==a = eatDupes xs a
            | otherwise = (x:xs)

sixDigit :: Code -> Bool
sixDigit xs 
    | length xs == 6 = True
    | otherwise = False

digitsIncrease :: Code -> Bool
digitsIncrease [] = True
digitsIncrease (_:[]) = True
digitsIncrease (a:b:xs) 
    | a <= b = digitsIncrease (b:xs)
    | otherwise = False

readAsCode :: Int -> Code
readAsCode x 
    | x < 10 = [x]
    | otherwise = (readAsCode (x `quot` 10)) ++ [(x `mod` 10)]