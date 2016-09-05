/**
 * Created by dreimus on 01/09/16.
 *
 *
 * @see https://github.com/jquery/jquery/blob/master/test/unit/manipulation.js
 */




describe('jQuery Initialize', function(){

    describe('jQuery native functions behavior', function(){


        /**
         replaceWith
         html
         append
         prepend
         after
         before
         */

        beforeEach(function() {

            loadFixtures('manipulation.html');
        });

        describe('$.replaceWith()', function(){
            var tmp, y, child, child2, set, nonExistent, $div,
                expected = 29;

            it('Should replace with a raw html', function(){

                $("#yahoo").replaceWith( "<b id='replace'>buga</b>" );
                expect( $( "#replace" )[ 0 ]).toExist();
                expect( $( "#yahoo" )[ 0 ]).not.toExist();
            });


            it('Should replace with a DOM html node', function(){

                $( "#anchor2" ).replaceWith(document.getElementById( "first" ));
                expect( $( "#first" )[ 0 ]).toExist();
                expect( $( "#anchor2" )[ 0 ]).not.toExist();
            });


            it('Should replace with appenned htmlNode content', function() {

                $( "#qunit-fixture" ).append( "<div id='bar'><div id='baz'></div></div>" );
                $( "#baz" ).replaceWith( "Baz" );
                expect($("#bar" ).text()).toEqual("Baz");
                expect($( "#baz" )[ 0 ]).not.toExist();
            });


            it('Should replace element with multiple arguments with order preserved', function(){

                $( "#qunit-fixture" ).append( "<div id='bar'><div id='baz'></div></div>" );
                $( "#bar" ).replaceWith( "<div id='yahoi'></div>", "...", "<div id='baz'></div>" );
                expect( $( "#yahoi" )[ 0 ].nextSibling).toEqual($( "#baz" )[ 0 ].previousSibling);
                expect( $( "#bar" ).get() ).toEqual([]);
            });


            it('Should replace with array of elements', function () {

                $( "#google" ).replaceWith( [ document.getElementById( "first" ), document.getElementById( "mark" ) ]);
                expect( $( "#mark, #first" ).get()).toEqual([ document.getElementById( "first" ), document.getElementById( "mark" ) ]);
                expect( $( "#google" )[ 0 ] ).not.toExist();
            });


            it('Should replace element with $ collection', function(){

                var $groups = $( "#mark, #first" ).get();
                $( "#groups" ).replaceWith($( "#mark, #first" ));
                expect( $( "#mark, #first" ).get()).toEqual($groups);
                expect( $( "#groups" )[ 0 ]).not.toExist();
            });


            it('Should replace multiple elements', function(){

                $( "#mark, #first" ).replaceWith( "<span class='replacement'></span><span class='replacement'></span>" );
                expect( $( "#qunit-fixture .replacement" ).length).toEqual(4);
                expect( $( "#mark, #first" ).get()).toEqual([]);
            });


            it('Should replace text node with element', function() {

                tmp = $( "<b>content</b>" )[ 0 ];
                $( "#anchor1" ).contents().replaceWith( tmp );
                expect( $( "#anchor1" ).contents().get()).toEqual([ tmp ]);
            });


            it('Should not trigger old content events but the newest ones.', function(done) {

                tmp = $( "<div/>" ).appendTo( "#qunit-fixture" ).on( "click", function() {

                    expect(true).toBeTruthy();
                } );
                y = $( "<div/>" ).appendTo( "#qunit-fixture" ).on( "click", function() {
                    expect(false).toBeTruthy();
                } );
                child = y.append( "<b>test</b>" ).find( "b" ).on( "click", function() {

                    expect(false).toBeTruthy();
                    return false;
                } );

                y.replaceWith( tmp );

                tmp.trigger( "click" );
                y.trigger( "click" ); // Shouldn't be run
                child.trigger( "click" ); // Shouldn't be run

                y = $( "<div/>" ).appendTo( "#qunit-fixture" ).on( "click", function() {
                    expect(false).toBeTruthy();
                } );
                child2 = y.append( "<u>test</u>" ).find( "u" ).on( "click", function() {
                    expect( true ).toBeTruthy();
                    return false;
                } );

                y.replaceWith( child2 );

                child2.trigger( "click" );

                done();
            });


            it('Should have no effect on a disconnected node', function() {

                set = $( "<div/>" ).replaceWith( "<span>test</span>");
                expect( set[ 0 ].nodeName.toLowerCase()).toEqual("div");
                expect( set.length).toEqual(1);
                expect( set[ 0 ].childNodes.length).toEqual(0);
            });


            it('Should replace with itself or a following sibling', function() {

                child = $( "#qunit-fixture" ).children().first();
                $div = $( "<div class='pathological'/>" ).insertBefore( child );
                $div.replaceWith( $div );
                expect( $( ".pathological", "#qunit-fixture" ).get() ).toEqual($div.get());

                $div.replaceWith( child );

                expect($( "#qunit-fixture" ).children().first().get()).toEqual(child.get());
                    //"Replacement with following sibling (#13810)" );
                expect( $( ".pathological", "#qunit-fixture" ).get()).toEqual([]);
                    //"Replacement with following sibling (context removed)" );
            });


            it('Should not replace non existent elements', function(){

                nonExistent = $( "#does-not-exist" ).replaceWith( "<b>should not throw an error</b>" );
                expect( nonExistent.length ).toEqual(0);
            });

            it('It should be able to replace itself interatively', function(){

                $div = $( "<div class='replacewith'></div>" ).appendTo( "#qunit-fixture" );
                $div.replaceWith( "<div class='replacewith'></div><script ></script>" );

                $( "#qunit-fixture" ).append( "<div id='replaceWith'></div>" );
                expect($( "#qunit-fixture" ).find( "div[id=replaceWith]" ).length).toEqual(1);
                $( "#replaceWith" ).replaceWith( "<div id='replaceWith'></div>" );
                expect( $( "#qunit-fixture" ).find( "div[id=replaceWith]" ).length).toEqual(1);
                $( "#replaceWith" ).replaceWith("<div id='replaceWith'></div>" );
                expect( $( "#qunit-fixture" ).find( "div[id=replaceWith]" ).length).toEqual(1);

            });

        });

        describe('$.html()', function() {

            var actual, expected, tmp,
                div = $( "<div></div>" ),
            fixture = $( "#qunit-fixture" );

            beforeEach(function(){

                div = $( "<div></div>" );
                fixture = $( "#qunit-fixture" );

            });


            function childNodeNames( node ) {
                return $.map( node.childNodes, function( child ) {
                    return child.nodeName.toUpperCase();
                } ).join( " " );
            }

            it('Should create HTML child nodes', function() {

                div.html( "<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>" );
                expect( div.children().length).toEqual(2);
                expect( div.children().children().length).toEqual(1);
            });

            it('Should be able to insert a $ element', function () {

                actual = []; expected = [];
                tmp = $( "<map/>" ).html( "<area alt='area'/>" ).each( function() {
                    expected.push( "AREA" );
                    actual.push( childNodeNames( this ) );
                } );
                expect( expected.length).toEqual(1);
                expect(actual).toEqual(expected);
            });

            it('Should add any type of value', function () {

                expect( (div.html( 5 )) .html() ).toEqual("5");
                expect( (div.html( 0 )) .html() ).toEqual("0");
                expect( (div.html( Infinity )) .html() ).toEqual("Infinity");
                expect( (div.html( NaN )) .html() ).toEqual("");
                expect( (div.html( 1e2 )) .html() ).toEqual("100");
            });

            it('Should passe entities correctly', function () {
                div.html( "&#160;&amp;"  );
                expect(div[ 0 ].innerHTML.replace( /\xA0/, "&nbsp;" )).toEqual("&nbsp;&amp;");
            });

            it('Should escape properly html', function(){

                tmp = "&lt;div&gt;hello1&lt;/div&gt;";
                expect( div.html(tmp).html().replace( />/g, "&gt;" )).toEqual(tmp);
                tmp = "x" + tmp;
                expect( div.html(tmp).html().replace( />/g, "&gt;" )).toEqual(tmp);
                tmp = " " + tmp.slice( 1 );
                expect( div.html(tmp).html().replace( />/g, "&gt;" )).toEqual(tmp);

            });

            it('Should set containing element, text node, comment', function() {

                actual = []; expected = []; tmp = {};
                $( "#nonnodes" ).contents().html( "<b>bold</b>" ).each( function() {
                    var html = $( this ).html();
                    tmp[ this.nodeType ] = true;
                    expected.push( this.nodeType === 1 ? "<b>bold</b>" : undefined );
                    actual.push( html ? html.toLowerCase() : html );
                } );
                expect(actual).toEqual(expected);
                expect(tmp[ 1 ]).toBeTruthy();
                expect(tmp[ 3 ]).toBeTruthy();
                expect(tmp[ 8 ]).toBeTruthy();
            });

            it('Should have correct childNodes after setting HTML', function () {
                actual = []; expected = [];
                fixture.children( "div" ).html( "<b>test</b>" ).each( function() {
                    expected.push( "B" );
                    actual.push( childNodeNames( this ) );
                } );
                expect(expected.length).toEqual(7);
                expect(actual).toEqual(expected);
            });

            it('Should add the inserted style element', function () {
                actual = []; expected = [];
                fixture.html( "<style>.foobar{color:green;}</style>" ).each( function() {
                    expected.push( "STYLE" );
                    actual.push( childNodeNames( this ) );
                } );
                expect(expected.length).toEqual(1);
                expect(actual).toEqual(expected);
            });

            it('It should select option correctly', function () {
                fixture.html( "<select/>" );
                $( "#qunit-fixture select" ).html("<option>O1</option><option selected='selected'>O2</option><option>O3</option>" );
                expect( $( "#qunit-fixture select" ).val()).toEqual("O2");
            });

            it('Should add all script tags properly', function () {
                tmp = fixture.html(
                    [
                        "<script type='something/else'>expect(false).toBeTruthy()</script>",
                        "<script type='text/javascript'>expect( true).toBeTruthy()</script>",
                        "<script type='text/ecmascript'>expect( true).toBeTruthy()</script>",
                        "<script>expect( true).toBeTruthy()</script>",
                        "<div>",
                        "<script type='something/else'>expect(false).toBeTruthy()</script>",
                        "<script type='text/javascript'>expect( true).toBeTruthy()</script>",
                        "<script type='text/ecmascript'>expect( true).toBeTruthy()</script>",
                        "<script>expect( true).toBeTruthy()</script>",
                        "</div>"
                    ].join( "" )
                ).find( "script" );
                expect( tmp.length).toEqual(8);
                expect( tmp[ 0 ].type).toEqual("something/else");
                expect( tmp[ 1 ].type).toEqual("text/javascript");
            });

            it('Should let scripts to be executed in order', function () {

                fixture.html( "<script type='text/javascript'>expect(true).toBeTruthy();</script>" );
                fixture.html( "<script type='text/javascript'>expect(true).toBeTruthy();</script>" );
                fixture.html( "<script type='text/javascript'>expect(true).toBeTruthy();</script>" );
                fixture.html( "<form><script type='text/javascript'>expect(true).toBeTruthy();</script></form>" );

                $.scriptorder = 0;
                fixture.html( [
                    "<script>",
                    "expect( $('#scriptorder').length).toEqual(1);",
                    "expect( $.scriptorder++).toEqual(0);",
                    "</script>",
                    "<span id='scriptorder'><script>expect( $.scriptorder++ ).toEqual(1);</script></span>",
                    "<script>expect( $.scriptorder++).toEqual(2);</script>"
                ].join( "" ) );

                fixture.html( fixture.text() );
                expect( /^[^<]*[^<\s][^<]*$/.test( fixture.html() )).toBeTruthy();
            })

        });

        describe('$.append', function(){
            var defaultText, result, message, iframe, iframeDoc, j, d,
                $input, $radioChecked, $radioUnchecked, $radioParent, $map, $table;

            it('Should append html options to select element', function(){
                defaultText = "Try them out:";
                result = $( "#first" ).append( "<b>buga</b>");
                expect( result.text()).toEqual(defaultText + "buga");
                expect( $( "#select3" ).append( "<option value='appendTest'>Append Test</option>" ).find( "option:last-child" ).attr( "value" )).toEqual("appendTest");

            });

            it('Append a radio, selected, named, with HTML5 syntax', function() {
                $( "#qunit-fixture form" ).append( "<input name='radiotest' type='radio' checked='checked' />");
                $( "#qunit-fixture form input[name=radiotest]" ).each( function() {
                    expect( $( this ).is( ":checked" )).toBeTruthy();
                } ).remove();

                $( "#qunit-fixture form" ).append( "<input name='radiotest2' type='radio' checked    =   'checked' />");
                $( "#qunit-fixture form input[name=radiotest2]" ).each( function() {
                    expect( $( this ).is( ":checked" )).toBeTruthy();
                } ).remove();

                $( "#qunit-fixture form" ).append( "<input name='radiotest3' type='radio' checked />");
                $( "#qunit-fixture form input[name=radiotest3]" ).each( function() {
                    expect( $( this ).is( ":checked" )).toBeTruthy();
                } ).remove();

                $( "#qunit-fixture form" ).append( "<input type='radio' checked='checked' name='radiotest4' />");
                $( "#qunit-fixture form input[name=radiotest4]" ).each( function() {
                    expect( $( this ).is( ":checked" )).toBeTruthy();
                } ).remove();
            });
            /*


             message = "Test for appending a DOM node to the contents of an iframe";
             iframe = $( "#iframe" )[ 0 ];
             iframeDoc = iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document;

             try {
             if ( iframeDoc && iframeDoc.body ) {
             assert.equal( $( iframeDoc.body ).append( valueObj( "<div id='success'>test</div>" ) )[ 0 ].lastChild.id, "success", message );
             } else {
             assert.ok( true, message + " - can't test" );
             }
             } catch ( e ) {
             assert.strictEqual( e.message || e, undefined, message );
             }

             $( "<fieldset/>" ).appendTo( "#form" ).append( valueObj( "<legend id='legend'>test</legend>" ) );
             assert.t( "Append legend", "#legend", [ "legend" ] );

             $map = $( "<map/>" ).append( valueObj( "<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.$.com/' alt='$'>" ) );

             assert.equal( $map[ 0 ].childNodes.length, 1, "The area was inserted." );
             assert.equal( $map[ 0 ].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

             $( "#select1" ).append( valueObj( "<OPTION>Test</OPTION>" ) );
             assert.equal( $( "#select1 option:last-child" ).text(), "Test", "Appending OPTION (all caps)" );

             $( "#select1" ).append( valueObj( "<optgroup label='optgroup'><option>optgroup</option></optgroup>" ) );
             assert.equal( $( "#select1 optgroup" ).attr( "label" ), "optgroup", "Label attribute in newly inserted optgroup is correct" );
             assert.equal( $( "#select1 option" ).last().text(), "optgroup", "Appending optgroup" );

             $table = $( "#table" );

             $.each( "thead tbody tfoot colgroup caption tr th td".split( " " ), function( i, name ) {
             $table.append( valueObj( "<" + name + "/>" ) );
             assert.equal( $table.find( name ).length, 1, "Append " + name );
             assert.ok( $.parseHTML( "<" + name + "/>" ).length, name + " wrapped correctly" );
             } );

             $( "#table colgroup" ).append( valueObj( "<col/>" ) );
             assert.equal( $( "#table colgroup col" ).length, 1, "Append col" );

             $( "#form" )
             .append( valueObj( "<select id='appendSelect1'></select>" ) )
             .append( valueObj( "<select id='appendSelect2'><option>Test</option></select>" ) );
             assert.t( "Append Select", "#appendSelect1, #appendSelect2", [ "appendSelect1", "appendSelect2" ] );

             assert.equal( "Two nodes", $( "<div />" ).append( "Two", " nodes" ).text(), "Appending two text nodes (#4011)" );
             assert.equal( $( "<div />" ).append( "1", "", 3 ).text(), "13", "If median is false-like value, subsequent arguments should not be ignored" );

             // using contents will get comments regular, text, and comment nodes
             j = $( "#nonnodes" ).contents();
             d = $( "<div/>" ).appendTo( "#nonnodes" ).append( j );

             assert.equal( $( "#nonnodes" ).length, 1, "Check node,textnode,comment append moved leaving just the div" );
             assert.equal( d.contents().length, 3, "Check node,textnode,comment append works" );
             d.contents().appendTo( "#nonnodes" );
             d.remove();
             assert.equal( $( "#nonnodes" ).contents().length, 3, "Check node,textnode,comment append cleanup worked" );

             $input = $( "<input type='checkbox'/>" ).prop( "checked", true ).appendTo( "#testForm" );
             assert.equal( $input[ 0 ].checked, true, "A checked checkbox that is appended stays checked" );

             $radioChecked = $( "input[type='radio'][name='R1']" ).eq( 1 );
             $radioParent = $radioChecked.parent();
             $radioUnchecked = $( "<input type='radio' name='R1' checked='checked'/>" ).appendTo( $radioParent );
             $radioChecked.trigger( "click" );
             $radioUnchecked[ 0 ].checked = false;

             $( "<div/>" ).insertBefore( $radioParent ).append( $radioParent );

             assert.equal( $radioChecked[ 0 ].checked, true, "Reappending radios uphold which radio is checked" );
             assert.equal( $radioUnchecked[ 0 ].checked, false, "Reappending radios uphold not being checked" );

             assert.equal( $( "<div/>" ).append( valueObj( "option<area/>" ) )[ 0 ].childNodes.length, 2, "HTML-string with leading text should be processed correctly" );
             */
        });

    });

});

