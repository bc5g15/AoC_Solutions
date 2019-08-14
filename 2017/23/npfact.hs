nPrime :: Int -> Int
nPrime n = slowin 2 n
 where
  slowin d n 
   | d > (quot n 2) = 0
   | (n `mod` d) == 0 = 1
   | otherwise = slowin (d+1) n
 
lst = [108400, 108417..125400]

main = do
    print (sum $ (map nPrime lst))
