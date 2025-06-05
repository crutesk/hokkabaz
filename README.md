# Hokkabaz
Hokkabaz, Javascript için bir Hook sistemidir. Bu sistem üzerinde kullandığınız sınıfların veya dahili Javascript fonksiyonlarında değişiklik yapmanızı sağlayan bir pakettir.
### Kurulum:
Bu paketi iki şekilde kurabilirsiniz, Direkt olarak bu paketi bilgisayarınıza `git clone` aracılığıyla klonlayıp projesine dahil edebilirsiniz. Ya da Node Package Registry (NPM) kullanarak, aşağıdaki komut vasıtası ile projenize dahil edebilirsiniz:
```
npm install hokkabaz
```
### Basit Kullanım:
```js
const { HokkabazHook } = require( 'hokkabaz' );

const hConsoleLog = new HokkabazHook(
    console, 'log',
    function ( interface ) {
        const args = interface.arguments;
        const orig = interface.original;
        orig( 'Hook Eklendi', ...interface.arguments );
        interface.return();
    }
);

console.log( 'Merhaba Dünya!' );
// Çıktı:
//     Hook Eklendi: Merhaba Dünya!;
```
Detaylı kullanım için lütfen https://github.com/crutesk/hokkabaz/wiki sayfasını ziyaret ediniz.