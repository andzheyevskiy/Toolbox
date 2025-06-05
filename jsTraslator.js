class Translator {
    constructor(options) {

        const defaults = {
            includeSelectors: ["h1", "h2", "h3", "h4", "h5", "p", "span"],
            excludeSelectors: [],
            includePlaceholders: true
        }

        this.options = { ...defaults, ...options }
        this.#init()
    }

    #init() {
        const { includeSelectors, excludeSelectors, ...rest } = this.options;

        // Error managment
        if (!Array.isArray(includeSelectors)) throw new Error("TypeError: options.includeSelectors has to be an array of strings");
        if (!Array.isArray(excludeSelectors)) throw new Error("TypeError: options.excludeSelectors has to be an empty array or an array of strings");

        const errors = [];

        includeSelectors.forEach((e, i) => {
            if (typeof e !== "string") errors.push(`TypeError: options.includeSelectors has to be an array of strings. Error at index ${i}, type of ${e} is ${typeof e}`)
        });

        excludeSelectors.forEach((e, i) => {
            if (typeof e !== "string") errors.push(`TypeError: options.excludeSelectors has to be an array of strings. Error at index ${i}, type of ${e} is ${typeof e}`)
        })

        if (errors.length > 0) throw new Error(errors.join("\n"))

        const includeElements = [...document.querySelectorAll(includeSelectors.join(","))];
        const excludeElements = [...document.querySelectorAll(excludeSelectors.join(","))];

        this.elements = includeElements.filter(e => !excludeElements.includes(e));

    }

    translate(originalValue, newValue) {
        // Error managment
        if (typeof originalValue != "string") throw new Error(`TypeError on translate(): originalValue type has to be a string, provided type is ${typeof originalValue}`);
        if (typeof newValue != "string") throw new Error(`TypeError on translate(): newValue type has to be a string, provided type is ${typeof newValue}`);

        this.elements.forEach(element => {
            element.childNodes
                .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().toLowerCase() === originalValue.trim().toLowerCase())
                .forEach(node => node.textContent = newValue);

            const changePlaceholder = this.options.includePlaceholders && ["input", "textarea"].includes(element.tagName.toLowerCase())
            if (changePlaceholder && element.placeholder.trim().toLowerCase() === originalValue.trim().toLowerCase()) {
                element.placeholder = newValue;
            }

        })
    }
}

// USAGE //
// Create options for targeted and excluded elements, adionally indicate if placeholders should be translated
const options = {
    includeSelectors: ["h1", "h2", "h3", "h4", "h5", "p", "span"],
    excludeSelectors: [],
    includePlaceholders: true,
};

// Create instance for the traslator using previuos options
const translatorInstance = new Translator(options);
// for simplicity you can asing the translation method to a new variable
const translate = translatorInstance.translate
// Translate first arg is original text(case insensitive), second argument is translated text
translate("Hello", "Hola")