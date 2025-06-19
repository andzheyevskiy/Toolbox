function toObjFromString(input) {
    if (typeof input !== "string") throw new Error(`TypeError: on toObjFromString() - the argument "input" has to be a String. Provided input ${input} has the type: ${typeof input}`)
    const obj = input.split(",").reduce((acc, part) => {
        const [key, value] = part.split(":").map(e => e.trim())
        acc[key] = isNaN(value) ? value : Number(value);
        return acc
    }, {})
    return obj
}

// Usage
const input = "Name: Alice, Age: 30";
const myObject = toObjFromString(input)
console.log(myObject)