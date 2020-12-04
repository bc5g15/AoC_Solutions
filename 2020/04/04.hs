import qualified Data.Map.Strict as Map

type Passport = Map.Map String String

main = do
    instring <- readFile "in.txt"
    let pairs = inputJoiner $ map words $ lines instring
    let passports = map passportConverter pairs
    let valid = filter validPassport passports
    -- part 1
    print . length $ valid
    -- part 2
    print . length $ filter validData valid

inputJoiner :: [[String]] -> [[String]]
inputJoiner [] = []
inputJoiner [a] = [a]
inputJoiner (a:[]:xs) = a : inputJoiner xs
inputJoiner (a:b:xs) = inputJoiner ((a++b):xs)

passportConverter :: [String] -> Passport
passportConverter xs = Map.fromList kvs
    where
        kvs = map (\x -> (takeWhile (/=':') x, tail $ dropWhile (/=':') x)) xs

validPassport :: Passport -> Bool
validPassport a = all (`Map.member` a) reqKeys
    where
        reqKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]

validData :: Passport -> Bool
validData a = all (==True) [byrValid, iyrValid, eyrValid, hgtValid, hclValid, eclValid, pidValid]
    where
        intRead s = read (a Map.! s)::Int
        byr = intRead "byr"
        iyr = intRead "iyr"
        eyr = intRead "eyr"
        byrValid = within byr 1920 2002
        iyrValid = within iyr 2010 2020
        eyrValid = within eyr 2020 2030

        hgt = a Map.! "hgt"
        hgtValid = checkHgt (read(reverse . drop 2 . reverse $ hgt)::Int) (reverse . take 2 . reverse $ hgt)
            where 
                checkHgt :: Int -> String -> Bool
                checkHgt x "cm" = within x 150 193
                checkHgt x "in" = within x 59 76
                checkHgt _ _ = False

        hcl = a Map.! "hcl"
        hexChar = ['0'..'9'] ++ ['a'..'f']
        hclValid = (head hcl == '#') && all (`elem` hexChar) (tail hcl)

        ecl = a Map.! "ecl"
        eclValid = ecl `elem` ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]

        pid = a Map.! "pid"
        pidValid = length pid == 9 && all (`elem` ['0'..'9']) pid

within :: Int -> Int -> Int -> Bool
within x _min _max = x >= _min && x <= _max