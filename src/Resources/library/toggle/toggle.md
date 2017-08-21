# Toggle
   
######file: js/metabolism/toggle.js

Simple toggle management system

~~~~
 <div toggles="list">
    <ul>
      <li>
        <a>Item 1</a>
        <ul>
          <li><a href="">Sub item</a></li>
        </ul>
      </li>
      <li>
        <a>Item 2</a>
        <ul>
          <li><a href="">Sub item</a></li>
        </ul>
      </li>
    </ul>
  </div>
~~~~

When using anchor, id must start with 'toggle'

~~~~
<div toggles="link">
    <a href="#toggle1">Item 1</a>
    <div id="toggle1">Lorem ipsum</div>
    <a href="#toggle2">Item 2</a>
    <div id="toggle2">Lorem ipsum</div>
</div>
~~~~

### Parameters

~~~~
<div toggles data-auto_close="true">
    <a href="#toggle1">Item 1</a>
    <div id="toggle1">Lorem ipsum</div>
    <a href="#toggle2">Item 2</a>
    <div id="toggle2">Lorem ipsum</div>
</div>
~~~~

Available parameters :

- auto_close
- open_first
- animate
- speed
- easing
- activate ( phone, desktop, mobile, tablet)
