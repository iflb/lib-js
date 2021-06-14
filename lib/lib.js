class ThisKeywordProhibitedError extends Error {}

const thisKeywordProhibitedProxyObject = new Proxy(
    { referenceError: new ThisKeywordProhibitedError('using \'this\' keyword is prohibited. use \'self\'(1st argument) instead.') },
    {
        get(target) { throw target.referenceError; },
        set(target) { throw target.referenceError; },
    },
);

class ThisBound {
    constructor() {
        let currentPrototype = Object.getPrototypeOf(this);
        while (currentPrototype !== ThisBound.prototype) {
            let methodNames = Object.getOwnPropertyNames(currentPrototype);
            methodNames.splice(methodNames.indexOf('constructor'), 1);
            for (let methodName of methodNames) {
                let isThisAlreadyBoundToObject = Object.getOwnPropertyNames(this).includes(methodName);
                let isPropertyFunction = this[methodName] instanceof Function;
                if (isPropertyFunction && !isThisAlreadyBoundToObject) {
                    this[methodName] = this[methodName].bind(thisKeywordProhibitedProxyObject, this);
                }
            }      
            currentPrototype = Object.getPrototypeOf(currentPrototype);
        }
    }
}

exports.ThisBound = ThisBound;
exports.ThisKeywordProhibitedError = ThisKeywordProhibitedError;
