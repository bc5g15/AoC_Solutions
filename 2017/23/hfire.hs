import qualified Data.Map.Strict as M
import System.IO
import Text.Read
import Debug.Trace
--import qualified Data.ByteString.Lazy as B
--import qualified Data.ByteString.Lazy.Word8 as W

--type Instr = [String]
data Inst = I2 { code :: Code,
                    op1 :: Op,
                    op2 :: Op} deriving (Show)

data Op = R Char | V Int deriving (Show)

data Code = Set | Sub | Mul | Jnz deriving (Show)

opcode = M.fromList [("set", Set), ("sub", Sub), ("mul", Mul), ("jnz", Jnz)]

type PC = Int
type Regs = M.Map Char Int
type State = (Regs, PC)

getVal :: Op -> Regs -> Int
getVal (V i) _ = i
getVal (R c) rgs = M.findWithDefault 0 c rgs

handle :: Inst -> State -> State
--handle (I2 Jnz o1 o2) (rs, pc) | trace ("Attempting Jump") False = undefined
handle (I2 Jnz o1 o2) (rs, pc) 
  | x /= 0 = (rs, pc + y)
  | otherwise = (rs, pc + 1)
   where 
    x = getVal o1 rs
    y = getVal o2 rs
  
handle (I2 co ch o2) (rs, pc)= ((inner co ch o2 rs), pc+1)
 where
  inner :: Code -> Op -> Op -> Regs -> Regs
  inner Set (R c) o2 rs = M.insert c y rs
  inner Sub (R c) o2 rs = M.insert c (x-y) rs
  inner Mul (R c) o2 rs = M.insert c (x*y) rs
  x = getVal ch rs
  y = getVal o2 rs

ireader :: [String] -> [Inst]
ireader [] = []
ireader (l:ls) = (iconv $ words l) : (ireader ls)

iconv :: [String] -> Inst
iconv (a:b:c:_) = inner (M.lookup a opcode) b c 
  where
   inner :: Maybe Code -> String -> String -> Inst
   inner Nothing _ _ = error "Bad Opcode"
   inner (Just a) b cs = (I2 a (checkVal b (readMaybe b :: Maybe Int)) (checkVal cs (readMaybe cs :: Maybe Int)))
    where
     checkVal :: String -> Maybe Int-> Op
     checkVal _ (Just a) = V a
     checkVal (a:as) Nothing = R a

trackMult :: [Inst] -> Int
trackMult is = inner is (M.empty, 0) 0
 where
  tryAdd :: Int -> Inst -> Int
  tryAdd acc (I2 Mul _ _ ) = acc + 1
  tryAdd acc _ = acc
  inner :: [Inst] -> State -> Int -> Int
  inner is st@(rs, pc) acc | trace ("Mults: " ++ show acc ++ " PC: " ++ show pc ) False = undefined
  inner is st@(rs, pc) acc
   | pc >= (length is) || pc < 0 = acc
   | otherwise = inner is (handle (is !! pc) st) (tryAdd acc (is!!pc))

findH :: [Inst] -> Maybe Int
findH is = inner is (M.singleton 'a' 1, 0)
 where
  inner :: [Inst] -> State -> Maybe Int
  inner is st@(rs, pc)
   | pc >= (length is) || pc < 0 = M.lookup 'h' rs
   | otherwise = inner is (handle (is !! pc) st)


main = do
    ha <- openFile "in.txt" ReadMode
    contents <- hGetContents ha
    let lns = lines contents
    print (lns !! 0)
    --print (contents !! 0)
    let i = (map (iconv.words) (lns))
    print i
    --print (handle i (M.empty, 0))
    --print (trackMult i)
    print (findH i)
    hClose ha
    return 0

-- part 1 - 6724 - Correct! After a lot of debugging
