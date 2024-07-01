const restApi = (function () {

    const root = "myurlhere/"

    async function doPOST(url, body, callback) {
        const request = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body)
        })
        const data = await request.json()
        if (typeof callback === "function") { return callback(data) }
        return data
    }

    async function doGET(url, callback) {
        const response = await fetch(url)
        const data = await response.json()
        if (typeof callback === "function") { return callback(data) }
        return data
    }

    async function doPUT(url, body) {
        const request = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(body)
        })
        return request.status
    }

    async function doDELETE(url) {
        const request = await fetch(url, {
            method: "DELETE"
        })
        return request.status
    }

    function getSingularItem(path) {
        return function (id, callback) {
            return doGET(root + path + "/" + id + "/", callback)
        }
    }

    function getMultipleItems(path) {
        return function () {
            let query;
            let callback;

            if (arguments.length > 1) {
                query = arguments[0]
                callback = arguments[1]
            } else if (arguments[0]) {
                if (typeof arguments[0] === "function") {
                    query = null
                    callback = arguments[0]
                } else {
                    query = arguments[0]
                    callback = null
                }
            }

            if (query) {
                let queryParams = new URLSearchParams
                for (let key of Object.key(query)) {
                    queryParams.append(key, query[key])
                }
                return doGET(root + path + "/?" + queryParams.toString(), callback)
            }
            return doGET(root + path + "/", callback)
        }

    }

    function createItem(path) {
        return function (body, callback) {
            return doPOST(root + path + "/", body, callback)
        }
    }

    function updateItem(path) {
        return function (id, body) {
            return doPUT(root + path + "/" + id + "/", body)
        }
    }

    function deleteItem(path) {
        return function (id) {
            return doDELETE(root + path + "/" + id + "/")
        }
    }


    return {
        getSingleItem: getSingularItem("pathHere"),
        getMultiple: getMultipleItems("pathHere"),
        createItem: createItem("pathHere"),
        updateItem: updateItem("pathHere"),
        deleteItem: deleteItem("pathHere"),

        // Examples:
        getPerson: getSingularItem("people"),
        getPeople: getMultipleItems("people"),
        createPerson: createItem("people"),
        updatePerson: updateItem("people"),
        deletePerson: deleteItem("people")
    }

})()


/** Usage examples

restApi.getPerson(1)   // Will send response from api/people/1
restApi.getPeople()  // Will send response from api/people/
restApi.getPeople([{[name="name"]}]) // Will send response from api/people/ with the query of name="name"
restApi.createPerson(object) // Will send request to api/people/ to create {object} contents
restApi.updatePerson(3, object) // Will send request to api/people/3 to modify it with {object} contents
restApi.deletePerson(2) // Will send request to delete api/people/2

 */