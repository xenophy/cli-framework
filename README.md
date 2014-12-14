CLI Framwrok
============

CLI Framework is a lightweight class architecture and cli framework that is inspired by the Ext JS 5.

## Installation

    $ npm install cli-framework

## Usage

    var CLI = require('cli-Framework');
    
    // or
    
    require('cli-Framework');

after that, you can use CLI class methods.

    var o = {hoge: 1};
    
    CLI.applyIf(o, {
        hoge: 2
    });

If you wanna use Ext JS like class syste, you can use folloing:

    CLI.define('MyApp.foo.Bar', {
        // ...
    });

of course, you can use **extends**, **mixins** and **require**, all of Exd JS 5 base class systems.

Also you can use bootpoint like Ext JS.

    CLI.application({
        appFolder: 'app',
        launch: function() {
        }
    });



## License

This version of "CLI Framwrok" is licensed under the terms of the The GNU General Public License v3.0.

http://www.gnu.org/licenses/gpl.html

--

THIS SOFTWARE IS DISTRIBUTED "AS-IS" WITHOUT ANY WARRANTIES, CONDITIONS AND 
REPRESENTATIONS WHETHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE 
IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, 
FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, NON-INFRINGEMENT, PERFORMANCE 
AND THOSE ARISING BY STATUTE OR FROM CUSTOM OR USAGE OF TRADE OR COURSE OF DEALING.
