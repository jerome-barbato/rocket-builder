var JQueryHelper = function() {

    var self = this;


    /**
     * Returns an array of elements with the given IDs
     * @example q( "main", "foo", "bar" )
     * @result [<div id="main">, <span id="foo">, <input id="bar">]
     */
    self.q = function() {
        var r = [],
            i = 0;

        for ( ; i < arguments.length; i++ ) {
            r.push( document.getElementById( arguments[ i ] ) );
        }
        return r;
    };

    /**
     * Asserts that a select matches the given IDs
     * @param {String} message - Assertion name
     * @param {String} selector - Sizzle selector
     * @param {String} expectedIds - Array of ids to construct what is expected
     * @param {(String|Node)=document} context - Selector context
     * @example match("Check for something", "p", ["foo", "bar"]);
     */
    self.match = function( message, selector, expectedIds, context ) {
        var f = jQuery( selector, context ).get(),
            s = "",
            i = 0;

        for ( ; i < f.length; i++ ) {
            s += ( s && "," ) + "\"" + f[ i ].id + "\"";
        }

        expect( f ).toEqual(self.q.apply( self.q, expectedIds ));
    };

    /**
     * Asserts that a select matches the given IDs.
     * The select is not bound by a context.
     * @param {String} message - Assertion name
     * @param {String} selector - Sizzle selector
     * @param {String} expectedIds - Array of ids to construct what is expected
     * @example t("Check for something", "p", ["foo", "bar"]);
     */
    self.t = function( message, selector, expectedIds ) {
        self.match( message, selector, expectedIds, undefined );
    };

    /**
     * Asserts that a select matches the given IDs.
     * The select is performed within the `#qunit-fixture` context.
     * @param {String} message - Assertion name
     * @param {String} selector - Sizzle selector
     * @param {String} expectedIds - Array of ids to construct what is expected
     * @example selectInFixture("Check for something", "p", ["foo", "bar"]);
     */
    self.selectInFixture = function( message, selector, expectedIds ) {
        self.match( message, selector, expectedIds, "#qunit-fixture" );
    };

    self.createDashboardXML = function() {
        var string = "<?xml version='1.0' encoding='UTF-8'?> \
	<dashboard> \
		<locations class='foo'> \
			<location for='bar' checked='different'> \
				<infowindowtab normal='ab' mixedCase='yes'> \
					<tab title='Location'><![CDATA[blabla]]></tab> \
					<tab title='Users'><![CDATA[blublu]]></tab> \
				</infowindowtab> \
			</location> \
		</locations> \
	</dashboard>";

        return jQuery.parseXML( string );
    };

    self.createWithFriesXML = function() {
        var string = "<?xml version='1.0' encoding='UTF-8'?> \
	<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' \
		xmlns:xsd='http://www.w3.org/2001/XMLSchema' \
		xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'> \
		<soap:Body> \
			<jsconf xmlns='http://{{ externalHost }}/ns1'> \
				<response xmlns:ab='http://{{ externalHost }}/ns2'> \
					<meta> \
						<component id='seite1' class='component'> \
							<properties xmlns:cd='http://{{ externalHost }}/ns3'> \
								<property name='prop1'> \
									<thing /> \
									<value>1</value> \
								</property> \
								<property name='prop2'> \
									<thing att='something' /> \
								</property> \
								<foo_bar>foo</foo_bar> \
							</properties> \
						</component> \
					</meta> \
				</response> \
			</jsconf> \
		</soap:Body> \
	</soap:Envelope>";

        return jQuery.parseXML( string.replace( /\{\{\s*externalHost\s*\}\}/g, externalHost ) );
    };

    self.createXMLFragment = function() {
        var xml, frag;
        if ( window.ActiveXObject ) {
            xml = new window.ActiveXObject( "msxml2.domdocument" );
        } else {
            xml = document.implementation.createDocument( "", "", null );
        }

        if ( xml ) {
            frag = xml.createElement( "data" );
        }

        return frag;
    };

    /**
     * Add random number to url to stop caching
     *
     * @example url("data/test.html")
     * @result "data/test.html?10538358428943"
     *
     * @example url("data/test.php?foo=bar")
     * @result "data/test.php?foo=bar&10538358345554"
     */
    self.url = function url( value ) {
        return baseURL + value + ( /\?/.test( value ) ? "&" : "?" ) +
            new Date().getTime() + "" + parseInt( Math.random() * 100000, 10 );
    };
};




window.fireNative = document.createEvent ?
    function( node, type ) {
        var event = document.createEvent( "HTMLEvents" );

        event.initEvent( type, true, true );
        node.dispatchEvent( event );
    } :
    function( node, type ) {
        node.fireEvent( "on" + type, document.createEventObject() );
    };

var jQueryHelper = new JQueryHelper();