import Data.List.Split (splitOn)
import Data.List (foldl', intercalate, sortOn)
import qualified Data.Set as Set
import Data.Bifunctor (bimap)
main :: IO ()
main = do
    instring <- readFile "in.txt"
    let inlines = lines instring

    let allFoods = map eatLine inlines
    let allIngredients = Set.unions $ map fst allFoods
    let allAllergens = Set.elems . Set.unions $ map snd allFoods

    let allAllergenIngredients = Set.unions $ map (`checkAllergen` allFoods) allAllergens

    -- Part 1
    let safeIngredients = Set.filter (\x -> not $ Set.member x allAllergenIngredients) allIngredients

    let sf = Set.elems safeIngredients
    (print . sum) (map (length . (\ x -> filter (Set.member x . fst) allFoods)) sf)

    -- Part 2
    let dangerFoods = map (\(x, y) ->  (x Set.\\ safeIngredients, y)) allFoods  
    let allergyList =  allergens dangerFoods allAllergens
    print . intercalate "," .map snd $ sortOn fst allergyList

type Group = Set.Set String

-- Food = (Ingredients, Allergens)
type Food = (Group, Group)

eatLine :: String -> Food
eatLine xs = (ingredients, allergens)
    where
        ingredients = Set.fromList . splitOn " " . init $ takeWhile (/='(') xs
        allergens = Set.fromList . splitOn " " . drop (length "contains ") .filter (/=',') .tail . init $ dropWhile (/='(') xs 

checkAllergen :: String -> [Food] -> Group
checkAllergen a fs =  intersections . map fst $ filter (Set.member a . snd) fs

intersections :: Ord a => [Set.Set a] -> Set.Set a
intersections [] = Set.empty
intersections (x:xs) = foldl' Set.intersection x xs

-- Part 2
allergens :: [Food] -> [String] -> [(String, String)]
allergens [] _ = []
allergens fds al
    | length ings == 1 = (ag, head ings) : allergens final (tail al)
    | length ings > 1 = allergens fds (tail al ++ [ag])
    | otherwise = error "BAD"
    where 
        ag = head al
        withA = filter (Set.member ag . snd) fds
        ings = Set.elems . intersections $ map fst withA
        woA = map (bimap (Set.delete (head ings)) (Set.delete ag)) fds 
        final = filter (not . null . snd) woA
