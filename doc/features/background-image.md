# Background image

~~~~
<div background="http://image.url"></div>
~~~~

Convert to

~~~~
<div style="background-image:url('http://image.url')"></div>
~~~~

Also available for project media folder 

~~~~
<div page-background="monimage.jpg"></div>
~~~~

Convert to

~~~~
<div style="background-image:url('{{ asset_url('/media/page/monimage.jpg') }}')"></div>
~~~~

Also available in SASS

~~~
 .class{ background-image: page-url('mon-image.jpg') }
~~~

Available for block, icon, page, component, tmp, misc folder
