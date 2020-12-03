main = do
    instring <- readFile "in.txt"
    let intList = map (\x -> read x :: Int) (lines instring)
    -- Part 1
    let perms = mappings (length intList) intList
    let valid = filter (\(a,b) -> a+b==2020) perms
    print (uncurry (*) $ head valid)
    -- Part 2
    let tripPerms = tripleMappings intList
    let validTrips = filter (\(a,b,c) -> a+b+c == 2020) tripPerms
    print ((\(a,b,c) -> a*b*c) $ head validTrips)

mappings :: Int -> [Int] -> [(Int, Int)]
mappings n xs = filter (uncurry (/=)) [(xs !! a, xs !! b) | a <- [0..n-1], b <- [0..n-1]]

tripleMappings :: [Int] -> [(Int, Int, Int)]
tripleMappings xs = filter (\(a, b, c) -> a/=b && b/=c) 
    [(xs !! a, xs !! b, xs !! c) | a <- values, b <- values, c <- values]
        where values = [0..length xs -1]

