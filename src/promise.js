const PENDING = 'pending'
const RESOlVED = 'resolved'
const REJECTED = 'rejected'
// promise有状态pending、rejected和resolved，所以应该有个变量来保存状态
// 构造函数参数excutor是个同步执行的回调函数，函数执行的参数是两个函数resolved和rejected，所以promise内部需要定义两个函数，并且在构造行数中执行excutor的地方传入
// .then中会传入回调函数onResolved和onRejected，在resolved和rejected内会分别会触发对应的回调函数，所以需要两个数组保存then中传进来的回调
// resolved和rejected只能执行一次，执行后promise的状态会改变，且参数会传递给回调函数
// onRejected和onResolved异步执行
// excutor执行抛异常会直接执行rejected，所以excutor的执行需要catch错误
function MyPromise(fn) {
    this.status = PENDING
    this.data = null

    this.onResolvedList = []
    this.onRejectedList = []

    let resolved = (value) => {
        if (this.status !== PENDING) return
        this.status = RESOlVED
        this.data = value

        if (this.onResolvedList.length > 0) {
            setTimeout(() => {
                this.onResolvedList.forEach(onResolved => onResolved(value))
            }, 0);
        }
    }

    let rejected = (reason) => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.data = reason

        if (this.onRejectedList.length > 0) {
            setTimeout(() => {
                this.onRejectedList.forEach(onRejected => onRejected(reason))
            }, 0);
        }
    }
    try {
        fn(resolved, rejected)
    } catch (e) {
        this.rejected(e)
    }

}

// then会接受两个回调函数onResolved和onRejected
// onResolved和onRejected会异步调用
// then会返回一个新的promise对象
// then的参数如果没传，那么value和reason继续向下传递
// 如果执行then的时候，promise的状态还是pending，那么只保存回调,并且确保回调执行后能修改新的promise的状态
// 如果触发的对应的回调函数执行抛异常，那么返回的新的回调函数状态为rejected，reason则会catch到的error
// 如果触发的对应回调函数执行返回值不是promise对象，那么返回新的promise状态为resolved，value则为传入then的回调的返回值
// 如果触发的对应回调返回值是promise对象，那么新的promise返回值的状态取决于改回调返回的promise
MyPromise.prototype.then = function (onResolved, onRejected) {
    if (typeof onResolved !== 'function') {
        onResolved = function (x) { return x }
    }
    if (typeof onRejected !== 'function') {
        onRejected = function (x) { return x }
    }
    return new MyPromise((resolved, rejected) => {

        let callbackExcu = (callback) => {
            try {

                let result = callback(this.data)
                if (result instanceof MyPromise) {
                    result.then(resolved, rejected)
                } else {
                    resolved(result)
                }
            }
            catch (e) {
                rejected(e)
            }
        }


        if (this.status === PENDING) {
            this.onResolvedList.push((value) => {
                callbackExcu(onResolved)
            })
            this.onRejectedList.push((reason) => {
                callbackExcu(onRejected)
            })
        } else {
            switch (this.status) {
                case RESOlVED:
                    setTimeout(() => {
                        callbackExcu(onResolved)
                    });
                    break
                case REJECTED:
                    setTimeout(() => {
                        callbackExcu(onRejected)
                    });
                    break
            }
        }
    })
}

MyPromise.prototype.catch = function (onRejected) {
    // catch与then的不同点在于传入的参数不一样，不需要传onResolve
    return this.then(null, onRejected);
}
//finally
MyPromise.prototype.finally = function (onFinally) {
    // catch与then的不同点在于传入的参数不一样，不需要传onResolve
    return this.then(onFinally, onFinally);
}

MyPromise.resolve = function (value) {
    if (value instanceof MyPromise) {
        return value
    } else if (typeof value.then === 'function') {
        return new MyPromise((resolved, rejected) => {
            try {
                value.then(resolved, rejected)
            } catch (e) {
                rejected(e)
            }
        })
    } else {
        return new MyPromise((resolved, rejected) => {
            resolved(value);
        });
    }
}
MyPromise.reject = function (reason) {
    return new MyPromise((resolved, rejected) => {
        rejected(reason);
    });
}
new MyPromise((resolved, rejected) => {
    if (2 > 1) {
        setTimeout(() => {
            resolved('我成功了')
        }, 1000);
    } else {
        setTimeout(() => {
            rejected('我失败了')
        }, 1000);
    }
}).then((res) => {
    console.log(res, 'res111')
}).catch((e) => {
    console.log(e, 'catch')
}).finally((f)=>{
    console.log(f,'finally')
})