# Tabs
   
######file: js/metabolism/toggle.js

Simple tab management system

~~~~
<div tabs>
    <nav>
        <a href="#tab1">Item 1</a>
        <a href="#tab2">Item 2</a>
    </nav>
    <div id="tab1">
        Tab Item 1
    </div>
    <div id="tab2">
        Tab Item 2
    </div>
</div>
~~~~

### Parameters

You can transform tab to inline insert

~~~~
<div tabs data-inline="mobile">
    <nav>
        <a href="#tab1">Item 1</a>
        <a href="#tab2">Item 2</a>
    </nav>
    <div id="tab1">
        Tab Item 1
    </div>
    <div id="tab2">
        Tab Item 2
    </div>
</div>
~~~~

Available parameters are mobile, tablet, phone
Id must start with 'tab'
