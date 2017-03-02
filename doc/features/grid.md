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

### SASS
 
 ~~~~
 <div class="item">
     <div grid>
         <div row>
             <div col="1/3"></div>
         </div>
     </div>
 </div>
 ~~~~
 
~~~
.item{

   @include col{
      background:#eee
   }
   @include row{
      background:#fff
   }
   @include grid{
      border:1px solid #000
   }
}

~~~
