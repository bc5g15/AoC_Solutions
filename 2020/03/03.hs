main = do
    instring <- readFile "in.txt"
    let linemap = lines instring
    let width = length $ head linemap
    let height = length linemap
    let points = locations (height, width) 3 1
    let pathTypes = [(1,1), (3,1), (5,1), (7,1), (1,2)]
    let allPoints = map (uncurry (locations (height, width))) pathTypes
    -- Part 1
    print $ count True (treeCheck linemap points)
    -- Part 2
    let collisions = product [count True (treeCheck linemap a)| a <- allPoints]
    print collisions

type Stage = [[Char]]

locations :: (Int, Int) -> Int -> Int -> [(Int, Int)]
locations (h, w) x y = filter (\(_, q) -> q<h)
    [((a !! n) `mod` w, b !! n) | n<-[0..(div h y)]]
    where
        a = [0, x..]
        b = [0, y..]

treeCheck :: Stage -> [(Int, Int)] -> [Bool]
treeCheck _ [] = []
treeCheck stage ((x, y):xs) = (stage !! y !! x == '#') : 
    treeCheck stage xs

count :: Eq a => a -> [a] -> Int
count c = length . filter (==c)
