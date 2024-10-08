function quickSort(arr: number[]): number[] {
    if (arr.length === 0) {
        return []
    }
    const pivotIndex = Math.floor(Math.random() * arr.length);
    const pivot = arr[pivotIndex]
    const pivotArr: number[] = [pivot]
    const left: number[] = []
    const right: number[] = []
    arr.forEach(e=>{
        if(e<pivot){
            left.push(e)
        }else if(e>pivot){
            right.push(e)
        }else{
            pivotArr.push(e)
        }
    })



    return [...quickSort(left), ...pivotArr, ...quickSort(right)]
}

/* const arr = [
    67, 54, 89, 34, 92, 43, 29, 7, 88, 72, 
    95, 19, 33, 24, 11, 78, 61, 41, 39, 83, 
    76, 26, 9, 18, 2, 74, 91, 45, 36, 64, 
    12, 84, 62, 75, 70, 57, 10, 8, 53, 3, 
    47, 44, 69, 49, 60, 80, 25, 38, 35, 30, 
    40, 6, 71, 90, 32, 13, 5, 1, 15, 22, 
    81, 4, 20, 14, 16, 77, 23, 68, 27, 58, 
    65, 82, 17, 48, 86, 46, 85, 93, 37, 59, 
    14, 99, 100, 94, 8, 66, 52, 97, 98, 42
]
console.log(quickSort(arr)) */