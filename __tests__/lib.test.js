const { ThisBound, ThisKeywordProhibitedError } = require('../lib/lib')

class TestClassContainingGetterAndSetter extends ThisBound {
    constructor() {
        super();
    }
    get x() {}
    set x(value) {}
};

class TestClassThisNotBound {
    constructor() {
        this.value = 1;
    }

    getValue() {
        return this.value;
    }
}

class TestClassThisBound extends ThisBound {
    constructor() {
        super();
        this.value = 1;
    }

    getValue(self) {
        return self.value;
    }
}

class TestClassAccessThis extends ThisBound {
    constructor() {
        super();
        this.value = 1;
    }

    getValue(self) {
        return this.value;
    }
}

class MethodHolder {
    constructor(instance) {
        this.value = 2;
        this.getValue = instance.getValue;
    }
}

class Test2ClassThisBound extends TestClassThisBound {
    constructor(value) {
        super();
        this.value = value;
    }

    getValue(self) {
        return super.getValue(self);
    }
}

test(
    'Test constructing class containing getter and setter.',
    () => {
        expect(() => { new TestClassContainingGetterAndSetter() }).not.toThrow(TypeError);
    },
);

test(
    'Test this binded.',
    () => {
        let t = new TestClassThisBound();
        expect(() => { t.getValue() }).not.toThrow(TypeError);
        let t_getValue = t.getValue;
        expect(t_getValue).not.toThrow(TypeError);
        let mh = new MethodHolder(t);
        expect(mh.getValue()).toBe(t.getValue());
    },
);

test(
    'Test this not binded.',
    () => {
        let t = new TestClassThisNotBound();
        expect(() => { t.getValue() }).not.toThrow(TypeError);
        let t_getValue = t.getValue;
        expect(t_getValue).toThrow(TypeError);
        let mh = new MethodHolder(t);
        expect(mh.getValue()).not.toBe(t.getValue());
    },
);

test(
    'Test this access throws.',
    () => {
        let t = new TestClassAccessThis();
        expect(t.getValue).toThrow(ThisKeywordProhibitedError);
    },
);


test(
    'Test double inheritance.',
    () => {
        let t = new Test2ClassThisBound(3);
        expect(() => { t.getValue(); }).not.toThrow(TypeError);
        expect(t.getValue()).toBe(3);
    }
)