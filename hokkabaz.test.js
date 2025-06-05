/*
    Hokkabaz, Javascript için bir Hook sistemidir.
    Açık-kaynak, WTFPL lisansı.

    Telif Hakkı (C) 2025 crutesk <eli@crutesk.com>
*/

const Hokkabaz = require( './hokkabaz.js' );
global.gRet = 0;

function test ( name, condition ) {
    console.log( `[${ condition ? 'PASS' : 'FAIL' }] ${ name }` );
    if ( !condition )
        global.gRet = 1;
}

// Test 1
function Test1 () {
    const test = { func: function ( one, two ) {
        return one + two;
    } };
    const hFunc = new Hokkabaz.HokkabazHook(
        test, 'func',
        function ( iHook ) {
            if ( iHook.arguments[ 0 ] == 10 )
                iHook.arguments[ 0 ] = 20;
        }
    );
    const con1 = test.func( 10, 10 ) === 30 && test.func( 20, 10 ) === 30;
    hFunc.restore();
    const con2 = test.func( 10, 10 ) === 20 && test.func( 20, 10 ) === 30;
    return con1 && con2;
}

function Test2 () {
    const hFunc = new Hokkabaz.HokkabazFunction(
        function ( one, two, condition ) {
            if ( condition == 'TEST1' )
                return one + two;
            else if ( condition == 'TEST2' )
                return one - two;
        }
    );
    hFunc.addHook(
        function ( iHook ) {
            const [ one, two, condition ] = iHook.arguments;
            if ( condition === 'TEST3' )
                return iHook.return( one * two );
        }
    );
    function Hook2 ( iHook ) {
        const [ one ] = iHook.arguments;
        if ( one === 10 )
            iHook.arguments[ 0 ] = one * 2;
    }
    hFunc.addHook( Hook2 );
    const test = hFunc.toFunction();
    const con1 = test( 20, 10, 'TEST1' ) === 30
        && test( 20, 10, 'TEST2' ) === 10
        && test( 10, 10, 'TEST2' ) === 10
        && test( 10, 10, 'TEST1' ) === 30
        && test( 20, 10, 'TEST3' ) === 200
        && test( 10, 10, 'TEST3' ) === 200;
    hFunc.removeHook( Hook2 );
    const con2 = test( 20, 10, 'TEST1' ) === 30
        && test( 20, 10, 'TEST2' ) === 10
        && test( 10, 10, 'TEST2' ) === 0
        && test( 10, 10, 'TEST1' ) === 20
        && test( 20, 10, 'TEST3' ) === 200
        && test( 10, 10, 'TEST3' ) === 100;
    return con1 && con2;
}

function Test3 () {
    const hProvider = new Hokkabaz.HokkabazFuncProvider( {
        TestFunction1 () {},
        TestFunction2: new Hokkabaz.HokkabazFunction(
            function () {}
        )
    } );
    return hProvider.get( 'TestFunction1' ) instanceof Hokkabaz.HokkabazFunction
            && hProvider.get( 'TestFunction2' ) instanceof Hokkabaz.HokkabazFunction
}

test( 'HokkabazHook Class', Test1() );
test( 'HokkabazFunction Class', Test2() );
test( 'HokkabazFuncProvider Class', Test3() );

process.exit( gRet );