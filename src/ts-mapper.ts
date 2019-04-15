export class TsMapper<T, S extends { [key in keyof T | string | number]: any}> {
    private _mappers: { [key in keyof T]?: (src: S, propt: key) => T[key] } = {};
    private _ignores: { [key in keyof S]?: boolean } = {};
    private _mappedOnly: boolean = false;
    private _xOverride: boolean = false;

    constructor(private _Sig: new () => T) {

    }

    public prop<P extends keyof T>(propName: P, callback: (src: S, propt: P) => T[P]): this {
        this._mappers[propName] = callback;
        return this;
    }

    public ignore(props: (keyof S)[]): this {
        props.forEach(prop => this._ignores[prop] = true);
        return this;
    }

    public mappedPropsOnly(): this {
        this._mappedOnly = true;
        return this;
    }

    public copy(props: (keyof S & keyof T)[]): this {
        for (let prop of props) {
            if (!this._mappers[prop]) this._mappers[prop] = (src, propt) => src[propt] as any;
        }
        return this;
    }

    public cancelOverride(): this {
        this._xOverride = true;
        return this;
    }

    public map(src: S): T {
        let result = new this._Sig();
        const comp: T = src;
        for (let key in comp) {
            if (!this._ignores[key]) result[key] = this._mapKey(key, result[key], src);
        }

        return result;
    }

    private _mapKey<K extends keyof T>(key: K, current: T[K], src: S): T[K] {
        if (this._xOverride && current !== undefined) return current;
        if (!this._mappedOnly || this._mappers[key]) {
            return this._mappers[key] ? this._mappers[key](src, key) : src[key];
        }
        return undefined;
    }
}