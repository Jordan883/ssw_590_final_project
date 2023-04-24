const helpers = require('./helpers');

test('stringInputHandler should throw an informative error if it receives non-string input.', () => {
    expect.assertions(1);
    try {
        helpers.stringInputHandler(12345, 'Number input');
    } catch (e) {
        expect(e).toBe('Error: Number input must be a string.');
    }
});

test('stringInputHandler should throw an informative error if it receives an empty string.', () => {
    expect.assertions(1);
    try {
        helpers.stringInputHandler('', 'Empty string input');
    } catch (e) {
        expect(e).toBe('Error: Empty string input cannot be empty or only whitespace.');
    }
});

test('stringInputHandler should throw an informative error if it receives a whitespace-only string.', () => {
    expect.assertions(1);
    try {
        helpers.stringInputHandler('     ', 'Whitespace input');
    } catch (e) {
        expect(e).toBe('Error: Whitespace input cannot be empty or only whitespace.');
    }
});

test('stringInputHandler should return the trimmed input (non-empty, non-whitespace) string', () => {
    expect(helpers.stringInputHandler('     dog   ', 'Good, untrimmed input')).toBe('dog');
})

test('stringLengthCheck should throw an informative error if it receives a string shorter than the input length.', () => {
    expect.assertions(1);
    try {
        helpers.stringLengthCheck('test', 'Short input', 5);
    } catch (e) {
        expect(e).toBe('Error: Short input must be at least 5 characters long.');
    }
})

test('stringLengthCheck should do nothing if it receives a string of the same length as the input length.', () => {
    helpers.stringLengthCheck('test', 'Good input', 4);
})

test('stringLengthCheck should do nothing if it receives a string longer than as the input length.', () => {
    helpers.stringLengthCheck('test', 'Good input', 3);
})

test('stringRangeCheck should throw an informative error if it receives a string shorter than the input min length.', () => {
    expect.assertions(1);
    try {
        helpers.stringRangeCheck('test', 'Short input', 5, 7);
    } catch (e) {
        expect(e).toBe('Error: Short input must be at least 5 characters long.');
    }
})

test('stringRangeCheck should do nothing if it receives a string of the same length as the input min length.', () => {
    helpers.stringRangeCheck('test', 'Good input', 4, 6);
})

test('stringRangeCheck should do nothing if it receives a string with length between the input min and max lengths.', () => {
    helpers.stringRangeCheck('test', 'Good input', 3, 5);
})

test('stringRangeCheck should do nothing if it receives a string of the same length as the input max length.', () => {
    helpers.stringRangeCheck('test', 'Good input', 2, 4);
})

test('stringRangeCheck should throw an informative error if it receives a string longer than the input max length.', () => {
    expect.assertions(1);
    try {
        helpers.stringRangeCheck('test', 'Long input', 1, 3);
    } catch (e) {
        expect(e).toBe('Error: Long input can be at most 3 characters long.');
    }
})