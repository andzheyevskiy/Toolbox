/**
 * Parses the form data, including inputs, selects, and textareas, and formats it into a specified output format.
 * Supports deep parsing, custom input handling, case formatting, sanitization, validation, and more.
 * 
 * @param {HTMLFormElement} formElement - The form element to be parsed.
 * @param {Object} options - Options to customize the parsing behavior.
 * @param {string[]} [options.include=["text", "password", "email", "number", "radio", "checkbox", "date", "file", "range"]] - List of input types to include in the parsing.
 * @param {string[]} [options.exclude=["image"]] - List of input types to exclude from the parsing.
 * @param {string[]} [options.includeCustomInputs=[]] - List of custom input element selectors to include.
 * @param {Function} [options.customInputHandling] - Function that handles custom input elements, returns an object with `name` and `value` properties.
 * @param {string} [options.caseFormat="camelCase"] - Specifies the case format for input names. Can be either "camelCase" or "snake_case".
 * @param {boolean} [options.uncheckedCheckboxes=false] - Whether to include unchecked checkboxes. If `false`, unchecked checkboxes are ignored.
 * @param {Function} [options.filter] - A function to filter the inputs before adding them to the final body. Receives an element and returns a boolean.
 * @param {Object} [options.defaultValues={}] - Default values to be included in the final parsed object.
 * @param {boolean} [options.deepParsing=true] - Whether to perform deep parsing to include nested elements.
 * @param {Function} [options.validate] - A function to validate the inputs. Receives `name` and `value` and returns `true` if valid, otherwise `false`.
 * @param {Function} [options.sanitize] - Function to sanitize the value before adding it to the body.
 * @param {boolean} [options.includeEmpty=true] - Whether to include fields with empty values in the result.
 * @param {string} [options.outputFormat="json"] - The format in which the data should be returned. Can be "json", "queryString", or "object".
 * 
 * @returns {string|Object} The parsed data in the specified `outputFormat`.
 * - If `outputFormat` is "json", returns a JSON string.
 * - If `outputFormat` is "queryString", returns a query string.
 * - If `outputFormat` is "object", returns the data as an object.
 * 
 * @throws {Error} If the `formElement` is not an instance of `HTMLFormElement`, or if the `options` parameter is invalid.
 * @throws {Error} If any validation errors are encountered during form parsing.
 * @throws {Error} If the `customInputHandling` function doesn't return an object with `name` and `value` properties.
 * @throws {Error} If invalid options are provided.
 */
