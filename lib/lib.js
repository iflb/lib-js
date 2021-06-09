class ThisKeywordProhibitedError extends Error {}

const dontUseThisKeywordProxyObject = new Proxy(
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
            this[methodName] = this[methodName].bind(dontUseThisKeywordProxyObject, this);
        }
    }
}

exports.ThisBinded = ThisBinded;
exports.ThisKeywordProhibitedError = ThisKeywordProhibitedError;
