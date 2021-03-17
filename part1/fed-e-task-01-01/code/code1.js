/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

let p1 = new Promise(resolve => {
  setTimeout(function () {
    var a = 'hello'
    resolve(a)
  }, 10)
})
let p2 = new Promise(resolve => {
  setTimeout(function () {
    var b = 'lagou'
    resolve(b)
  }, 10)
})
let p3 = new Promise(resolve => {
  setTimeout(function () {
    var c = 'I ♥ U'
    resolve(c)
  }, 10)
})

Promise.all([p1,p2,p3]).then(res => {
  console.log(res[0] + res[1] + res[2])
})