function formParser(formElement, options) {
    if (!(formElement instanceof HTMLFormElement)) { throw new Error("TypeError on formParser(): formElement must be HTMLFormElement.") }
    if (typeof options !== "object" || Array.isArray(options)) { throw new Error("TypeError on formParser(): options must be an Object.") }
    const defaultOptions = {
        include: ["text", "password", "email", "number", "radio", "checkbox", "date", "file", "range"],
        exclude: ["image"],
        includeCustomInputs: [],
        customInputHandling: undefined,
        caseFormat: "camelCase", // camelCase or snake_case
        uncheckedCheckboxes: false, // true to include, false to exclude unchecked checkboxes
        filter: undefined,
        defaultValues: {},
        deepParsing: true,  // Allow deep parsing of nested fields
        validate: undefined,
        sanitize: (value) => value.replace(/<\/?[^>]+(>|$)/g, ""),  // Sanitize inputs
        includeEmpty: true,  // If true, include fields with empty values
        outputFormat: "json", // "json", "queryString", or "object"
    }

    options = { ...defaultOptions, ...options }
    if (!Array.isArray(options.include) || (Array.isArray(options.include) && options.include.some(e => typeof e !== "string"))) { throw new Error("TypeError on formParser(): options.include must be String[].") }
    if (!Array.isArray(options.exclude) || (Array.isArray(options.exclude) && options.exclude.some(e => typeof e !== "string"))) {
        throw new Error("TypeError on formParser(): options.exclude must be String[].")
    } else {
        options.exclude.some(excluded => {
            const isError = options.include.includes(excluded)
            if (isError) throw new Error(`LogicError on formParser(): Cannot include and exclude the same element: ${excluded}.`)
        })
    }
    if (typeof options.customInputHandling != "undefined" && typeof options.customInputHandling !== "function") { throw new Error("TypeError on formParser(): options.customInputHandling must be a function or undefined.") }
    if (!Array.isArray(options.includeCustomInputs) || options.includeCustomInputs.some(e => typeof e !== "string")) { throw new Error("TypeError on formParser(): options.includeCustomInputs must be String[].") }
    if (typeof options.caseFormat !== "string") { throw new Error("TypeError on formParser(): options.caseFormat must be a String.") }
    if (typeof options.uncheckedCheckboxes !== "boolean") { throw new Error("TypeError on formParser(): options.uncheckedCheckboxes must be a boolean.") }
    if (typeof options.filter != "undefined" && typeof options.filter !== "function") { throw new Error("TypeError on formParser(): options.filter must be a function or undefined.") }
    if (typeof options.defaultValues !== "object" || Array.isArray(options.defaultValues)) { throw new Error("TypeError on formParser(): options.defaultValues must be an Object.") }
    if (typeof options.deepParsing !== "boolean") { throw new Error("TypeError on formParser(): options.deepParsing must be a boolean.") }
    if (typeof options.validate != "undefined" && typeof options.validate !== "function") { throw new Error("TypeError on formParser(): options.validate must be a function or undefined.") }
    if (typeof options.sanitize !== "undefined" && typeof options.sanitize !== "function") { throw new Error("TypeError on formParser(): options.sanitize must be a function or undefined.") }
    if (typeof options.includeEmpty !== "boolean") { throw new Error("TypeError on formParser(): options.includeEmpty must be a boolean.") }
    if (typeof options.outputFormat !== "string") { throw new Error("TypeError on formParser(): options.outputFormat must be a string.") }

    function _setValueFormat(input, caseType) {
        if (caseType === "camelCase") {
            return input.replace(/(_\w)/g, match => match[1].toUpperCase())
        } else if (caseType === "snake_case") {
            return input.replace(/([A-Z])/g, match => `_${match.toLowerCase()}`)
        } else {
            throw new Error("ValidationError on formParser(): options.caseFormat must be 'camelCase' or 'snake_case'.")
        }
    }

    function _formatData(input, formatType) {
        if (input === null || typeof input !== "object" || Array.isArray(input)) { throw new Error("InternalError on formParser(): failed to format output data.") }
        let result
        switch (formatType) {
            case "json": result = JSON.stringify(input); break
            case "queryString": {
                result = Object.keys(input)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(input[key])}`)
                    .join("&")
                break
            }
            case "object": result = input; break
            default: throw new Error("ValidationError on formParser(): options.outputFormat must be 'json', 'queryString', or 'object'.")

        }
        return result
    }

    function _setNestedValue(obj, path, value) {
        const keys = path.replace(/\[|\]/g, '.').split('.');
        let current = obj
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value
            } else {
                current[key] = current[key] || {}
                current = current[key]
            }
        })
    }

    const baseInputs = ["input", "select", "textarea"]
    const finalInputs = [...baseInputs, ...options.includeCustomInputs]
    const allElements = options.deepParsing
        ? formElement.querySelectorAll(finalInputs.join(","))
        : formElement.querySelectorAll(finalInputs.map(e => `>${e}`).join(","))

    const filteredElements = [...allElements].filter(e => {
        const include = options.include ? options.include.includes(e.type) : true
        const exclude = options.exclude ? options.exclude.includes(e.type) : false
        const passesFilter = options.filter ? options.filter(e) : true
        return include && !exclude && passesFilter
    })

    const body = { ...options.defaultValues }
    const errors = []

    filteredElements.forEach(e => {
        const validInput = e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement
        const passesValidation = options.validate ? options.validate(e.name, e.value) : true
        if (!passesValidation) {
            errors.push({ name: e.name, value: e.value })
        } else if (validInput) {
            const name = options.caseFormat ? _setValueFormat(e.name, options.caseFormat) : e.name
            const value = options.sanitize ? options.sanitize(e.value) : e.value

            switch (e.type) {
                case "checkbox": {
                    if (options.uncheckedCheckboxes || e.checked) {
                        _setNestedValue(body, name, e.checked)
                    }
                    break
                }
                case "radio": {
                    if (e.checked) {
                        _setNestedValue(body, name, e.value)
                    }
                    break
                }
                case "file": _setNestedValue(body, name, e.files); break
                default: _setNestedValue(body, name, value)
            }

        } else if (options.customInputHandling) {
            const handledInput = options.customInputHandling(e)
            const name = options.caseFormat ? _setValueFormat(handledInput.name, options.caseFormat) : handledInput.name
            let value = options.sanitize ? options.sanitize(handledInput.value) : handledInput.value
            if (!handledInput || !name || !value) { throw new Error("TypeError on formParser(): options.customInputHandling must return and Object with {name, value} properties.") }
            _setNestedValue(body, name, value)
        }
    })

    if (errors.length > 0) { throw new Error(`ValidationError on formParser(): the folowing inputs failed to validate: ${errors.map(e => `${e.name}: ${e.value}`).join(", ")}`) }
    return _formatData(body)
}