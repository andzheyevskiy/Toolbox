export default class Ajax {
    constructor(root, options) {
        this.root = root
        this.defaults = {
            headers: options.headers,
            cache: options.cache,
            mode: options.crossDomain,
            body: options.body
        }
        this.options = {
            returnPromise: options.returnPromise || true
        }
    }

    #fetch(opt) {
        const { url, ...options } = opt
        const response = fetch(url, options)
        if (this.options.returnPromise) return response
    }

    #do_get(opt) {
        const { body, ...options } = { ...this.defaults, ...opt, method: "GET" }
        return this.#fetch(options)
    }
    #do_post(opt) {
        const options = { ...this.defaults, ...opt, method: "POST" }
        return this.#fetch(options)
    }
    #do_put(opt) {
        const options = { ...this.defaults, ...opt, method: "PUT" }
        return this.#fetch(options)
    }
    #do_delete(opt) {
        const options = { ...this.defaults, ...opt, method: "DELETE" }
        return this.#fetch(options)
    }

    singularGet(route, opt) {
        const options = { ...opt, url: this.root + route }
        return this.#do_get(options)
    }

    pluralGet(route, opt) {
        const { queries, ...options } = opt
        let parsedQuery = ""
        if (opt.queries) {
            if (typeof queries === "string") {
                parsedQuery = queries
            } else if (Array.isArray(queries)) {
                parsedQuery = queries.join("&")
            } else if (typeof queries === "object") {
                let queryArr = []
                Object.entries(queries).forEach(([key, value]) => {
                    queryArr.push(`${key}=${value}`)
                })
                parsedQuery = queryArr.join("&")
            }
        }
        const url = this.root + route + (parsedQuery ? `?${parsedQuery}` : "")
        const cleanOptions = { ...options, url }
        return this.#do_get(cleanOptions)
    }

    post(route, opt) {
        const options = { ...opt, url: this.root + route }
        return this.#do_post(options)
    }
    put(route, opt) {
        const options = { ...opt, url: this.root + route }
        return this.#do_put(options)
    }
    delete(route, opt) {
        const options = { ...opt, url: this.root + route }
        return this.#do_delete(options)
    }

}