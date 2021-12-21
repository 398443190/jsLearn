// 类跟函数类似，定义类一般也是两种形式，类声明及类表达式,不同的是函数声明可以提升，但是类不行
// 函数格式
// function Point(x, y) {
//     this.x = x;
//     this.y = y;
//   }

//   Point.prototype.toString = function () {
//     return '(' + this.x + ', ' + this.y + ')';
//   };

//   let p = new Point(1, 2);

// 类格式
// class Point {
//     constructor(x, y) {
//         this.x = x
//         this.y = y
//     }
//     toString() {
//         return '(' + this.x + ', ' + this.y + ')'
//     }
// }



class Logger {
    constructor() {
        this.printName = this.printName.bind(this)
    }
    printName(name = 'there') {
        this.print(`Hello ${name}`);
        console.log('我执行了')
    }

    print(text) {
        console.log(text);
    }

    static sayName() {
        console.log('sayName')
    }
}


const logger = new Logger()
logger.sayName()