/*


 it('Should add the class "initialized" to the element.', function(){

 $('.random_el').initialize(function(done) {
 $(this).addClass("initialized");
 });
 $main.append(randomEl);
 expect( $('.random_el').hasClass('initialized') ).toBe(true);
 });

 it('Should trigger the event exacly four times', function(done) {

 var counter = 0;

 $(document).on('DOMNodeUpdated', function() {
 counter++;
 });

 $('.random_el').initialize(function() { });

 $main.append(randomEl);
 $main.html(randomEl);
 $main.after(randomEl);

 setTimeout(function(){

 expect(counter).toEqual(4);
 done();
 });
 });

 it('Should trigger the event recursively', function (done) {

 })


 var randomEl    = "<div class='random_el'><p>This is a random element.</p></div>",
 randomEl2   = "<div><p class='random_el'>This is a random element.</p></div>",
 randomEl3   = "<div><p class='random_el'>This is a random element.</p><p class='random_el'>This is a random element.</p></div>",
 randomEl4   = "<div class='random_el'>This is a random element.</div><div class='random_el'>This is a random element.</div>",
 randomEl5   = "<div><p class='random_el'>This is a random element.</p></div><div class='random_el'>This is a random element.</div>",
 randomEl6   = "<template><p class='random_el'>This is a random element.</p></template>",
 randomEl7   = "<template class='random_el'>This is a random element.</template>",
 randomEl8   = "<template class='random_el'><p class='random_el'>This is a random element.</p></template>",
 randomEl9   = "<div><p class='random_el'>This is a random element.</p><p class='random_el1'>This is a random element.</p></div>",
 randomEl10   = "<div><p class='random_el'>This is a random element.<span class='random_el1'>This is a random element.</span></p></div>",
 randomEl11   = "<div><p class='random_el random_el1'>This is a random element.</p></div>",
 main        = false;

 <div class="toto"></div>



 <div directive="toto"></div>


 $('body').append('<div class="toto"></div>');
 $('.toto').append('<div class="toto"></div>');
 $('.toto').replaceWith('<div class="toto"></div>');


 */