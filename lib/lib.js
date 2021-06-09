class ThisKeywordProhibitedError extends Error {}

const thisKeywordProhibitedProxyObject = new Proxy(
    { referenceError: new ThisKeywordProhibitedError('using \'this\' keyword is prohibited. use \'self\'(1st argument) instead.') },
    {
        get(target) { throw target.referenceError; },
        set(target) { throw target.referenceError; },
    },
);

class ThisBinded {
    constructor() {
        let inheritedClassPrototype = Object.getPrototypeOf(this);
        let methodNames = Object.getOwnPropertyNames(inheritedClassPrototype);
        methodNames.splice(methodNames.indexOf('constructor'), 1);
        for (let methodName of methodNames) {
            if (this[methodName] instanceof Function) {
                this[methodName] = this[methodName].bind(thisKeywordProhibitedProxyObject, this);
            }
        }
    }
}

exports.ThisBinded = ThisBinded;
exports.ThisKeywordProhibitedError = ThisKeywordProhibitedError;
