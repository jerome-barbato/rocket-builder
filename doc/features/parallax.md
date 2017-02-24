# Parallax

~~~~
<div parallax="30%"></div>
~~~~

Unit can be percentage, pixel, rem, vh

### Options


~~~~
<div parallax="30rem"></div>
~~~~

When visible the div will translate from 0rem to 30rem

~~~~
<div parallax="!30rem"></div>
~~~~

When visible the div will translate from 30rem to 0

~~~~
<div parallax="-30rem"></div>
~~~~

When visible the div will translate from 0rem to -30rem

~~~~
<div parallax="!-30rem"></div>
~~~~

When visible the div will translate from -30rem to 0

~~~~
<div parallax="30rem" parallax-center="1"></div>
~~~~

When visible the div will translate from -15rem to 15rem

~~~~
<div parallax-container>
    <div parallax="30rem" parallax-gap="0"></div>
</div>
~~~~

Do not use object gap to compute offset, usually when parallax item is within an overflow element

### Mobile

To enable on mobile, in the header add 

~~~
<meta name="parallax-mobile" content="yes">
