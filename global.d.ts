declare global {
    interface Date {
        getISOTimezoneOffset(): string;
        toISOLocaleString(): string;
        toISOOffsetString(): string;
    }

    interface Number {
        leftPad(size?: number): string;
    }
}

declare namespace Chai {
    interface Include {
        something: {
            like(expected: unknown): Assertion;
        };
    }
}

export {};
