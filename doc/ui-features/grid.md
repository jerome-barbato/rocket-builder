# Grid

//todo: doc for mixin missing
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
