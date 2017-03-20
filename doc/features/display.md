# Display

###### file: vendor/metabolism/hide.scss

hide-on and show-on attributes

Works will standard media queries, defined in media-queries.scss
4k, large, medium, small, tablet, phone, phone-m, phone-s

Also works with js defined `<html>` class, mobile/desktop based on user agent

### Exemples
~~~
<div hide-on="phone">
    I'm on a tablet or desktop
</div>
~~~

~~~
<div show-on="phone">
    I'm on a phone
</div>
~~~