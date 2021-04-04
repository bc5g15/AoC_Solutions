def floorchecker(value):
    result = 0
    inputcount = 1
    countreturn = 1
    for digit in value:
        if(digit == '('):
            result += 1
        elif(digit == ')'):
            result -= 1

        if(result == -1):
            print inputcount

        inputcount += 1
    return result, countreturn

