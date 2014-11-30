Ext.data.JsonP.global({"tagname":"class","name":"global","alternateClassNames":[],"members":[{"name":"compiled","tagname":"cfg","owner":"global","id":"cfg-compiled","meta":{}},{"name":"disableFormats","tagname":"cfg","owner":"global","id":"cfg-disableFormats","meta":{}},{"name":"","tagname":"property","owner":"global","id":"property-","meta":{}},{"name":"isTemplate","tagname":"property","owner":"global","id":"property-isTemplate","meta":{}},{"name":"re","tagname":"property","owner":"global","id":"property-re","meta":{"private":true}},{"name":"constructor","tagname":"method","owner":"global","id":"method-constructor","meta":{}},{"name":"append","tagname":"method","owner":"global","id":"method-append","meta":{}},{"name":"apply","tagname":"method","owner":"global","id":"method-apply","meta":{}},{"name":"applyOut","tagname":"method","owner":"global","id":"method-applyOut","meta":{}},{"name":"compile","tagname":"method","owner":"global","id":"method-compile","meta":{}},{"name":"functionFactory","tagname":"method","owner":"global","id":"method-functionFactory","meta":{"private":true}},{"name":"insertAfter","tagname":"method","owner":"global","id":"method-insertAfter","meta":{}},{"name":"insertBefore","tagname":"method","owner":"global","id":"method-insertBefore","meta":{}},{"name":"insertFirst","tagname":"method","owner":"global","id":"method-insertFirst","meta":{}},{"name":"overwrite","tagname":"method","owner":"global","id":"method-overwrite","meta":{}},{"name":"set","tagname":"method","owner":"global","id":"method-set","meta":{}},{"name":"from","tagname":"method","owner":"global","id":"static-method-from","meta":{"static":true}}],"aliases":{},"files":[{"filename":"","href":""}],"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><div class='doc-contents'><p>Global variables and functions.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-compiled' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-cfg-compiled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-cfg-compiled' class='name expandable'>compiled</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>True to immediately compile the template. ...</div><div class='long'><p>True to immediately compile the template. Defaults to false.</p>\n</div></div></div><div id='cfg-disableFormats' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-cfg-disableFormats' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-cfg-disableFormats' class='name expandable'>disableFormats</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>True to disable format functions in the template. ...</div><div class='long'><p>True to disable format functions in the template. If the template doesn't contain\nformat functions, setting disableFormats to true will reduce apply time. Defaults to false.</p>\n<p>Defaults to: <code>false</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-property-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-' class='name expandable'></a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Represents an HTML fragment template. ...</div><div class='long'><p>Represents an HTML fragment template. Templates may be <a href=\"#!/api/global-method-compile\" rel=\"global-method-compile\" class=\"docClass\">precompiled</a> for greater performance.</p>\n\n<p>An instance of this class may be created by passing to the constructor either a single argument, or multiple\narguments:</p>\n\n<h1>Single argument: String/Array</h1>\n\n<p>The single argument may be either a String or an Array:</p>\n\n<ul>\n<li><p>String:</p>\n\n<pre><code>var t = new <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a>(\"&lt;div&gt;Hello {0}.&lt;/div&gt;\");\nt.<a href=\"#!/api/global-method-append\" rel=\"global-method-append\" class=\"docClass\">append</a>('some-element', ['foo']);\n</code></pre></li>\n<li><p>Array:</p>\n\n<p>An Array will be combined with <code>join('')</code>.</p>\n\n<pre><code>var t = new <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a>([\n    '&lt;div name=\"{id}\"&gt;',\n        '&lt;span class=\"{cls}\"&gt;{name:trim} {value:ellipsis(10)}&lt;/span&gt;',\n    '&lt;/div&gt;',\n]);\nt.<a href=\"#!/api/global-method-compile\" rel=\"global-method-compile\" class=\"docClass\">compile</a>();\nt.<a href=\"#!/api/global-method-append\" rel=\"global-method-append\" class=\"docClass\">append</a>('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});\n</code></pre></li>\n</ul>\n\n\n<h1>Multiple arguments: String, Object, Array, ...</h1>\n\n<p>Multiple arguments will be combined with <code>join('')</code>.</p>\n\n<pre><code>var t = new <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a>(\n    '&lt;div name=\"{id}\"&gt;',\n        '&lt;span class=\"{cls}\"&gt;{name} {value}&lt;/span&gt;',\n    '&lt;/div&gt;',\n    // a configuration object:\n    {\n        compiled: true,      // <a href=\"#!/api/global-method-compile\" rel=\"global-method-compile\" class=\"docClass\">compile</a> immediately\n    }\n);\n</code></pre>\n\n<h1>Notes</h1>\n\n<ul>\n<li>For a list of available format functions, see <a href=\"#!/api/CLI.util.Format\" rel=\"CLI.util.Format\" class=\"docClass\">CLI.util.Format</a>.</li>\n<li><code>disableFormats</code> reduces <code><a href=\"#!/api/global-method-apply\" rel=\"global-method-apply\" class=\"docClass\">apply</a></code> time when no formatting is required.</li>\n</ul>\n\n</div></div></div><div id='property-isTemplate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-property-isTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-isTemplate' class='name expandable'>isTemplate</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>true in this class to identify an object as an instantiated Template, or subclass thereof. ...</div><div class='long'><p><code>true</code> in this class to identify an object as an instantiated Template, or subclass thereof.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-re' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-property-re' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-re' class='name expandable'>re</a> : RegExp<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Regular expression used to extract tokens. ...</div><div class='long'><p>Regular expression used to extract tokens.</p>\n\n<p>Finds the following expressions within a format string</p>\n\n<pre><code>                {AND?}\n                /   \\\n              /       \\\n            /           \\\n          /               \\\n       OR                  AND?\n      /  \\                 / \\\n     /    \\               /   \\\n    /      \\             /     \\\n</code></pre>\n\n<p>   (\\d+)  ([a-z<em>][\\w-]*)   /       \\\n    index       name       /         \\\n                          /           \\\n                         /             \\\n                  :([a-z</em>.]<em>)   (?:((.</em>?)?))?\n                     formatFn           args</p>\n\n<p>Numeric index or (name followed by optional formatting function and args)</p>\n</div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/global-method-constructor' class='name expandable'>global</a>( <span class='pre'>html, [config]</span> ) : <a href=\"#!/api/global\" rel=\"global\" class=\"docClass\">global</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates new template. ...</div><div class='long'><p>Creates new template.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>html</span> : String...<div class='sub-desc'><p>List of strings to be concatenated into template.\nAlternatively an array of strings can be given, but then no config object may be passed.</p>\n</div></li><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Config object</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/global\" rel=\"global\" class=\"docClass\">global</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-append' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-append' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-append' class='name expandable'>append</a>( <span class='pre'>el, values, [returnElement]</span> ) : HTMLElement/CLI.dom.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the supplied values to the template and appends the new node(s) to the specified el. ...</div><div class='long'><p>Applies the supplied <code>values</code> to the template and appends the new node(s) to the specified <code>el</code>.</p>\n\n<p>For example usage see <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template class docs</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : String/HTMLElement/CLI.dom.Element<div class='sub-desc'><p>The context element</p>\n</div></li><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. See applyTemplate for details.</p>\n</div></li><li><span class='pre'>returnElement</span> : Boolean (optional)<div class='sub-desc'><p>true to return an CLI.Element.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement/CLI.dom.Element</span><div class='sub-desc'><p>The new node or Element</p>\n</div></li></ul></div></div></div><div id='method-apply' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-apply' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-apply' class='name expandable'>apply</a>( <span class='pre'>values</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns an HTML fragment of this template with the specified values applied. ...</div><div class='long'><p>Returns an HTML fragment of this template with the specified values applied.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. Can be an array if your params are numeric:</p>\n\n<pre><code>var tpl = new <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a>('Name: {0}, Age: {1}');\ntpl.apply(['John', 25]);\n</code></pre>\n\n<p>or an object:</p>\n\n<pre><code>var tpl = new <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a>('Name: {name}, Age: {age}');\ntpl.apply({name: 'John', age: 25});\n</code></pre>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>The HTML fragment</p>\n</div></li></ul></div></div></div><div id='method-applyOut' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-applyOut' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-applyOut' class='name expandable'>applyOut</a>( <span class='pre'>values, out</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Appends the result of this template to the provided output array. ...</div><div class='long'><p>Appends the result of this template to the provided output array.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. See <a href=\"#!/api/global-method-apply\" rel=\"global-method-apply\" class=\"docClass\">apply</a>.</p>\n</div></li><li><span class='pre'>out</span> : Array<div class='sub-desc'><p>The array to which output is pushed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'><p>The given out array.</p>\n</div></li></ul></div></div></div><div id='method-compile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-compile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-compile' class='name expandable'>compile</a>( <span class='pre'></span> ) : <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Compiles the template into an internal function, eliminating the RegEx overhead. ...</div><div class='long'><p>Compiles the template into an internal function, eliminating the RegEx overhead.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-functionFactory' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Util.html#global-method-functionFactory' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-functionFactory' class='name expandable'>functionFactory</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-insertAfter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-insertAfter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-insertAfter' class='name expandable'>insertAfter</a>( <span class='pre'>el, values, [returnElement]</span> ) : HTMLElement/CLI.dom.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the supplied values to the template and inserts the new node(s) after el. ...</div><div class='long'><p>Applies the supplied values to the template and inserts the new node(s) after el.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : String/HTMLElement/CLI.dom.Element<div class='sub-desc'><p>The context element</p>\n</div></li><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. See applyTemplate for details.</p>\n</div></li><li><span class='pre'>returnElement</span> : Boolean (optional)<div class='sub-desc'><p>true to return a CLI.Element.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement/CLI.dom.Element</span><div class='sub-desc'><p>The new node or Element</p>\n</div></li></ul></div></div></div><div id='method-insertBefore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-insertBefore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-insertBefore' class='name expandable'>insertBefore</a>( <span class='pre'>el, values, [returnElement]</span> ) : HTMLElement/CLI.dom.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the supplied values to the template and inserts the new node(s) before el. ...</div><div class='long'><p>Applies the supplied values to the template and inserts the new node(s) before el.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : String/HTMLElement/CLI.dom.Element<div class='sub-desc'><p>The context element</p>\n</div></li><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. See applyTemplate for details.</p>\n</div></li><li><span class='pre'>returnElement</span> : Boolean (optional)<div class='sub-desc'><p>true to return a CLI.Element.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement/CLI.dom.Element</span><div class='sub-desc'><p>The new node or Element</p>\n</div></li></ul></div></div></div><div id='method-insertFirst' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-insertFirst' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-insertFirst' class='name expandable'>insertFirst</a>( <span class='pre'>el, values, [returnElement]</span> ) : HTMLElement/CLI.dom.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the supplied values to the template and inserts the new node(s) as the first child of el. ...</div><div class='long'><p>Applies the supplied values to the template and inserts the new node(s) as the first child of el.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : String/HTMLElement/CLI.dom.Element<div class='sub-desc'><p>The context element</p>\n</div></li><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. See applyTemplate for details.</p>\n</div></li><li><span class='pre'>returnElement</span> : Boolean (optional)<div class='sub-desc'><p>true to return a CLI.Element.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement/CLI.dom.Element</span><div class='sub-desc'><p>The new node or Element</p>\n</div></li></ul></div></div></div><div id='method-overwrite' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-overwrite' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-overwrite' class='name expandable'>overwrite</a>( <span class='pre'>el, values, [returnElement]</span> ) : HTMLElement/CLI.dom.Element<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the supplied values to the template and overwrites the content of el with the new node(s). ...</div><div class='long'><p>Applies the supplied values to the template and overwrites the content of el with the new node(s).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : String/HTMLElement/CLI.dom.Element<div class='sub-desc'><p>The context element</p>\n</div></li><li><span class='pre'>values</span> : Object/Array<div class='sub-desc'><p>The template values. See applyTemplate for details.</p>\n</div></li><li><span class='pre'>returnElement</span> : Boolean (optional)<div class='sub-desc'><p>true to return a CLI.Element.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement/CLI.dom.Element</span><div class='sub-desc'><p>The new node or Element</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-set' class='name expandable'>set</a>( <span class='pre'>html, [compile]</span> ) : <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the HTML used as the template and optionally compiles it. ...</div><div class='long'><p>Sets the HTML used as the template and optionally compiles it.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>html</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>compile</span> : Boolean (optional)<div class='sub-desc'><p>True to compile the template.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-from' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Template.html#global-static-method-from' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-static-method-from' class='name expandable'>from</a>( <span class='pre'>el, [config]</span> ) : <a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a><span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Creates a template from the passed element's value (display:none textarea, preferred) or innerHTML. ...</div><div class='long'><p>Creates a template from the passed element's value (<em>display:none</em> textarea, preferred) or innerHTML.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : String/HTMLElement<div class='sub-desc'><p>A DOM element or its id</p>\n</div></li><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Config object</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CLI.Template\" rel=\"CLI.Template\" class=\"docClass\">CLI.Template</a></span><div class='sub-desc'><p>The created template</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});