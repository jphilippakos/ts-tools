import { MergeTest } from './ts-merge.mock';
import { tsMerge } from '../src/ts-merge';

describe('tsMerge', () => {
    test('returns instance of MergeTest class with full name Jane Doe', () => {
        const original = new MergeTest('John', 'Doe');
        const result = tsMerge(original, { first: 'Jane' });
        expect(result).toBeInstanceOf(MergeTest);
        expect(result).not.toBe(original);
        expect(result.first).toBe('Jane');
        expect(result.last).toBe('Doe');
        expect(result.full).toBe('Jane Doe');
    });

    test('returns instance of MergeTest class with full name Jane Smith', () => {
        const original = new MergeTest('John', 'Doe');
        const result = tsMerge(original, { first: 'Jane' }, { last: 'Smith' });
        expect(result).toBeInstanceOf(MergeTest);
        expect(result).not.toBe(original);
        expect(result.first).toBe('Jane');
        expect(result.last).toBe('Smith');
        expect(result.full).toBe('Jane Smith');
    });

    test('returns instance of MergeTest class with full name Chris Smith', () => {
        const original = new MergeTest('John', 'Doe');
        const result = tsMerge(original, { first: 'Chris', last: 'Smith' });
        expect(result).toBeInstanceOf(MergeTest);
        expect(result).not.toBe(original);
        expect(result.first).toBe('Chris');
        expect(result.last).toBe('Smith');
        expect(result.full).toBe('Chris Smith');
    });
});