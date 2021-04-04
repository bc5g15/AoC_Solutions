#24_quantum2.py

data = [11, 10, 9, 8, 7, 5, 4, 3, 2, 1]
def get_pack_size(array):
    k = sum(array)
    return (k/3)

def match(num, size, arr, total=0, mine = []):
    if num > 1:
        result = []
        l = mine
        for x in range(len(arr)-1):
            tot = total + arr[x]
            l.append(arr[x])
            k = match(num-1, size, arr[x+1:], tot, l)
            if(k!=0):
                tempresult = k
                tempresult.append(arr[x])
                result.append(tempresult)
        if(result != []):
            if(len(result) > 1):
                return result
            else:
                return result[0]
        else:
            return 0
        
    if (num == 1):
        for item in arr:
            if(total + item == size):
                return [item]
        return 0

def test(arr, num):
    size = get_pack_size(arr)
    return match(num, size, arr)
    
    
            
        
    
