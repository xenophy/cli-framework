Ext.data.JsonP.CLI_Function({"tagname":"class","name":"CLI.Function","autodetected":{},"files":[{"filename":"Function.js","href":"Function.html#CLI-Function"}],"singleton":true,"members":[{"name":"alias","tagname":"method","owner":"CLI.Function","id":"method-alias","meta":{}},{"name":"bind","tagname":"method","owner":"CLI.Function","id":"method-bind","meta":{}},{"name":"bindCallback","tagname":"method","owner":"CLI.Function","id":"method-bindCallback","meta":{}},{"name":"clone","tagname":"method","owner":"CLI.Function","id":"method-clone","meta":{}},{"name":"createBarrier","tagname":"method","owner":"CLI.Function","id":"method-createBarrier","meta":{}},{"name":"createBuffered","tagname":"method","owner":"CLI.Function","id":"method-createBuffered","meta":{}},{"name":"createDelayed","tagname":"method","owner":"CLI.Function","id":"method-createDelayed","meta":{}},{"name":"createInterceptor","tagname":"method","owner":"CLI.Function","id":"method-createInterceptor","meta":{}},{"name":"createSequence","tagname":"method","owner":"CLI.Function","id":"method-createSequence","meta":{}},{"name":"createThrottled","tagname":"method","owner":"CLI.Function","id":"method-createThrottled","meta":{}},{"name":"defer","tagname":"method","owner":"CLI.Function","id":"method-defer","meta":{}},{"name":"flexSetter","tagname":"method","owner":"CLI.Function","id":"method-flexSetter","meta":{}},{"name":"interceptAfter","tagname":"method","owner":"CLI.Function","id":"method-interceptAfter","meta":{}},{"name":"interceptBefore","tagname":"method","owner":"CLI.Function","id":"method-interceptBefore","meta":{}},{"name":"interval","tagname":"method","owner":"CLI.Function","id":"method-interval","meta":{}},{"name":"pass","tagname":"method","owner":"CLI.Function","id":"method-pass","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-CLI.Function","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/Function.html#CLI-Function' target='_blank'>Function.js</a></div></pre><div class='doc-contents'><p>A collection of useful static methods to deal with function callbacks.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-alias' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-alias' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-alias' class='name expandable'>alias</a>( <span class='pre'>object, methodName</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Create an alias to the provided method property with name methodName of object. ...</div><div class='long'><p>Create an alias to the provided method property with name <code>methodName</code> of <code>object</code>.\nNote that the execution scope will still be bound to the provided <code>object</code> itself.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>object</span> : Object/Function<div class='sub-desc'>\n</div></li><li><span class='pre'>methodName</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>aliasFn</p>\n</div></li></ul></div></div></div><div id='method-bind' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-bind' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-bind' class='name expandable'>bind</a>( <span class='pre'>fn, [scope], [args], [appendArgs]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a new function from the provided fn, change this to the provided scope,\noptionally overrides arguments for the...</div><div class='long'><p>Create a new function from the provided <code>fn</code>, change <code>this</code> to the provided scope,\noptionally overrides arguments for the call. Defaults to the arguments passed by\nthe caller.</p>\n\n<p><a href=\"#!/api/CLI-method-bind\" rel=\"CLI-method-bind\" class=\"docClass\">CLI.bind</a> is alias for <a href=\"#!/api/CLI.Function-method-bind\" rel=\"CLI.Function-method-bind\" class=\"docClass\">CLI.Function.bind</a></p>\n\n<p><strong>NOTE:</strong> This method is deprecated. Use the standard <code>bind</code> method of JavaScript\n<code>Function</code> instead:</p>\n\n<pre><code> function foo () {\n     ...\n }\n\n var fn = foo.bind(this);\n</code></pre>\n\n<p>This method is unavailable natively on IE8 and IE/Quirks but CLI Framework provides a\n\"polyfill\" to emulate the important features of the standard <code>bind</code> method. In\nparticular, the polyfill only provides binding of \"this\" and optional arguments.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function to delegate.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the function is executed.\n<strong>If omitted, defaults to the default global environment object (usually the browser window).</strong></p>\n</div></li><li><span class='pre'>args</span> : Array (optional)<div class='sub-desc'><p>Overrides arguments for the call. (Defaults to the arguments passed by the caller)</p>\n</div></li><li><span class='pre'>appendArgs</span> : Boolean/Number (optional)<div class='sub-desc'><p>if True args are appended to call args instead of overriding,\nif a number the args are inserted at the specified position.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>The new function.</p>\n</div></li></ul></div></div></div><div id='method-bindCallback' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-bindCallback' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-bindCallback' class='name expandable'>bindCallback</a>( <span class='pre'>callback, scope, args, delay, caller</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Captures the given parameters for a later call to CLI.callback. ...</div><div class='long'><p>Captures the given parameters for a later call to <code><a href=\"#!/api/CLI-method-callback\" rel=\"CLI-method-callback\" class=\"docClass\">CLI.callback</a></code>.</p>\n\n<p>The arguments match that of <code><a href=\"#!/api/CLI-method-callback\" rel=\"CLI-method-callback\" class=\"docClass\">CLI.callback</a></code> except for the <code>args</code> which, if provided\nto this method, are prepended to any arguments supplied by the eventual caller of\nthe returned function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>delay</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>caller</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>A function that, when called, uses <code><a href=\"#!/api/CLI-method-callback\" rel=\"CLI-method-callback\" class=\"docClass\">CLI.callback</a></code> to call the\ncaptured <code>callback</code>.</p>\n</div></li></ul></div></div></div><div id='method-clone' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-clone' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-clone' class='name expandable'>clone</a>( <span class='pre'>method</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a \"clone\" of the provided method. ...</div><div class='long'><p>Create a \"clone\" of the provided method. The returned method will call the given\nmethod passing along all arguments and the \"this\" pointer and return its result.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>method</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>cloneFn</p>\n</div></li></ul></div></div></div><div id='method-createBarrier' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-createBarrier' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-createBarrier' class='name expandable'>createBarrier</a>( <span class='pre'>count, fn, scope</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Wraps the passed function in a barrier function which will call the passed function after the passed number of invoca...</div><div class='long'><p>Wraps the passed function in a barrier function which will call the passed function after the passed number of invocations.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>count</span> : Number<div class='sub-desc'><p>The number of invocations which will result in the calling of the passed function.</p>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function to call after the required number of invocations.</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the function will be called.</p>\n</div></li></ul></div></div></div><div id='method-createBuffered' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-createBuffered' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-createBuffered' class='name expandable'>createBuffered</a>( <span class='pre'>fn, buffer, [scope], [args]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a delegate function, optionally with a bound scope which, when called, buffers\nthe execution of the passed fu...</div><div class='long'><p>Creates a delegate function, optionally with a bound scope which, when called, buffers\nthe execution of the passed function for the configured number of milliseconds.\nIf called again within that period, the impending invocation will be canceled, and the\ntimeout period will begin again.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function to invoke on a buffered timer.</p>\n</div></li><li><span class='pre'>buffer</span> : Number<div class='sub-desc'><p>The number of milliseconds by which to buffer the invocation of the\nfunction.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which.\nthe passed function is executed. If omitted, defaults to the scope specified by the caller.</p>\n</div></li><li><span class='pre'>args</span> : Array (optional)<div class='sub-desc'><p>Override arguments for the call. Defaults to the arguments\npassed by the caller.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>A function which invokes the passed function after buffering for the specified time.</p>\n</div></li></ul></div></div></div><div id='method-createDelayed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-createDelayed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-createDelayed' class='name expandable'>createDelayed</a>( <span class='pre'>fn, delay, [scope], [args], [appendArgs]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a delegate (callback) which, when called, executes after a specific delay. ...</div><div class='long'><p>Creates a delegate (callback) which, when called, executes after a specific delay.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function which will be called on a delay when the returned function is called.\nOptionally, a replacement (or additional) argument list may be specified.</p>\n</div></li><li><span class='pre'>delay</span> : Number<div class='sub-desc'><p>The number of milliseconds to defer execution by whenever called.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) used by the function at execution time.</p>\n</div></li><li><span class='pre'>args</span> : Array (optional)<div class='sub-desc'><p>Override arguments for the call. (Defaults to the arguments passed by the caller)</p>\n</div></li><li><span class='pre'>appendArgs</span> : Boolean/Number (optional)<div class='sub-desc'><p>if True args are appended to call args instead of overriding,\nif a number the args are inserted at the specified position.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>A function which, when called, executes the original function after the specified delay.</p>\n</div></li></ul></div></div></div><div id='method-createInterceptor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-createInterceptor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-createInterceptor' class='name expandable'>createInterceptor</a>( <span class='pre'>origFn, newFn, [scope], [returnValue]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates an interceptor function. ...</div><div class='long'><p>Creates an interceptor function. The passed function is called before the original one. If it returns false,\nthe original one is not called. The resulting function returns the results of the original function.\nThe passed function is called with the parameters of the original function. Example usage:</p>\n\n<pre><code>var sayHi = function(name){\n    alert('Hi, ' + name);\n};\n\nsayHi('Fred'); // alerts \"Hi, Fred\"\n\n// create a new function that validates input without\n// directly modifying the original function:\nvar sayHiToFriend = <a href=\"#!/api/CLI.Function-method-createInterceptor\" rel=\"CLI.Function-method-createInterceptor\" class=\"docClass\">CLI.Function.createInterceptor</a>(sayHi, function(name){\n    return name === 'Brian';\n});\n\nsayHiToFriend('Fred');  // no alert\nsayHiToFriend('Brian'); // alerts \"Hi, Brian\"\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>origFn</span> : Function<div class='sub-desc'><p>The original function.</p>\n</div></li><li><span class='pre'>newFn</span> : Function<div class='sub-desc'><p>The function to call before the original.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the passed function is executed.\n<strong>If omitted, defaults to the scope in which the original function is called or the browser window.</strong></p>\n</div></li><li><span class='pre'>returnValue</span> : Object (optional)<div class='sub-desc'><p>The value to return if the passed function return <code>false</code>.</p>\n<p>Defaults to: <code>null</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>The new function.</p>\n</div></li></ul></div></div></div><div id='method-createSequence' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-createSequence' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-createSequence' class='name expandable'>createSequence</a>( <span class='pre'>originalFn, newFn, [scope]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a combined function call sequence of the original function + the passed function. ...</div><div class='long'><p>Create a combined function call sequence of the original function + the passed function.\nThe resulting function returns the results of the original function.\nThe passed function is called with the parameters of the original function. Example usage:</p>\n\n<pre><code>var sayHi = function(name){\n    alert('Hi, ' + name);\n};\n\nsayHi('Fred'); // alerts \"Hi, Fred\"\n\nvar sayGoodbye = <a href=\"#!/api/CLI.Function-method-createSequence\" rel=\"CLI.Function-method-createSequence\" class=\"docClass\">CLI.Function.createSequence</a>(sayHi, function(name){\n    alert('Bye, ' + name);\n});\n\nsayGoodbye('Fred'); // both alerts show\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>originalFn</span> : Function<div class='sub-desc'><p>The original function.</p>\n</div></li><li><span class='pre'>newFn</span> : Function<div class='sub-desc'><p>The function to sequence.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the passed function is executed.\nIf omitted, defaults to the scope in which the original function is called or the\ndefault global environment object (usually the browser window).</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>The new function.</p>\n</div></li></ul></div></div></div><div id='method-createThrottled' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-createThrottled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-createThrottled' class='name expandable'>createThrottled</a>( <span class='pre'>fn, interval, [scope]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a throttled version of the passed function which, when called repeatedly and\nrapidly, invokes the passed func...</div><div class='long'><p>Creates a throttled version of the passed function which, when called repeatedly and\nrapidly, invokes the passed function only after a certain interval has elapsed since the\nprevious invocation.</p>\n\n<p>This is useful for wrapping functions which may be called repeatedly, such as\na handler of a mouse move event when the processing is expensive.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function to execute at a regular time interval.</p>\n</div></li><li><span class='pre'>interval</span> : Number<div class='sub-desc'><p>The interval in milliseconds on which the passed function is executed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which\nthe passed function is executed. If omitted, defaults to the scope specified by the caller.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>A function which invokes the passed function at the specified interval.</p>\n</div></li></ul></div></div></div><div id='method-defer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-defer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-defer' class='name expandable'>defer</a>( <span class='pre'>fn, millis, [scope], [args], [appendArgs]</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Calls this function after the number of milliseconds specified, optionally in a specific scope. ...</div><div class='long'><p>Calls this function after the number of milliseconds specified, optionally in a specific scope. Example usage:</p>\n\n<pre><code>var sayHi = function(name){\n    alert('Hi, ' + name);\n}\n\n// executes immediately:\nsayHi('Fred');\n\n// executes after 2 seconds:\n<a href=\"#!/api/CLI.Function-method-defer\" rel=\"CLI.Function-method-defer\" class=\"docClass\">CLI.Function.defer</a>(sayHi, 2000, this, ['Fred']);\n\n// this syntax is sometimes useful for deferring\n// execution of an anonymous function:\n<a href=\"#!/api/CLI.Function-method-defer\" rel=\"CLI.Function-method-defer\" class=\"docClass\">CLI.Function.defer</a>(function(){\n    alert('Anonymous');\n}, 100);\n</code></pre>\n\n<p><a href=\"#!/api/CLI-method-defer\" rel=\"CLI-method-defer\" class=\"docClass\">CLI.defer</a> is alias for <a href=\"#!/api/CLI.Function-method-defer\" rel=\"CLI.Function-method-defer\" class=\"docClass\">CLI.Function.defer</a></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function to defer.</p>\n</div></li><li><span class='pre'>millis</span> : Number<div class='sub-desc'><p>The number of milliseconds for the <code>setTimeout</code> call\n(if less than or equal to 0 the function is executed immediately).</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the function is executed.\n<strong>If omitted, defaults to the browser window.</strong></p>\n</div></li><li><span class='pre'>args</span> : Array (optional)<div class='sub-desc'><p>Overrides arguments for the call. Defaults to the arguments passed by the caller.</p>\n</div></li><li><span class='pre'>appendArgs</span> : Boolean/Number (optional)<div class='sub-desc'><p>If <code>true</code> args are appended to call args instead of overriding,\nor, if a number, then the args are inserted at the specified position.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>The timeout id that can be used with <code>clearTimeout</code>.</p>\n</div></li></ul></div></div></div><div id='method-flexSetter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-flexSetter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-flexSetter' class='name expandable'>flexSetter</a>( <span class='pre'>setter</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>A very commonly used method throughout the framework. ...</div><div class='long'><p>A very commonly used method throughout the framework. It acts as a wrapper around another method\nwhich originally accepts 2 arguments for <code>name</code> and <code>value</code>.\nThe wrapped function then allows \"flexible\" value setting of either:</p>\n\n<ul>\n<li><code>name</code> and <code>value</code> as 2 arguments</li>\n<li>one single object argument with multiple key - value pairs</li>\n</ul>\n\n\n<p>For example:</p>\n\n<pre><code>var setValue = <a href=\"#!/api/CLI.Function-method-flexSetter\" rel=\"CLI.Function-method-flexSetter\" class=\"docClass\">CLI.Function.flexSetter</a>(function(name, value) {\n    this[name] = value;\n});\n\n// Afterwards\n// Setting a single name - value\nsetValue('name1', 'value1');\n\n// Settings multiple name - value pairs\nsetValue({\n    name1: 'value1',\n    name2: 'value2',\n    name3: 'value3'\n});\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>setter</span> : Function<div class='sub-desc'><p>The single value setter method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>The name of the value being set.</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>The value being set.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-interceptAfter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-interceptAfter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-interceptAfter' class='name expandable'>interceptAfter</a>( <span class='pre'>object, methodName, fn, [scope]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Adds behavior to an existing method that is executed after the\noriginal behavior of the function. ...</div><div class='long'><p>Adds behavior to an existing method that is executed after the\noriginal behavior of the function.  For example:</p>\n\n<pre><code>var soup = {\n    contents: [],\n    add: function(ingredient) {\n        this.contents.push(ingredient);\n    }\n};\n<a href=\"#!/api/CLI.Function-method-interceptAfter\" rel=\"CLI.Function-method-interceptAfter\" class=\"docClass\">CLI.Function.interceptAfter</a>(soup, \"add\", function(ingredient){\n    // Always add a bit of extra salt\n    this.contents.push(\"salt\");\n});\nsoup.add(\"water\");\nsoup.add(\"onions\");\nsoup.contents; // will contain: water, salt, onions, salt\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>object</span> : Object<div class='sub-desc'><p>The target object</p>\n</div></li><li><span class='pre'>methodName</span> : String<div class='sub-desc'><p>Name of the method to override</p>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>Function with the new behavior.  It will\nbe called with the same arguments as the original method.  The\nreturn value of this function will be the return value of the\nnew method.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope to execute the interceptor function. Defaults to the object.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>The new function just created.</p>\n</div></li></ul></div></div></div><div id='method-interceptBefore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-interceptBefore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-interceptBefore' class='name expandable'>interceptBefore</a>( <span class='pre'>object, methodName, fn, [scope]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Adds behavior to an existing method that is executed before the\noriginal behavior of the function. ...</div><div class='long'><p>Adds behavior to an existing method that is executed before the\noriginal behavior of the function.  For example:</p>\n\n<pre><code>var soup = {\n    contents: [],\n    add: function(ingredient) {\n        this.contents.push(ingredient);\n    }\n};\n<a href=\"#!/api/CLI.Function-method-interceptBefore\" rel=\"CLI.Function-method-interceptBefore\" class=\"docClass\">CLI.Function.interceptBefore</a>(soup, \"add\", function(ingredient){\n    if (!this.contents.length &amp;&amp; ingredient !== \"water\") {\n        // Always add water to start with\n        this.contents.push(\"water\");\n    }\n});\nsoup.add(\"onions\");\nsoup.add(\"salt\");\nsoup.contents; // will contain: water, onions, salt\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>object</span> : Object<div class='sub-desc'><p>The target object</p>\n</div></li><li><span class='pre'>methodName</span> : String<div class='sub-desc'><p>Name of the method to override</p>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>Function with the new behavior.  It will\nbe called with the same arguments as the original method.  The\nreturn value of this function will be the return value of the\nnew method.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope to execute the interceptor function. Defaults to the object.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>The new function just created.</p>\n</div></li></ul></div></div></div><div id='method-interval' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-interval' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-interval' class='name expandable'>interval</a>( <span class='pre'>fn, millis, [scope], [args], [appendArgs]</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Calls this function repeatedly at a given interval, optionally in a specific scope. ...</div><div class='long'><p>Calls this function repeatedly at a given interval, optionally in a specific scope.</p>\n\n<p><a href=\"#!/api/CLI-method-defer\" rel=\"CLI-method-defer\" class=\"docClass\">CLI.defer</a> is alias for <a href=\"#!/api/CLI.Function-method-defer\" rel=\"CLI.Function-method-defer\" class=\"docClass\">CLI.Function.defer</a></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The function to defer.</p>\n</div></li><li><span class='pre'>millis</span> : Number<div class='sub-desc'><p>The number of milliseconds for the <code>setInterval</code> call</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the function is executed.\n<strong>If omitted, defaults to the browser window.</strong></p>\n</div></li><li><span class='pre'>args</span> : Array (optional)<div class='sub-desc'><p>Overrides arguments for the call. Defaults to the arguments passed by the caller.</p>\n</div></li><li><span class='pre'>appendArgs</span> : Boolean/Number (optional)<div class='sub-desc'><p>If <code>true</code> args are appended to call args instead of overriding,\nor, if a number, then the args are inserted at the specified position.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>The interval id that can be used with <code>clearInterval</code>.</p>\n</div></li></ul></div></div></div><div id='method-pass' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Function'>CLI.Function</span><br/><a href='source/Function.html#CLI-Function-method-pass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Function-method-pass' class='name expandable'>pass</a>( <span class='pre'>fn, args, [scope]</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a new function from the provided fn, the arguments of which are pre-set to args. ...</div><div class='long'><p>Create a new function from the provided <code>fn</code>, the arguments of which are pre-set to <code>args</code>.\nNew arguments passed to the newly created callback when it's invoked are appended after the pre-set ones.\nThis is especially useful when creating callbacks.</p>\n\n<p>For example:</p>\n\n<pre><code>var originalFunction = function(){\n    alert(<a href=\"#!/api/CLI.Array-method-from\" rel=\"CLI.Array-method-from\" class=\"docClass\">CLI.Array.from</a>(arguments).join(' '));\n};\n\nvar callback = <a href=\"#!/api/CLI.Function-method-pass\" rel=\"CLI.Function-method-pass\" class=\"docClass\">CLI.Function.pass</a>(originalFunction, ['Hello', 'World']);\n\ncallback(); // alerts 'Hello World'\ncallback('by Me'); // alerts 'Hello World by Me'\n</code></pre>\n\n<p><a href=\"#!/api/CLI-method-pass\" rel=\"CLI-method-pass\" class=\"docClass\">CLI.pass</a> is alias for <a href=\"#!/api/CLI.Function-method-pass\" rel=\"CLI.Function-method-pass\" class=\"docClass\">CLI.Function.pass</a></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The original function.</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>The arguments to pass to new callback.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the function is executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'><p>The new callback function.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});