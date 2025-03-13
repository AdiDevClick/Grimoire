export function wait(duration, message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(message);
        }, duration);
    });
}

/**
 * Debounce une fonction de manière Asynchrone
 * Il faut spécifier la duration -
 * Cette fonction permet aussi de prendre en compte
 * les paramètres de la fonction debounced
 * @param {Function} funct
 * @param {Number} duration
 * @fires [debounce]
 * @returns {Function}
 */
export const debounce = function (funct, duration) {
    let timer;
    return (...args) => {
        let context = this;
        return new Promise((resolve) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                funct.apply(context, args);
                resolve(duration);
            }, duration);
        });
    };
};
