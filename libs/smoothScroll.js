/**
 * Smoothly scrolls the page to the specified target element.
 * 
 * @param {string | HTMLElement} target - The target element to scroll to. Can be a CSS selector or an HTMLElement.
 * @param {Object} [options] - Optional configuration object.
 * @param {number} [options.duration=500] - Duration of the scroll animation in milliseconds.
 * @param {number} [options.offset=0] - Offset in pixels. Positive values will stop the scroll before the target reaches the top, negative values will scroll past the target.
 * @param {string} [options.easing='easeInOutQuad'] - The easing function to use for the animation. Possible values: 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad'.
 * 
 * @throws {Error} If the target is not a string or HTMLElement.
 * @throws {Error} If the duration is not a number.
 * @throws {Error} If the offset is not a number.
 * @throws {Error} If the easing function is not a string.
 */
function smoothScroll(target, options) {
    if (typeof target !== "string" && !(target instanceof HTMLElement)) { throw new Error("TypeError on smoothScroll(): provided target must be String or HTMLElement.") }
    if (options != undefined && (typeof options !== "object" || Array.isArray(options))) { throw new Error("TypeError on smoothScroll: provided options must be an Object.") }
    const defaults = {
        duration: 500,
        offset: 0,
        easing: "easeInOutQuad"
    }
    options = { ...defaults, ...options }
    if (typeof options.duration !== "number") { throw new Error("TypeError on smoothScroll: provided options.durations must be a number.") }
    if (typeof options.offset !== "number") { throw new Error("TypeError on smoothScroll: provided options.offset must be a number.") }
    if (typeof options.easing !== "string") { throw new Error("TypeError on smoothScroll: provided options.easing must be a String.") }

    const easingFunctions = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
        easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    }

    const element = typeof target === "string" ? document.querySelector(target) : target
    const ease = easingFunctions[options.easing] || easingFunctions.easeInQuad

    const start = window.scrollY
    const end = Number(element.offsetTop) - options.offset
    const diff = end - start
    let startTime;
    function step(time) {
        if (!startTime) startTime = time
        const passedTime = time - startTime
        const progress = Math.min(passedTime / options.duration, 1)
        const easingProg = ease(progress)

        window.scrollTo(0, start + diff * easingProg)

        if (passedTime < options.duration) {
            requestAnimationFrame(step)
        }
    }
    requestAnimationFrame(step)
}