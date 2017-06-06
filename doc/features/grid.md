# Grid

### Markup

~~~~
<grid>
  <row>
    <column size="1/3"></column>
    <column size="1/3"></column>
    <column size="1/3"></column>
  </row>
</grid>
~~~~

~~~~
<grid mod="flex">
  <row mod="center">
    <column size="1/5"></column>
    <column></column>
  </row>
</grid>
~~~~

~~~~
<grid mod="table">
  <row>
    <column size="1/5" mod="bottom"></column>
    <column></column>
  </row>
</grid>
~~~~

~~~~
<grid>
  <row>
    <column size="1/5" size-tablet="1/3"></column>
    <column size-mobile="1/2"></column>
  </row>
</grid>
~~~~

~~~~
<div grid>
  <div row>
    <div col="1/3"></div>
  </div>
</div>
~~~~

### Special values

no padding, no float

~~~~
<grid>
  <column size="0"></column>
</grid>
~~~~

hide on tablet

~~~~
<grid>
  <column size="1/3" size-tablet="none"></column>
</grid>
~~~~

width auto

~~~~
<grid>
  <column size="auto"></column>
</grid>
~~~~

offset (automaticly hide on phone)

~~~~
<grid>
  <column offset-by="1/4"></column>
</grid>
~~~~

### SASS
 
~~~~
<div class="container">
  <div class="items">
    <div class="item"></div>
    <div class="item"></div>
  </div>
</div>
~~~~
 
~~~
.container{ @include grid() }
.items{ @include row() }
.item{ @include column(1/5) }
~~~
