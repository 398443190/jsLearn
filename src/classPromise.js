class MyPromise {
	static pending = 'pending';
	static fulfilled = 'fulfilled';
	static rejected = 'rejected';

    static resolve(value) {
        if (value instanceof MyPromise || ((typeof value === 'object') && 'then' in value)) {
            return value
        }
        return new MyPromise((resolve) => resolve(value))
    }

    static reject(reason) {
        if (reason instanceof MyPromise || ((typeof reason === 'object') && 'then' in reason)) {
            return value
        }
        return new MyPromise((undefined,reject) => reject(reason))
    }


	constructor(executor) {
		this.status = MyPromise.pending; // 初始化状态为pending
		this.value = undefined; // 存储 this._resolve 即操作成功 返回的值
		this.reason = undefined; // 存储 this._reject 即操作失败 返回的值
		// 存储then中传入的参数
		// 至于为什么是数组呢？因为同一个Promise的then方法可以调用多次
		this.callbacks = [];
		executor(this._resolve.bind(this), this._reject.bind(this));
	}

	// onFulfilled 是成功时执行的函数
	// onRejected 是失败时执行的函数
	then(onFulfilled, onRejected) {
		// 返回一个新的Promise
		return new MyPromise((nextResolve, nextReject) => {
			// 这里之所以把下一个Promsie的resolve函数和reject函数也存在callback中
			// 是为了将onFulfilled的执行结果通过nextResolve传入到下一个Promise作为它的value值
			this._handler({
				nextResolve,
				nextReject,
				onFulfilled,
				onRejected
			});
		});
	}
    catch(onRejected) {
        return this.then(null, onRejected)
    }
    finally(onFinally) {
        return this.then(onFinally,onFinally)
    }

	_resolve(value) {
		// 处理onFulfilled执行结果是一个Promise时的情况
		// 这里可能理解起来有点困难
		// 当value instanof MyPromise时，说明当前Promise肯定不会是第一个Promise
		// 而是后续then方法返回的Promise（第二个Promise）
		// 我们要获取的是value中的value值（有点绕，value是个promise时，那么内部存有个value的变量）
		// 怎样将value的value值获取到呢，可以将传递一个函数作为value.then的onFulfilled参数
		// 那么在value的内部则会执行这个函数，我们只需要将当前Promise的value值赋值为value的value即可
		if (value instanceof MyPromise) {
			value.then(
				this._resolve.bind(this),
				this._reject.bind(this)
			);
			return;
		}

		this.value = value;
		this.status = MyPromise.fulfilled; // 将状态设置为成功

		// 通知事件执行
		this.callbacks.forEach(cb => this._handler(cb));
	}

	_reject(reason) {
		if (reason instanceof MyPromise) {
			reason.then(
				this._resolve.bind(this),
				this._reject.bind(this)
			);
			return;
		}

		this.reason = reason;
		this.status = MyPromise.rejected; // 将状态设置为失败

		this.callbacks.forEach(cb => this._handler(cb));
	}

	_handler(callback) {
		const {
			onFulfilled,
			onRejected,
			nextResolve,
			nextReject
		} = callback;

		if (this.status === MyPromise.pending) {
			this.callbacks.push(callback);
			return;
		}

		if (this.status === MyPromise.fulfilled) {
			// 传入存储的值
			// 未传入onFulfilled时，将this.value传入
			const nextValue = onFulfilled
				? onFulfilled(this.value)
				: this.value;
			nextResolve(nextValue);
			return;
		}

		if (this.status === MyPromise.rejected) {
			// 传入存储的错误信息
			// 同样的处理
			const nextReason = onRejected
				? onRejected(this.reason)
				: this.reason;
			nextReject(nextReason);
		}
	}
}


// new MyPromise((resolved, rejected) => {
//     if (2 > 10) {
//         setTimeout(() => {
//             resolved('我成功了')
//         }, 1000);
//     } else {
//         setTimeout(() => {
//             rejected('我失败了')
//         }, 1000);
//     }
// }).then((res) => {
//     console.log(res, 'res111')
// }).catch(err =>{
//     console.log(err,'err')
// }).finally(() => {
//     console.log('finally')
// })
let p = MyPromise.reject(1)
p.then(res=> {
    console.log(res, 'res')
},err=> {
    console.log(err, 'err')
})