const puzzleInput = document.getElementById('puzzleinput')
const solveBtn = document.getElementById('solvepuzzle')
const solution = document.getElementById('solutionoutput')
const visual = document.getElementById('visual')

/** @param {Node} elem */
const emptyNode = (elem) => {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

const findExplode = (arr, depth=0) => {
    // Anything can explode if it is four levels deep
    for (let x in arr) {
        const data = arr[x]
        if (Array.isArray(data)) {
            if (depth < 3) {
                const [isExplode, address] = findExplode(data, depth+1)
                if (isExplode) {
                    return [true, x+address]
                }
            } else {
                return [true, x]
            }
        }
    }
    return [false, '']
}

const getValue = (arr, address) => {
    let node = arr
    for (let c of address) {
        node = node[c]
    }
    return node
}

const setValue = (arr, address, value) => {
    let node = arr
    const lastAddress = address[address.length-1]
    for (let i = 0; i < address.length-1; i++) {
        node = node[address[i]]
    }
    node[lastAddress] = value
}

const clone = (arr) => {
    if (Array.isArray(arr)) {
        return arr.map(clone)
    } else {
        return arr
    }
}

const stringArr = (arr) => {
    if (Array.isArray(arr)) {
        const [l, r] = arr
        return `[${stringArr(l)},${stringArr(r)}]`
    } else {
        return arr
    }
}

const resolveExplode = (arr, address) => {
    const na = clone(arr)

    const magic = (v, acc) => {
        if (Array.isArray(v)) {
            const [left, right] = v
            return [magic(left, acc+'0'), magic(right, acc+'1')]
        } else {
            // v is value
            return acc
        }
    }

    const addressIndex = magic(na, '').flat(5)

    const sumAt = (sourceAddr, targetAddr) => {
        const changeBy = getValue(na, sourceAddr)
        const initial = getValue(na, targetAddr)
        setValue(na, targetAddr, initial + changeBy )
    }

    // Add to left number...
    const leftAddress = address + '0'
    const leftIndex = addressIndex.findIndex(v => v===leftAddress)
    if (leftIndex > 0) {
        const changeAddr = addressIndex[leftIndex-1]
        sumAt(leftAddress, changeAddr)
    }

    // Add to right number...
    const rightAddress = address + '1'
    const rightIndex = addressIndex.findIndex(v => v===rightAddress)
    if (rightIndex+1 < addressIndex.length) {
        const changeAddr = addressIndex[rightIndex+1]
        sumAt(rightAddress, changeAddr)
    }

    // Replace node
    setValue(na, address, 0)
    return na
}

const findSplit = (arr) => {
    for (let x in arr) {
        const node = arr[x]
        if (Array.isArray(node)) {
            const [highValue, addr] = findSplit(node)
            if (highValue) {
                return [true, x + addr]
            }
        } else {
            if (node > 9) {
                return [true, x]
            }
        }
    }
    return [false, '']
}

const splitAt = (arr, address) => {
    const na = clone(arr)

    const value = getValue(na, address)
    const leftValue = Math.floor(value/2)
    const rightValue = Math.ceil(value/2)
    setValue(na, address, [leftValue, rightValue])

    return na
}

const fullReduce = (arr) => {
    let [canExplode, eAddr] = findExplode(arr)
    let [canSplit, sAddr] = findSplit(arr)

    let na = arr

    while (canExplode || canSplit) {
        if (canExplode) {
            na = resolveExplode(na, eAddr)
        } else if (canSplit) {
            na = splitAt(na, sAddr)
        }

        const [canExplodeNew, eAddrNew] = findExplode(na)
        const [canSplitNew, sAddrNew] = findSplit(na)
        canExplode = canExplodeNew
        eAddr = eAddrNew
        canSplit = canSplitNew
        sAddr = sAddrNew
    }
    return na
}

const magnitude = (arr) => {
    if (Array.isArray(arr)) {
        const [l, r] = arr
        return (3*magnitude(l)) + (2*magnitude(r))
    } else {
        return arr
    }
}


solveBtn.onclick = () => {
    const arrayStrings = puzzleInput.value.trim().split('\n')

    // Extremely cheaty way of reading the input
    const numberArrs = arrayStrings.map(s => Function(`"use strict";return ${s}`)())

    const finalList = numberArrs.reduce((acc, cur) => {
        let nv = [acc, cur]
        return fullReduce(nv)
    })

    solution.innerText = `Final Magnitude: ${magnitude(finalList)}`

    // Part 2

    let maxValue = 0
    for (let i = 0; i < numberArrs.length; i++) {
        const outerArr = numberArrs[i]
        for (let j = i+1; j<numberArrs.length; j++) {
            const innerArr = numberArrs[j]
            const sum1 = magnitude(fullReduce([outerArr, innerArr]))
            const sum2 = magnitude(fullReduce([innerArr, outerArr]))
            maxValue = Math.max(maxValue, sum1, sum2)
        }
    }

    solution.innerText += `\nMaxiumum Tuple Magnitude: ${maxValue}`
}