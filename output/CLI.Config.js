Ext.data.JsonP.CLI_Config({"tagname":"class","name":"CLI.Config","autodetected":{},"files":[{"filename":"Config.js","href":"Config.html#CLI-Config"}],"private":true,"members":[{"name":"cached","tagname":"cfg","owner":"CLI.Config","id":"cfg-cached","meta":{"private":true}},{"name":"lazy","tagname":"cfg","owner":"CLI.Config","id":"cfg-lazy","meta":{"private":true}},{"name":"merge","tagname":"cfg","owner":"CLI.Config","id":"cfg-merge","meta":{}},{"name":"name","tagname":"property","owner":"CLI.Config","id":"property-name","meta":{"private":true,"readonly":true}},{"name":"names","tagname":"property","owner":"CLI.Config","id":"property-names","meta":{"private":true,"readonly":true}},{"name":"getInternalName","tagname":"method","owner":"CLI.Config","id":"method-getInternalName","meta":{}},{"name":"mergeSets","tagname":"method","owner":"CLI.Config","id":"method-mergeSets","meta":{"private":true}}],"alternateClassNames":[],"aliases":{},"id":"class-CLI.Config","short_doc":"This class manages a config property. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/Config.html#CLI-Config' target='_blank'>Config.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>This class manages a config property. Instances of this type are created and cached as\nclasses declare their config properties. One instance of this class is created per\nconfig property name.</p>\n\n<pre><code> <a href=\"#!/api/CLI-method-define\" rel=\"CLI-method-define\" class=\"docClass\">CLI.define</a>('MyClass', {\n     config: {\n         foo: 42\n     }\n });\n</code></pre>\n\n<p>This uses the cached <code><a href=\"#!/api/CLI.Config\" rel=\"CLI.Config\" class=\"docClass\">CLI.Config</a></code> instance for the \"foo\" property.</p>\n\n<p>When config properties apply options to config properties a prototype chained object is\ncreated from the cached instance. For example:</p>\n\n<pre><code> <a href=\"#!/api/CLI-method-define\" rel=\"CLI-method-define\" class=\"docClass\">CLI.define</a>('MyClass', {\n     config: {\n         foo: {\n             $value: 42,\n             lazy: true\n         }\n     }\n });\n</code></pre>\n\n<p>This creates a prototype chain to the cached \"foo\" instance of <code><a href=\"#!/api/CLI.Config\" rel=\"CLI.Config\" class=\"docClass\">CLI.Config</a></code> and applies\nthe <code>lazy</code> option to that new instance. This chained instance is then kept by the\n<code><a href=\"#!/api/CLI.Configurator\" rel=\"CLI.Configurator\" class=\"docClass\">CLI.Configurator</a></code> for that class.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-cached' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-cfg-cached' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-cfg-cached' class='name expandable'>cached</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>When set as true the config property will be stored on the class prototype once\nthe first instance has had a chance t...</div><div class='long'><p>When set as <code>true</code> the config property will be stored on the class prototype once\nthe first instance has had a chance to process the default value.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-lazy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-cfg-lazy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-cfg-lazy' class='name expandable'>lazy</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>When set as true the config property will not be immediately initialized during\nthe initConfig call. ...</div><div class='long'><p>When set as <code>true</code> the config property will not be immediately initialized during\nthe <code>initConfig</code> call.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-merge' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-cfg-merge' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-cfg-merge' class='name expandable'>merge</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>This function if supplied will be called as classes or instances provide values\nthat need to be combined with inherit...</div><div class='long'><p>This function if supplied will be called as classes or instances provide values\nthat need to be combined with inherited values. The function should return the\nvalue that will be the config value. Further calls may receive such returned\nvalues as <code>oldValue</code>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>newValue</span> : Mixed<div class='sub-desc'><p>The new value to merge with the old.</p>\n</div></li><li><span class='pre'>oldValue</span> : Mixed<div class='sub-desc'><p>The current value prior to <code>newValue</code> being merged.</p>\n</div></li><li><span class='pre'>target</span> : Mixed<div class='sub-desc'><p>The class or instance to which the merged config value\nwill be applied.</p>\n</div></li><li><span class='pre'>mixinClass</span> : <a href=\"#!/api/CLI.Class\" rel=\"CLI.Class\" class=\"docClass\">CLI.Class</a><div class='sub-desc'><p>The mixin providing the <code>newValue</code> or <code>null</code> if\nthe <code>newValue</code> is not being provided by a mixin.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-name' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-property-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-property-name' class='name expandable'>name</a> : String<span class=\"signature\"><span class='private' >private</span><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>The name of this config property.</p>\n</div><div class='long'><p>The name of this config property.</p>\n</div></div></div><div id='property-names' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-property-names' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-property-names' class='name expandable'>names</a> : Object<span class=\"signature\"><span class='private' >private</span><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'>This object holds the cached names used to lookup properties or methods for this\nconfig property. ...</div><div class='long'><p>This object holds the cached names used to lookup properties or methods for this\nconfig property. The properties of this object are explained in the context of an\nexample property named \"foo\".</p>\n<ul><li><span class='pre'>internal</span> : String<div class='sub-desc'><p>The default backing property (\"_foo\").</p>\n</div></li><li><span class='pre'>initializing</span> : String<div class='sub-desc'><p>The property that is <code>true</code> when the config\nis being initialized (\"isFooInitializing\").</p>\n</div></li><li><span class='pre'>apply</span> : String<div class='sub-desc'><p>The name of the applier method (\"applyFoo\").</p>\n</div></li><li><span class='pre'>update</span> : String<div class='sub-desc'><p>The name of the updater method (\"updateFoo\").</p>\n</div></li><li><span class='pre'>get</span> : String<div class='sub-desc'><p>The name of the getter method (\"getFoo\").</p>\n</div></li><li><span class='pre'>set</span> : String<div class='sub-desc'><p>The name of the setter method (\"setFoo\").</p>\n</div></li><li><span class='pre'>initGet</span> : String<div class='sub-desc'><p>The name of the initializing getter (\"initGetFoo\").</p>\n</div></li><li><span class='pre'>doSet</span> : String<div class='sub-desc'><p>The name of the evented setter (\"doSetFoo\").</p>\n</div></li><li><span class='pre'>changeEvent</span> : String<div class='sub-desc'><p>The name of the change event (\"foochange\").</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-getInternalName' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-method-getInternalName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-method-getInternalName' class='name expandable'>getInternalName</a>( <span class='pre'>target</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the name of the property that stores this config on the given instance or\nclass prototype. ...</div><div class='long'><p>Returns the name of the property that stores this config on the given instance or\nclass prototype.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>target</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-mergeSets' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CLI.Config'>CLI.Config</span><br/><a href='source/Config.html#CLI-Config-method-mergeSets' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CLI.Config-method-mergeSets' class='name expandable'>mergeSets</a>( <span class='pre'>newValue, oldValue, [preserveExisting]</span> ) : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Merges the newValue and the oldValue assuming that these are basically objects\nthe represent sets. ...</div><div class='long'><p>Merges the <code>newValue</code> and the <code>oldValue</code> assuming that these are basically objects\nthe represent sets. For example something like:</p>\n\n<pre><code> {\n     foo: true,\n     bar: true\n }\n</code></pre>\n\n<p>The merge process converts arrays like the following into the above:</p>\n\n<pre><code> [ 'foo', 'bar' ]\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>newValue</span> : String/String[]/Object<div class='sub-desc'>\n</div></li><li><span class='pre'>oldValue</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>preserveExisting</span> : Boolean (optional)<div class='sub-desc'>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{"private":true}});