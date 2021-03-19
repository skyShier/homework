/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/
// 定义常量，是因常量是因为 可以提示 Orz 没错就是因为这么简单
const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败

class MyPromise {
  constructor (executor) {
    try {
        executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }   
  
  status = PENDING; // promise 状态
  value = undefined;
  reason = undefined;

  // 在等待过程，暂存成功和失败的回调函数
  successCallback = [];
  failCallback = [];

  resolve = value => {
    if (this.status !== PENDING) return; // 如果状态不是等待，阻止
    this.status = FULFILLED;
    // 保存成功后获取的值
    this.value = value;
    while(this.successCallback.length) {
      this.successCallback.shift()()
    }
  }
  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while(this.failCallback.length) {
      this.failCallback.shift()()
    }
  }
  
  then (successCallback, failCallback) {
    // then 参数可选
    successCallback = successCallback ? successCallback : value => value;
    failCallback = failCallback ? failCallback : reason => {throw reason};
    let promise2 = new Promise((resolve, reject) => {
      // 判断状态，并调用相应的函数
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value);
            resolvePromise (promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason);
            resolvePromise (promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.successCallback.push(successCallback);
        this.failCallback.push(failCallback);
      }
    })
    return promise2
  }

  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => {throw reason})
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback);
  }

  static all (arr) {
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      function addDate(key, value) {
        result[key] = value;
        index++;
        if(index === arr.length) {
          resolve(result);
        }
      }
      for (let i=0; i<arr.length; i++) {
        let current = arr[i]; 
        if (current instanceof MyPromise) {
          current.then(value => addDate(i, value), reason => reject(reason))
        } else {
          addDate(i, arr[i]);
        }
      }
      resolve(result)
    })
  }

  static resolve (value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value))
  }
}

function resolvePromise (promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('不可以循环使用'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}

module.export = MyPromise;