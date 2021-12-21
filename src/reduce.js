// 所有数组方法的母方法： reduce
// reduce方法接受两个参数，
// 第一个参数是一个回调函数，其参数有四个（1:累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或第二个参数值。2:数组中正在处理的元素。3:数组中正在处理的当前元素的索引。 如果提供了initialValue，则起始索引号为0，否则从索引1起始。4:调用reduce()的数组），
// 第二个参数是作为第一次调用 callback函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。


const arr = [1, 2, 3, 4, 5, 1, 2, 3, 4]
// //求和
// let sum = arr.reduce((prev, cur) => { return prev + cur })
// console.log(sum, 'sum')

// 求每个数组中每个元素出现的次数
let countName = arr.reduce((prev, cur) => {
    if (cur in prev) {
        prev[cur]++
    } else {
        prev[cur] = 1
    }
    return prev
}, {})
console.log(countName, 'countName')
// 数组去重
let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
let myOrderedArray = myArray.reduce((accumulator, currentValue) => {
    if (accumulator.indexOf(currentValue) === -1) {
        accumulator.push(currentValue)
    }
    return accumulator
}, [])
console.log(myOrderedArray, 'myOrderedArray')
// 二维数组转一维数组
let twoArray = [[{ id: 1, value: 'qw' }], [{ id: 2, value: 'er' }], [{ id: 3, value: 'fd' }], [{ id: 4, value: 'gh' }], [{ id: 5, value: 'pp' }]]
let newArray = twoArray.reduce((prev, cur) => {
    return prev.concat(cur)
}, [])
console.log(newArray, 'newArray')


// 模拟实现includes方法
const number = [1, 2, 3, 4, 5]
let reduceInclude = number.reduce((includes, value) => {
    return includes ? includes : value === 10
}, false)
console.log(reduceInclude, 'reduceInclude')

// 模拟实现slice方法
let reduceSlice = number.reduce((slice, value, index) => {
    return index > 1 && index < 4 ? [...slice, value] : slice
}, [])
console.log(reduceSlice, 'reduceSlice')

// 模拟实现map方法
let reduceMap = number.reduce((map, value) => {
    return [...map, value * 100]
}, [])
console.log(reduceMap, 'reduceMap')

//模拟实现filter方法
let filterArr = [{ id: 1, show: true }, { id: 2, show: false }, { id: 3, show: true }, { id: 4, show: false }]
let reduceFilter = filterArr.reduce((filter, value) => {
    return value.show ? [...filter, value] : filter
}, [])
let subFilter = reduceFilter.filter(item => item.show)
console.log(reduceFilter, 'reduceFilter')
console.log(subFilter, 'subFilter')
// 对一个对象进行迭代
const customs = { Jack: 12, Jim: 18, Saily: 20 }
function Add(objectToArray) {
    return Object.values(objectToArray).reduce((prev, cur) => {
        return prev + cur
    }, 0)
}
console.log(Add(customs), 'objectToArray')

// reduce + Promise + async
function getById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Got ${id}`)
            resolve(id)
        }, 1000);
    })
}

const ids = [1, 2, 3, 4, 5]

ids.reduce(async (promise, id) => {
    await promise
    return getById(id)
}, Promise.resolve())

 //initalValue: 作为第一次调用 callback函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。
 Array.prototype.Myreduce = function (callbackfn, initialValue) {
    if (this === null || this === undefined) {
      throw new TypeError("Cannot read property 'reduce' of null or undefined");
    }
    if (Object.prototype.toString.call(callbackfn) != '[object Function]') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this)
    let len = O.length >>> 0
    let k = 0
    let accumulator = initialValue;
    // initialValue为空时，使用数组中的第一个元素。
    if (accumulator === undefined) {
    //   for (; k < len; k++) {
    //     // 查找原型链
    //     if (k in O) {
    //       accumulator = O[k]
    //       k++
    //       break
    //     }
    //   }

      while (k < len) {
        if(k in O) {
            accumulator = O[k]
            k++
            break
        }
    }

    }
    //  表示：在没有初始值的空数组上调用 reduce 将报错
    if (k == len && accumulator === undefined) {
      throw new TypeError('Each element of the array is empty')
    }
    // for (; k < len; k++) {
    //   if (k in O) {
    //     // 这是一个累计器
    //     accumulator = callbackfn.call(undefined, accumulator, O[k], k, O)
    //   }
    // }
    while (k < len) {
        if(k in O) {
            accumulator = callbackfn.call(undefined, accumulator, O[k], k, O)
        }
        k++
    }

    return accumulator
  }

const arr1 = [1, 2, 3, 4, 5, 1, 2, 3, 4]
// 求和
let sum = arr1.Myreduce((prev, cur) => { return prev + cur })
console.log(sum, 'sum')