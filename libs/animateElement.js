/*
Arguments:

    element (HTMLElement): The DOM element that you want to animate.

    animation (String): The name of the CSS animation or transition. For example, 'fadeIn', 'slideUp', or 'bounce'. // animation name

    options (Object): Optional settings to customize the animation.

Options Object:

    duration (String or Number): The duration of the animation in seconds or milliseconds. Default is '1s'.
        Example: '0.5s', 500 (in ms)

    easing (String): The easing function for the animation. Default is 'ease'.
        Example: 'ease-in', 'ease-out', 'linear'

    delay (String or Number): The delay before starting the animation in seconds or milliseconds. Default is 0s.
        Example: '0.2s', 200 (in ms)

    callback (Function): A function to be called once the animation is complete. It's triggered after the animation ends.
        Example: () => console.log('Animation done!')

    iterationCount (Number or String): The number of times the animation should repeat. Default is 1.
        Example: 3, 'infinite'

*/
function animateElement(element, animation, options) {
    if (typeof element !== "string" && !(element instanceof HTMLElement)) { throw new Error("TypeError on animateElement(): element must be String or HTMLElement.") }
    if (typeof animation !== "string") { throw new Error("TypeError on animateElement(): animation must be String.") }
    if (typeof options !== "object" || Array.isArray(options)) { throw new Error("TypeError on animateElement(): options must be an Object.") }
    const defaults = { duration: 500, easing: "ease", delay: 0, callback: undefined, iterationCount: 1 }
    options = { ...defaults, ...options }
    if (typeof options.duration !== "number" && typeof options.duration !== "string") { throw new Error("TypeError on animateElement(): options.duration must be a number or a String.") }
    if (typeof options.easing !== "string") { throw new Error("TypeError on animateElement(): options.duration must be a String.") }
    if (typeof options.delay !== "number" && typeof options.delay !== "string") { throw new Error("TypeError on animateElement(): options.delay must be a number or a String.") }
    if (typeof options.callback != "undefined" && typeof options.callback !== "function") { throw new Error("TypeError on animateElement(): options.callback must be a function or undefined.") }
    if (typeof options.iterationCount !== "number" && typeof options.iterationCount !== "string") { throw new Error("TypeError on animateElement(): options.iterationCount must be a number or a String.") }

    function _convertToMs(input) {
        if (typeof input === "number") {
            return input
        } else if (input.endsWith("ms")) {
            return parseInt(string, 10)
        } else if (input.endsWith("s")) {
            return parseInt(input, 10) * 1000
        }
    }

    options.duration = _convertToMs(options.duration)
    options.delay = _convertToMs(options.delay)
    const totalTime = options.delay + (options.duration * options.iterationCount)

    element.style.animation = `${options.duration}ms ${options.easing} ${options.delay}ms ${options.iterationCount} ${animation}`

    if (!Number.isNaN(totalTime)) {
        setTimeout(() => {
            element.style.animation = ""
            if (typeof options.callback === "function") { options.callback.call(element) }
        }, totalTime)
    }
}