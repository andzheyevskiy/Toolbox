function promisify(fn) {
  if(typeof fn !== "function"){
    return TypeError("Provided argument is not a function")
  }
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.length === 1? data[0]: data)
        }
      })
    })
  }
}
