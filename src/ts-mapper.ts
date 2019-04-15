export class TsMapper<T, S extends { [key in keyof T | string | number]: any}> {
    private _mappers: { [key in keyof T]?: (src: S, propt: key) => T[key] } = {};
    private _ignores: { [key in keyof S]?: boolean } = {};
    private _mappedOnly: boolean = false;
    private _xOverride: boolean = false;

    /**
     * Generic types <T, S>
     *  T is target type/
     *  S is source type
     * 
     * @param _Sig - a class which implements interface T. 
     * 
     * all methods for specifying mapping configuration are chainable.
     * Mapping configuration is maintained in instance state.
     * 
     */
    constructor(private _Sig: new () => T) {

    }

    /**
     * Adds a function that will be used to map properties
     * 
     * @param propName - the name of the property
     * @param callback - A function that accepts the source object and the property name and returns the mapped value
     * @returns this (for chaining)
     */
    public prop<P extends keyof T>(propName: P, callback: (src: S, propt: P) => T[P]): this {
        this._mappers[propName] = callback;
        return this;
    }

    /**
     * A list of properties to be ignored when autoCopying (will not be ignored if also included in copy)
     * 
     * @param props - An array of valid SOURCE property names
     * @returns this (for chaining)
     */
    public ignore(props: (keyof S)[]): this {
        props.forEach(prop => this._ignores[prop] = true);
        return this;
    }

    /**
     * Only include properties that are explicitly mapped or copied. 
     * @returns this (for chaining)
     */
    public mappedPropsOnly(): this {
        this._mappedOnly = true;
        return this;
    }

    /**
     * A list of explicitly named properties to be copied. 
     * Will not be copied explicit mapper exists.
     * 
     * @param props - An Array of valid property names in both source and target types.
     * @returns this (for chaining)
     */
    public copy(props: (keyof S & keyof T)[]): this {
        for (let prop of props) {
            if (!this._mappers[prop]) this._mappers[prop] = (src, propt) => src[propt] as any;
        }
        return this;
    }

    /**
     * Specify not to override any properties that already have a value (null included) in target class.
     * @returns this (for chaining)
     */
    public cancelOverride(): this {
        this._xOverride = true;
        return this;
    }

    /**
     * Run mapping configurations on source
     * 
     * @param src - source object to map
     * @returns Instance of target class (mapped as specified from source)
     */
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