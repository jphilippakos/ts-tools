import { TsMapper } from '../src/ts-mapper';
import { ITargetCommon, ISourceCommon, TargetCommon, ISourceDiffer } from './ts-mapper.mock';

test('ts-mapping constructor', () => {
    const mapper = new TsMapper<ITargetCommon, ISourceCommon>(TargetCommon);
    expect(mapper['_Sig']).toBe(TargetCommon);
    expect(mapper['_mappers']).toEqual({});
    expect(mapper['_ignores']).toEqual({});
    expect(mapper['_targetFirst']).toBeFalsy();
    expect(mapper['_xOverride']).toBeFalsy();
    expect(mapper['_mappedOnly']).toBeFalsy();
});

describe('ts-mapper mapping config', () => {
    let mapper: TsMapper<ITargetCommon, ISourceCommon>;
    beforeEach(() => {
        mapper = new TsMapper(TargetCommon);
    });

    test('callback is added to callbacks and mapper returned', () => {
        const dateMapper = (src, prop) => new Date(src[prop]);
        const result = mapper.prop('propC', dateMapper);
        expect(result).toBe(mapper);
        expect(result['_mappers'].propC).toBe(dateMapper);
        expect(result['_mappers'].propA).toBeUndefined();
        expect(result['_mappers'].propB).toBeUndefined();
        expect(result['_mappers'].propD).toBeUndefined();
    });

    test('ignores is updated and mapper returned', () => {
        const result = mapper.ignore(['propD', 'propB']);
        expect (result).toBe(mapper);
        expect (result['_ignores'].propA).toBeUndefined;
        expect (result['_ignores'].propB).toBe(true);
        expect (result['_ignores'].propC).toBeUndefined;
        expect (result['_ignores'].propD).toBe(true);
    });

    test('mappedOnly becomes true and mapper returned', () => {
        const result = mapper.mappedPropsOnly();
        expect(result).toBe(mapper);
        expect(result['_mappedOnly']).toBe(true);
    });

    test('xOverride becomes true and mapper returned', () => {
        const result = mapper.cancelOverride();
        expect(result).toBe(mapper);
        expect(result['_xOverride']).toBe(true);
    });

    test('copy function added to mappers and mapper returned', () => {
        const source: ISourceCommon = { propA: 'test', propB: 13, propC: 'January 1, 2019', propD: 'exists' };
        const result = mapper.copy(['propA', 'propB']);
        expect(result).toBe(mapper);
        expect(result['_mappers'].propA(source, 'propA')).toBe('test');
        expect(result['_mappers'].propB(source, 'propB')).toBe(13);
        expect(result['_mappers'].propC).toBeUndefined();
        expect(result['_mappers'].propD).toBeUndefined();
    });
});

describe('ts-mapper mapKey method', () => {
    let mapper: TsMapper<ITargetCommon, ISourceCommon>;
    let source: ISourceCommon = { propA: 'test', propB: 13, propC: 'January 1, 2019', propD: 'exists' };
    
    beforeEach(() => {
        mapper = new TsMapper(TargetCommon);
    });

    test('returns current value with override set', () => {
        mapper['_xOverride'] = true;

        const result = mapper['_mapKey']('propA', 'default', source);
        expect(result).toBe('default');
    });

    test('returns mapped value with override set and no current', () => {
        mapper['_xOverride'] = true;
        mapper['_mappers'].propA = () => 'default';

        const result = mapper['_mapKey']('propA', undefined, source);
        expect(result).toBe('default');
    });

    test('returns mapped value with mapped only set', () => {
        mapper['_mappedOnly'] = true;
        mapper['_mappers'].propA = () => 'default';

        const result = mapper['_mapKey']('propA', undefined, source);
        expect(result).toBe('default');
    });

    test('returns undefined with mappedOnly set and no mapper', () => {
        mapper['_mappedOnly'] = true;

        const result = mapper['_mapKey']('propA', undefined, source);
        expect(result).toBe(undefined);
    });

    test('copies value from source without mapper or x override and current value set', () => {
        const result = mapper['_mapKey']('propA', 'default', source);
        expect(result).toBe('test');
    });
});

describe('ts-mapper map method', () => {
    let mapper: TsMapper<ITargetCommon, ISourceCommon>;
    let source: ISourceCommon = { propA: 'test', propB: 13, propC: 'January 1, 2019', propD: 'exists' };
    
    beforeEach(() => {
        mapper = new TsMapper(TargetCommon);
    });

    test('calls mapKey for all properties of source and return instance of TargetCommon', () => {
        const spy = jest.spyOn<any, '_mapKey'>(mapper, '_mapKey');
        const result = mapper.map(source);
        expect(result).toBeInstanceOf(TargetCommon);
        expect(spy).toBeCalledTimes(4);
        expect(spy).toBeCalledWith('propA', undefined, source);
        expect(spy).toBeCalledWith('propB', undefined, source);
        expect(spy).toBeCalledWith('propC', undefined, source);
        expect(spy).toBeCalledWith('propD', undefined, source);
    });

    test('does not call mapKey for propD... returns instance of TargetCommon', () => {
        mapper['_ignores'] = { propD: true };
        const spy = jest.spyOn<any, '_mapKey'>(mapper, '_mapKey');
        const result = mapper.map(source);
        expect(result).toBeInstanceOf(TargetCommon);
        expect(spy).toBeCalledTimes(3);
        expect(spy).toBeCalledWith('propA', undefined, source);
        expect(spy).toBeCalledWith('propB', undefined, source);
        expect(spy).toBeCalledWith('propC', undefined, source);
    });

    test('returns an instance of TargetCommon with propC mapped, and propD ignored', () => {
        const result = mapper
            .prop('propC', (src, prop) => new Date(src[prop]))
            .ignore(['propD'])
            .map(source);

        expect(result).toBeInstanceOf(TargetCommon);
        expect(result.propA).toBe(source.propA);
        expect(result.propB).toBe(source.propB);
        expect(result.propD).toBeUndefined();
        expect(result.propC).toBeInstanceOf(Date);
        expect(result.propC.valueOf()).toBe(new Date(source.propC).valueOf());
    });

    test('returns an instance of TargetCommon with propC mapped, propD ignored, propB maintained, and propA copied', () => {
        TargetCommon.prototype.propB = 99;
        const result = mapper
            .prop('propC', (src, prop) => new Date(src[prop]))
            .copy(['propA', 'propB'])
            .mappedPropsOnly()
            .cancelOverride()
            .map(source);

        expect(result).toBeInstanceOf(TargetCommon);
        expect(result.propA).toBe(source.propA);
        expect(result.propB).toBe(99);
        expect(result.propD).toBeUndefined();
        expect(result.propC).toBeInstanceOf(Date);
        expect(result.propC.valueOf()).toBe(new Date(source.propC).valueOf());
        delete TargetCommon.prototype.propB;
    });
});