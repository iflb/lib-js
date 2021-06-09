const { ThisBinded, ThisKeywordProhibitedError } = require('../lib/lib')

class TestClassContainingGetterAndSetter extends ThisBinded {
    constructor() {
        super();
    }
    get x() {}
    set x(value) {}
};

class TestClassThisNotBinded {
    constructor() {
        this.value = 1;
    }

    getValue() {
        return this.value;
    }
}

class TestClassThisBinded extends ThisBinded {
    constructor() {
        super();
        this.value = 1;
    }

    getValue(self) {
        return self.value;
    }
}

class TestClassAccessThis extends ThisBinded {
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

test(
    'Test constructing class containing getter and setter.',
    () => {
        expect(() => { new TestClassContainingGetterAndSetter() }).not.toThrow(TypeError);
    },
);

test(
    'Test this binded.',
    () => {
        let t = new TestClassThisBinded();
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
        let t = new TestClassThisNotBinded();
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
