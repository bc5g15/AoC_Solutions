type Code = [Int]

main = do
    let code = [1,9,3,6,5,1]
    let low = 193651
    let high = 649729
    print $ counter low high

counter :: Int -> Int -> Int
counter l h = length $ filter (valid . readAsCode) [l..h]

valid :: Code -> Bool
valid x  = (hasDouble x) && (sixDigit x) && (digitsIncrease x)

hasDouble :: Code -> Bool
hasDouble [] = False
hasDouble (_:[]) = False
hasDouble (a:b:xs)
    | a==b = True
    | otherwise = hasDouble (b:xs)

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

-- incrementCode :: Code -> Code
-- incrementCode [] = []
-- incrementCode xs = reverse (addOne (reverse xs))
--     where
--         addOne :: Code -> Code
--         addOne [] = []
--         addOne (x:xs) 
--             | x < 9 = ((x+1):xs)
--             | otherwise = ((0):(addOne xs))