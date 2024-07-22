const restApi = (function () {
    type callback = (e: object) => any
    const root = "API root url"

    async function _doGet(url: string, cb?: callback) {
        const response = await fetch(url)
        const data: object = await response.json() as Object
        if (cb) { return cb(data) }
        return data
    }

    async function _doPost(url: string, body: object, cb?: callback) {
        const request = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body)
        })
        const data: object = await request.json() as Object
        if (cb) { return cb(data) }
        return data
    }

    async function _doPut(url: string, body: object, cb?: callback) {
        const request = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(body)
        })
        const data: object = await request.json() as Object
        if (cb) { return cb(data) }
        return data
    }

    async function _doDelete(url: string) {
        const request = await fetch(url, {
            method: "DELETE"
        })
        return request.status
    }

    function _singularGet(path: string) {
        return function (id: number, cb?: callback) {
            return _doGet(root + path + "/" + id, cb)
        }
    }

    function _pluralGet(path: string) {
        return function (query?: [string] | string, cb?: callback) {
            let joinedQuery
            if (typeof query == "string") {
                joinedQuery = "?" + query
            } else {
                joinedQuery = query ? "?" + query.join("&") : ""
            }
            const noQueryUrl = root + path
            const finalUrl = noQueryUrl + joinedQuery
            return _doGet(finalUrl, cb)
        }
    }

    function _createItem(path: string) {
        return function (body: object, cb?: callback) {
            return _doPost(root + path, body, cb)
        }
    }

    function _updateItem(path: string) {
        return function (id: number, body: object, cb?: callback) {
            return _doPut(root + path + "/" + id, body, cb)
        }
    }

    function _deleteItem(path: string) {
        return function (id: number) {
            return _doDelete(root + path + "/" + id)
        }
    }



    return {
        getPerson: _singularGet("people"),
        getPeople: _pluralGet("people"),
        createPerson: _createItem("people"),
        updatePerson: _updateItem("people"),
        deletePerson: _deleteItem("people")
    }
})()



/** Usage examples

restApi.getPerson(1)   // Will send response from api/people/1
restApi.getPeople()  // Will send response from api/people/
restApi.getPeople([{[name="name"]}]) // Will send response from api/people/ with the query of name="name"
restApi.createPerson(object) // Will send request to api/people/ to create {object} contents
restApi.updatePerson(3, object) // Will send request to api/people/3 to modify it with {object} contents
restApi.deletePerson(2) // Will send request to delete api/people/2

restApi.getPerson(1, e=> console.log(e))  // Example with callback

// Usefull for React :)

restApi.getPerson(1, e=> {
    return `
    <tr>${e.name}</tr>
    <tr>${e.surname}</tr>
    <tr>${e.age}</tr>
    etc...
    `
    })

 */