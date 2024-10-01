const restApiv2 = (function () {
    type callback = (e: object) => any
    const root = "API root url"

    async function _doGet(url: string, needData: boolean, cb?: callback, abortSignal?: AbortController) {
        try {
            const response = await fetch(url, {
                method: "GET",
                signal: abortSignal?.signal
            })

            if (!response.ok) {
                throw new Error(`HTTP ERROR: ${response.status}`)
            }
            try {
                const json: object = await response.json() as Object
                const data = needData ? json : response
                if (cb) { return cb(data) }
                return data
            } catch {
                throw new Error("Failed to parse response as JSON")
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
            throw error
        }
    }

    async function _doPost(url: string, body: object, needData: boolean, cb?: callback, abortSignal?: AbortController) {

        try {
            const request = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                signal: abortSignal?.signal
            })

            if (!request.ok) {
                throw new Error(`HTTP ERROR: ${request.status}`)
            }
            try {
                const json: object = await request.json() as Object
                const data = needData ? json : request
                if (cb) { return cb(data) }
                return data
            } catch {
                throw new Error("Failed to parse resposne as JSON")
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
            throw error
        }
    }

    async function _doPut(url: string, body: object, needData: boolean, cb?: callback, abortSignal?: AbortController) {
        try {
            const request = await fetch(url, {
                method: "PUT",
                body: JSON.stringify(body),
                signal: abortSignal?.signal
            })

            if (!request.ok) {
                throw new Error(`HTTP ERROR: ${request.status}`)
            }
            try {
                const json: object = await request.json() as Object
                const data = needData ? json : request
                if (cb) { return cb(data) }
                return data
            } catch {
                throw new Error("Failed to parse resposne as JSON")
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
            throw error
        }
    }

    async function _doDelete(url: string, abortSignal?: AbortController) {
        try {
            const request = await fetch(url, {
                method: "DELETE",
                signal: abortSignal?.signal
            })
            if (!request.ok) {
                throw new Error(`HTTP ERROR: ${request.status}`)
            }
            return request
        } catch (error) {
            console.error("Error fetching data: ", error)
            throw error
        }
    }

    function _singularGet(path: string, needData: boolean) {
        return function (id: number, cb?: callback, abortSignal?: AbortController) {
            return _doGet(root + path + "/" + id, needData, cb, abortSignal)
        }
    }

    function _pluralGet(path: string, needData: boolean) {
        return function (query?: [string] | string, cb?: callback, abortSignal?: AbortController) {
            let joinedQuery
            if (typeof query == "string") {
                joinedQuery = "?" + query
            } else {
                joinedQuery = query ? "?" + query.join("&") : ""
            }
            const noQueryUrl = root + path
            const finalUrl = noQueryUrl + joinedQuery
            return _doGet(finalUrl, needData, cb, abortSignal)
        }
    }

    function _createItem(path: string, needData: boolean) {
        return function (body: object, cb?: callback, abortSignal?: AbortController) {
            return _doPost(root + path, body, needData, cb, abortSignal)
        }
    }

    function _updateItem(path: string, needData: boolean) {
        return function (id: number, body: object, cb?: callback, abortSignal?: AbortController) {
            return _doPut(root + path + "/" + id, body, needData, cb, abortSignal)
        }
    }

    function _deleteItem(path: string) {
        return function (id: number, abortSignal?: AbortController) {
            return _doDelete(root + path + "/" + id, abortSignal)
        }
    }



    return {

        // This methods return the json file of the request
        getPerson: _singularGet("people", true),
        getPeople: _pluralGet("people", true),
        createPerson: _createItem("people", true),
        updatePerson: _updateItem("people", true),

        // This methods return the promise of the request
        requestPerson: _singularGet("people", false),
        requestPeople: _pluralGet("people", false),
        requestCreatePerson: _createItem("people", false),
        requestUpdatePerson: _updateItem("people", false),
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
