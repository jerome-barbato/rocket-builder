# Media queries

Following Chrome devtools specification, there is several size predefined :

~~~
phone    : 425px
phone-m  : 375px
phone-s  : 320px
tablet   : 768px
small    : 1024px
medium   : 1280px
large    : 1680px
4k       : 2560px
~~~

### From

~~~
@media #{$from-phone}{ }
~~~

compile to

~~~
@media screen and (min-width: 426px){ }
~~~

425 + 1px

### To

~~~
@media #{$to-phone}{ }
~~~

compile to

~~~
@media screen and (max-width: 425px){ }
~~~

### Only

~~~
@media #{$only-phone}{ }
~~~

compile to

~~~
@media screen and (min-width: 425px) and (max-width: 767px){ }
~~~