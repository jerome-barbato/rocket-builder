/**
 * Created by dreimus on 01/09/16.
 *
 *
 * @see https://github.com/jquery/jquery/blob/master/test/unit/manipulation.js
 */




describe('jQuery Initialize', function(){

    describe('jQuery native functions behavior', function(){

        /**
         *
         * @param value
         * @returns {*}
         */
        function manipulationBareObj( value ) {
            return value;
        }

        /**
         *
         * @param value
         * @returns {Function}
         */
        function manipulationFunctionReturningObj( value ) {
            return function() {
                return value;
            };
        }

        /**
         replaceWith
         html
         append
         prepend
         after
         before
         */

        beforeEach(function() {

            loadFixtures('core/polyfill/jquery.initialize.js', 'manipulation.html');
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


            it('Should replace with appened htmlNode content', function() {

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

        describe('$.append()', function(){
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

            it('Should append a DOM node to the contents of an iframe', function(){

                message = "Test for appending a DOM node to the contents of an iframe";
                iframe = $( "#iframe" )[ 0 ];
                iframeDoc = iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document;

                try {
                    if ( iframeDoc && iframeDoc.body ) {
                        expect($( iframeDoc.body ).append( "<div id='success'>test</div>" )[ 0 ].lastChild.id).toEqual("success");
                    } else {
                        expect(true).toBeTruthy();
                    }
                } catch ( e ) {
                    expect(e.message || e).toEqual(undefined);
                }

            });

            it('Should be able to insert areas', function() {

                appendLoadFixtures('testinit.js');

                $( "<fieldset/>" ).appendTo( "#form" ).append(  "<legend id='legend'>test</legend>" );
                jQueryHelper.t( "Append legend", "#legend", [ "legend" ] );

                $map = $( "<map/>" ).append( "<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.$.com/' alt='$'>" );

                expect( $map[ 0 ].childNodes.length).toEqual(1);
                expect( $map[ 0 ].firstChild.nodeName.toLowerCase()).toEqual("area");
            });

            it('Should be able to insert optgroup', function() {

                $( "#select1" ).append( "<OPTION>Test</OPTION>" );
                expect( $( "#select1 option:last-child" ).text()).toEqual("Test");

                $( "#select1" ).append( "<optgroup label='optgroup'><option>optgroup</option></optgroup>" );
                expect( $( "#select1 optgroup" ).attr( "label" )).toEqual("optgroup");
                expect( $( "#select1 option" ).last().text()).toEqual("optgroup");
            });

            it('Should properly handle complex table process', function() {

                $table = $( "#table" );

                $.each( "thead tbody tfoot colgroup caption tr th td".split( " " ), function( i, name ) {
                    $table.append( "<" + name + "/>" );
                    expect( $table.find( name ).length).toEqual(1);
                    expect( $.parseHTML( "<" + name + "/>" ).length).toBeTruthy();
                } );

                $( "#table colgroup" ).append( "<col/>" );
                expect( $( "#table colgroup col" ).length).toEqual(1);
            });

            it('Should check node,textnode,comment append moved leaving just the div', function () {


                appendLoadFixtures('testinit.js');
                $( "#form" )
                    .append( "<select id='appendSelect1'></select>" )
                    .append( "<select id='appendSelect2'><option>Test</option></select>" );
                jQueryHelper.t( "Append Select", "#appendSelect1, #appendSelect2", [ "appendSelect1", "appendSelect2" ] );

                expect( "Two nodes").toEqual($( "<div />" ).append( "Two", " nodes" ).text());
                expect( $( "<div />" ).append( "1", "", 3 ).text()).toEqual("13");

                // using contents will get comments regular, text, and comment nodes
                j = $( "#nonnodes" ).contents();
                d = $( "<div/>" ).appendTo( "#nonnodes" ).append( j );

                expect( $( "#nonnodes" ).length ).toEqual(1);
                expect( d.contents().length ).toEqual(3);
                d.contents().appendTo( "#nonnodes" );
                d.remove();
                expect( $( "#nonnodes" ).contents().length).toEqual(3);
            });

            it('Should append element with stayed checked status', function() {

                $input = $( "<input type='checkbox'/>" ).prop( "checked", true ).appendTo( "#testForm" );
                expect( $input[ 0 ].checked ).toBeTruthy();

                $radioChecked = $( "input[type='radio'][name='R1']" ).eq( 1 );
                $radioParent = $radioChecked.parent();
                $radioUnchecked = $( "<input type='radio' name='R1' checked='checked'/>" ).appendTo( $radioParent );
                $radioChecked.trigger( "click" );
                $radioUnchecked[ 0 ].checked = false;

                $( "<div/>" ).insertBefore( $radioParent ).append( $radioParent );

                expect( $radioChecked[ 0 ].checked).toBeTruthy();
                expect( $radioUnchecked[ 0 ].checked).toBeFalsy();

                var $div = $( "<div/>" ).append( "option<area/>" );
                expect( $div[ 0 ].childNodes.length).toEqual(2);
            });

        });

        describe('$.prepend()', function() {

            it('Should handle a String', function(){
                var result, expected;
                expected = "Try them out:";
                result = $( "#first" ).prepend( "<b>buga</b>" );
                expect( result.text()).toEqual("buga" + expected);
                expect( $( "#select3" ).prepend( "<option value='prependTest'>Prepend Test</option>"  ).find( "option:first-child" ).attr( "value" )).toEqual("prependTest");
            });

            it( "Should prepend(Element)", function() {

                var expected;
                expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
                $( "#sap" ).prepend( document.getElementById( "first" ) );
                expect( $( "#sap" ).text()).toEqual(expected);
            } );

            it( "Should prepend(Array<Element>)", function( ) {

                var expected;
                expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
                $( "#sap" ).prepend( [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ] );
                expect( $( "#sap" ).text()).toEqual(expected);
            } );

            it( "Should prepend($)", function( ) {

                var expected;
                expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
                $( "#sap" ).prepend( $( "#yahoo, #first" ) );
                expect( $( "#sap" ).text()).toEqual(expected);
            } );

            it( "Should prepend(Array<$>)", function( ) {

                var expected;
                expected = "Try them out:GoogleYahooThis link has class=\"blog\": Simon Willison's Weblog";
                $( "#sap" ).prepend( [ $( "#first" ), $( "#yahoo, #google" ) ] );
                expect( $( "#sap" ).text()).toEqual(expected);
            } );

            it( "Should prepend(Function) with incoming value -- String", function( ) {

                var defaultText, old, result;

                defaultText = "Try them out:";
                old = $( "#first" ).html();
                result = $( "#first" ).prepend( function( i, val ) {
                    expect( val, old, "Make sure the incoming value is correct." );
                    return "<b>buga</b>";
                } );

                expect( result.text() ).toEqual( "buga" + defaultText);

                old = $( "#select3" ).html();

                expect( $( "#select3" ).prepend( function( i, val ) {
                    expect( val, old, "Make sure the incoming value is correct." );
                    return "<option value='prependTest'>Prepend Test</option>";
                } ).find( "option:first-child" ).attr( "value" )).toEqual("prependTest");
            } );

            it( "Should prepend(Function) with incoming value -- Element", function( ) {

                var old, expected;
                expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
                old = $( "#sap" ).html();

                $( "#sap" ).prepend( function( i, val ) {
                    expect( val, old, "Make sure the incoming value is correct." );
                    return document.getElementById( "first" );
                } );

                expect( $( "#sap" ).text()).toEqual(expected);
            } );

            it( "Should prepend(Function) with incoming value -- Array<Element>", function( ) {

                var old, expected;
                expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
                old = $( "#sap" ).html();

                $( "#sap" ).prepend( function( i, val ) {
                    expect( val, old, "Make sure the incoming value is correct." );
                    return [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ];
                } );

                expect( $( "#sap" ).text()).toEqual(expected);
            } );

            it( "Should prepend(Function) with incoming value -- $", function( ) {

                var old, expected;
                expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
                old = $( "#sap" ).html();

                $( "#sap" ).prepend( function( i, val ) {
                    expect( val, old, "Make sure the incoming value is correct." );
                    return $( "#yahoo, #first" );
                } );

                expect( $( "#sap" ).text()).toEqual(expected);
            } );
        });

        describe('$.before()', function() {

            it( "Should execute before(String)", function(  ) {

                var expected;

                expected = "This is a normal link: bugaYahoo";
                $( "#yahoo" ).before( manipulationBareObj( "<b>buga</b>" ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Element)", function( ) {

                var expected;

                expected = "This is a normal link: Try them out:Yahoo";
                $( "#yahoo" ).before( manipulationBareObj( document.getElementById( "first" ) ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Array<Element>)", function(  ) {

                var expected;
                expected = "This is a normal link: Try them out:diveintomarkYahoo";
                $( "#yahoo" ).before( manipulationBareObj( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before($)", function(  ) {



                var expected;
                expected = "This is a normal link: diveintomarkTry them out:Yahoo";
                $( "#yahoo" ).before( manipulationBareObj( $( "#mark, #first" ) ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Array<$>)", function(  ) {



                var expected;
                expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
                $( "#yahoo" ).before( manipulationBareObj( [ $( "#first" ), $( "#mark, #google" ) ] ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Function) -- Returns String", function(  ) {



                var expected;

                expected = "This is a normal link: bugaYahoo";
                $( "#yahoo" ).before( manipulationFunctionReturningObj( "<b>buga</b>" ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Function) -- Returns Element", function(  ) {



                var expected;

                expected = "This is a normal link: Try them out:Yahoo";
                $( "#yahoo" ).before( manipulationFunctionReturningObj( document.getElementById( "first" ) ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Function) -- Returns Array<Element>", function(  ) {



                var expected;
                expected = "This is a normal link: Try them out:diveintomarkYahoo";
                $( "#yahoo" ).before( manipulationFunctionReturningObj( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Function) -- Returns $", function(  ) {



                var expected;
                expected = "This is a normal link: diveintomarkTry them out:Yahoo";
                $( "#yahoo" ).before( manipulationFunctionReturningObj( $( "#mark, #first" ) ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(Function) -- Returns Array<$>", function(  ) {



                var expected;
                expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
                $( "#yahoo" ).before( manipulationFunctionReturningObj( [ $( "#first" ), $( "#mark, #google" ) ] ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute before(no-op)", function(  ) {

                var set;
                set = $( "<div/>" ).before( "<span>test</span>" );
                expect( set[ 0 ].nodeName.toLowerCase()).toEqual("div");
                expect( set.length).toEqual(1);
            } );

            it( "Should execute before and after w/ empty object (#10812)", function(  ) {

                var res;

                res = $( "#notInTheDocument" ).before( "(" ).after( ")" );
                expect( res.length).toEqual(0);
            } );

            it( "Should execute .before() and .after() disconnected node", function(  ) {

                expect( $( "<input type='checkbox'/>" ).before( "<div/>" ).length).toEqual(1);
                expect( $( "<input type='checkbox'/>" ).after( "<div/>" ).length).toEqual(1);
            } );

            it( "Should execute insert with .before() on disconnected node last", function(  ) {

                var expectedBefore = "This is a normal link: bugaYahoo";

                $( "#yahoo" ).add( "<span/>" ).before( "<b>buga</b>" );
                expect( $( "#en" ).text()).toEqual(expectedBefore);
            } );

            it( "Should execute insert with .before() on disconnected node first", function(  ) {

                var expectedBefore = "This is a normal link: bugaYahoo";

                $( "<span/>" ).add( "#yahoo" ).before( "<b>buga</b>" );
                expect( $( "#en" ).text()).toEqual(expectedBefore);
            } );

        });

        describe('$.after()', function() {

            it( "Should execute insert with .before() on disconnected node last", function() {

                var expectedAfter = "This is a normal link: Yahoobuga";

                $( "#yahoo" ).add( "<span/>" ).after( "<b>buga</b>" );
                expect( $( "#en" ).text()).toEqual(expectedAfter);
            } );

            it( "Should execute insert with .before() on disconnected node last", function() {

                var expectedAfter = "This is a normal link: Yahoobuga";

                $( "<span/>" ).add( "#yahoo" ).after( "<b>buga</b>" );
                expect( $( "#en" ).text()).toEqual(expectedAfter);
            } );


            it( "Should execute after(String)", function() {

                var expected = "This is a normal link: Yahoobuga";
                $( "#yahoo" ).after( "<b>buga</b>" );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(Element)", function() {

                var expected = "This is a normal link: YahooTry them out:";
                $( "#yahoo" ).after( document.getElementById( "first" ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(Array<Element>)", function() {

                var expected = "This is a normal link: YahooTry them out:diveintomark";
                $( "#yahoo" ).after( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after($)", function() {

                var expected = "This is a normal link: YahooTry them out:Googlediveintomark";
                $( "#yahoo" ).after( [ $( "#first" ), $( "#mark, #google" ) ] );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(Function) returns String", function() {

                var expected = "This is a normal link: Yahoobuga",
                    val = manipulationFunctionReturningObj;
                $( "#yahoo" ).after( val( "<b>buga</b>" ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(Function) returns Element", function() {

                var expected = "This is a normal link: YahooTry them out:",
                    val = manipulationFunctionReturningObj;
                $( "#yahoo" ).after( val( document.getElementById( "first" ) ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(Function) returns Array<Element>", function() {

                var expected = "This is a normal link: YahooTry them out:diveintomark",
                    val = manipulationFunctionReturningObj;
                $( "#yahoo" ).after( val( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(Function) returns $", function() {

                var expected = "This is a normal link: YahooTry them out:Googlediveintomark",
                    val = manipulationFunctionReturningObj;
                $( "#yahoo" ).after( val( [ $( "#first" ), $( "#mark, #google" ) ] ) );
                expect( $( "#en" ).text()).toEqual(expected);
            } );

            it( "Should execute after(disconnected node)", function() {

                var set = $( "<div/>" ).before( "<span>test</span>" );
                expect( set[ 0 ].nodeName.toLowerCase()).toEqual("div");
                expect( set.length).toEqual(1);
            } );
        });

    });

    describe('Declarative behavior', function() {

        it('Should run initialize even if dom is not ready', function(){

            loadFixtures('core/polyfill/jquery.initialize.js', 'before.html');

            expect($('main').hasClass('test')).toBeTruthy();
        });

        it('Should run initialize when called in document ready callback', function(){

            loadFixtures('core/polyfill/jquery.initialize.js', 'after.html');

            expect($('main').hasClass('test')).toBeTruthy();
        });

        it('Should run initialize when called in window load callback', function(done){

            loadFixtures('core/polyfill/jquery.initialize.js', 'load.html');

            //todo: one day try to remove it...
            $(window).load();

            setTimeout(function(){
                expect($('main').hasClass('test')).toBeTruthy();
                done();
            });
        });
        it('Should run initialize when called anytime', function(done){

            loadFixtures('core/polyfill/jquery.initialize.js', 'anytime.html');

            setTimeout(function(){
                expect($('main').hasClass('test')).toBeTruthy();
                done();
            }, 600);
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