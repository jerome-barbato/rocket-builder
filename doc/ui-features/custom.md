#Custom

Replace standard select with custom div to allow further personalisation

~~~~
<select>
   <option value="1">Element</option>
</select>
~~~~

Add a placeholder

~~~~
<select placeholder="Select an element">
   <option value="1">Element</option>
</select>
~~~~

Append the custom code to the parent element, else append it to the body

~~~~
<div class="ui-front">
    <select placeholder="Select an element">
       <option value="1">Element</option>
    </select>
</div>
~~~~
