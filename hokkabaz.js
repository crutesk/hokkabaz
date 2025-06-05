/*
    Hokkabaz, Javascript için bir Hook sistemidir.
    Açık-kaynak, WTFPL lisansı.

    Telif Hakkı (C) 2025 crutesk <eli@crutesk.com>
*/

function defGet ( object, propertyKey, value ) {
    return Object.defineProperty( object, propertyKey, {
        get: () => value
    } );
}

class HokkabazInterface {
    constructor ( original, args ) {
        this._pSymbol = Symbol();
        this.arguments = args;
        this[ this._pSymbol ] = {
            iterNext: true,
            orig: original,
            ret: undefined
        };

        defGet( this, 'original', original );
    }

    get return () {
        return value => {
            this[ this._pSymbol ].iterNext = false;
            return this[ this._pSymbol ].ret = value;
        };
    }

    set return ( value ) {
        this[ this._pSymbol ].iterNext = false;
        return this[ this._pSymbol ].ret = value;
    }
}

class HokkabazHook {
    constructor ( object, propertyKey, hookCall = null ) {
        this._pSymbol = Symbol();
        this[ this._pSymbol ] = {
            object,
            propertyKey,
            original: object[ propertyKey ]
        };
        if ( hookCall )
            this.setHook( hookCall );
    }

    setHook ( func ) {
        const that = this[ this._pSymbol ];
        const wrapperFunction = function ( ...args ) {
            const iHook = new HokkabazInterface( that.original, args );
            const iHookP = iHook[ iHook._pSymbol ];
            const output = func( iHook );
            if ( !iHookP.iterNext )
                return iHookP.ret ?? output;
            return that.original( ...iHook.arguments );
        };
        return that.object[ that.propertyKey ] = wrapperFunction;
    }

    restore () {
        const that = this[ this._pSymbol ];
        return that.object[ that.propertyKey ] = that.original;
    }
}

class HokkabazFunction {
    constructor ( baseFunction ) {
        if ( typeof baseFunction !== 'function' )
            throw new Error( 'Given argument "baseFunction" is not a function' );
        defGet( this, 'base', baseFunction );
        defGet( this, 'hooks', new Map() );
    }

    addHook ( hookFunc ) {
        if ( typeof hookFunc !== 'function' )
            throw new Error( 'Given argument "hookFunc" is not a function' );
        this.hooks.set( hookFunc, hookFunc );
        return this;
    }

    removeHook ( hookFunc ) {
        this.hooks.delete( hookFunc );
        return this;
    }

    run ( ...args ) {
        const iHook = new HokkabazInterface( this.base, args );
        const iHookP = iHook[ iHook._pSymbol ];
        let nextReturn;
        for ( const [ _, hook ] of [ ...this.hooks ].reverse() ) {
            const output = hook( iHook, nextReturn );
            if ( !iHookP.iterNext )
                return iHookP.ret ?? output;
            nextReturn = output;
        }
        return this.base( ...iHook.arguments ) ?? iHookP.ret ?? nextReturn;
    }

    toFunction () {
        return this.run.bind( this );
    }
}

class HokkabazFuncProvider {
    constructor ( funcMap = {} ) {
        const fnList = this.functions = {};
        for ( let [ key, callback ] of Object.entries( funcMap ) ) {
            if ( !( callback instanceof HokkabazFunction ) )
                callback = new HokkabazFunction( callback );
            fnList[ key ] = callback;
        }
    }
    set ( key, callback ) {
        if ( !( callback instanceof HokkabazFunction ) )
            callback = new HokkabazFunction( callback );
        return this.functions[ key ] = callback;
    }
    get ( key ) {
        return this.functions[ key ];
    }
}

exports.HokkabazInterface = HokkabazInterface;
exports.HokkabazHook = HokkabazHook;
exports.HokkabazFunction = HokkabazFunction;
exports.HokkabazFuncProvider = HokkabazFuncProvider;