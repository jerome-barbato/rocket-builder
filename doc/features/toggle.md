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
~~~~
<div toggles="link">
    <a href="#1">Item 1</a>
    <div id="1">Lorem ipsum</div>
    <a href="#2">Item 2</a>
    <div id="2">Lorem ipsum</div>
</div>
~~~~

### Parameters
~~~~
<div toggles data-auto_close="true">
    <a href="#1">Item 1</a>
    <div id="1">Lorem ipsum</div>
    <a href="#2">Item 2</a>
    <div id="2">Lorem ipsum</div>
</div>
~~~~

Available parameters :

- auto_close
- open_first
- animate
- speed
- easing
