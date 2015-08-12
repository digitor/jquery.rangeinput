/**
 * @title jQuery Range Input
 * @Author Jim Doyle
 * @version 0.1.0
 * @description jQuery plugin for specifying a minimum and maximum value for an input field with a list of buttons to enable/disable at each range limit.
 * @url https://github.com/digitor/jquery.rangeinput
 */

;(function ( $ ) {
    var pluginName = "rangeInput";

    /**
     * TODO:
     */


    var warn = function(arg1, arg2, arg3) {
        console.warn( pluginName, arg1, arg2 || "", arg3 || "" );
    }

    var utils = {
        /**
         * @description Get an integer from a string representation of a number, commonly useful for parsing data attributes
         * @param val {string} - string representation of a number
         * @return {number/integer}
         */
        getValidInt: function( val, isInteger, allowEmpty ) {

            var intVal;
            if( typeof val === "string" )
                intVal = isInteger ? parseInt(val, 10) : parseFloat(val);
            else if( typeof val === "number" && isInteger )
                intVal = Math.round(val);
            else if( typeof val === "number" && !isInteger )
                intVal = val;
            else
                intVal = null;

            if(allowEmpty && val !== "") {
                if( intVal === null || intVal.toString() === "NaN") {
                    warn("utils.getValidInt", "The value was not a valid number", val);
                    return null;
                }
            }

            return intVal;
        }
    }


    var checks = function($this, options, justOpts) {
        // Just incase console isn't present ie8/9, stops JS errors
        if( options.allowConsoleOverride && !window.console ) {
            window.console = {};
            console.log = function(){};
            console.warn = function(){};
            console.error = function(){};
        }


        var rtnVal = true;

        // Option checks
        if( !$.isArray(options.minBtnList) ) {
            warn( "Option 'minBtnList' was not an array.", options.minBtnList );
            rtnVal = false;
        }

        if( !$.isArray(options.maxBtnList) ) {
            warn( "Option 'maxBtnList' was not an array.", options.maxBtnList );
            rtnVal = false;
        }

        if( !$.isArray(options.outOfRangeList) ) {
            warn( "Option 'outOfRangeList' was not an array.", options.outOfRangeList );
            rtnVal = false;
        }

        if( options.minCB && typeof options.minCB !== "function" ) {
            warn( "Option 'minCB' was not a function.", options.minCB );
            rtnVal = false;
        }

        if( options.maxCB && typeof options.maxCB !== "function" ) {
            warn( "Option 'maxCB' was not a function.", options.maxCB );
            rtnVal = false;
        }

        if( options.inRangeCB && typeof options.inRangeCB !== "function" ) {
            warn( "Option 'inRangeCB' was not a function.", options.inRangeCB );
            rtnVal = false;
        }

        if( options.outOfRangeCB && typeof options.outOfRangeCB !== "function" ) {
            warn( "Option 'outOfRangeCB' was not a function.", options.outOfRangeCB );
            rtnVal = false;
        }

        if( options.$msgElement && options.$msgElement.length === 0 ) {
            warn( "Could not find any elements matching option '$msgElement'.", options.$msgElement );
            rtnVal = false;
        }

        // omit attribute and node checks, optionally
        if(justOpts) return rtnVal;

        // Attribute and node checks

        // TODO: check is 'input' node

        if( !$this.attr("data-min") ) {
            warn( "No 'data-min' attribute set." );
            rtnVal = false;
        }

        if( !$this.attr("data-max") ) {
            warn( "No 'data-max' attribute set." );
            rtnVal = false;
        }
   
        var inpType = $this.attr("type");
        if(inpType !== "text" && inpType !== "number") {
            warn( "Input element must have a type of 'text' or 'number', found '"+inpType+"'." );
            rtnVal = false;
        }


        var inpVal = utils.getValidInt( $this.val(), options.restrictToInteger, true );
        if( inpVal === null) rtnVal = false;
        

        return rtnVal;
    }


    var rangeCheck = function( $inp, options ) {

        var isInteger = options.isInteger
            , $msgEl = options.$msgElement
            , inpVal = utils.getValidInt( $inp.val(), isInteger );

        // disable/enable the minBtnList
        var min = utils.getValidInt( $inp.attr('data-min'), isInteger );
        if( min !== null ) {
            $.each( options.minBtnList, function() {
                $(this).prop( 'disabled', inpVal <= min );
            });
        }

        // disable/enable the maxBtnList
        var max = utils.getValidInt( $inp.attr('data-max'), isInteger );
        if( max !== null ) {
            $.each( options.maxBtnList, function() {
                $(this).prop( 'disabled', inpVal >= max );
            });
        }

        // set the validation messaging
        if( $msgEl ) {
            // You can override msg with the 'data-msg' attribute, or else it defaults to the hardcoded JS below
            var msg = $msgEl.attr("data-msg");
            if( msg )
                $msgEl.text( msg.split('|min|').join(min).split('|max|').join(max) );
            else
                $msgEl.text( "Must be between "+ min + " and " + max+ "." );
        }

        // disable/enable the outOfRangeList
        var outOfRange = min !== null && inpVal < min  ||  max !== null && inpVal > max;
        $.each( options.outOfRangeList, function() {
            $(this).prop( 'disabled', outOfRange || (options.emptyIsOutOfRange && $inp.val() === "") );
        });

        // fire callbacks
        if( outOfRange && options.outOfRangeCB ) options.outOfRangeCB( inpVal );
        if( !outOfRange && options.inRangeCB )   options.inRangeCB( inpVal );
        if( inpVal <= min && options.minCB )     options.minCB( inpVal );
        if( inpVal >= max && options.maxCB )     options.maxCB( inpVal );
    }


    /**
     * Default options
     * @type minBtnList {array of jQuery elements} optional - a list of buttons that should be disabled when min limit is reached
     * @type maxBtnList {array of jQuery elements} optional - a list of buttons that should be disabled when max limit is reached
     * @type outOfRangeList {array of jQuery elements} optional - a list of buttons that should be disabled when input is out of min-max range
     * @type minCB {function} optional - function to call when min limit is reached
     * @type maxCB {function} optional - function to call when max limit is reached
     * @type inRangeCB {function} optional - function to call when input value is in range (neither min nor max limits are reached)
     * @type outOfRangeCB {function} optional - function to call when input value is out of min-max range
     * @type firstInteractionCB {function} optional - function to call on first interaction, you may want to use this to hide the validation messaging
     * @type allowConsoleOverride {boolean} optional - switch for overrideing console where not supported by browser
     * @type inputVal {number/int} optional - set the input to a value
     * @type restrictToInteger {boolean} optional - force input value to be an integer or float
     * @type emptyIsOutOfRange {boolean} optional - consider an empty field as out of range
     * @type $msgElement {jQuery element} optional - a jQuery element that will contain the validation messaging
     */
    var defaultOptions = {
        minBtnList: [],
        maxBtnList: [],
        outOfRangeList: [],
        minCB: null,
        maxCB: null,
        inRangeCB: null,
        outOfRangeCB: null,
        firstInteractionCB: null,
        allowConsoleOverride: true,
        inputVal: null,
        restrictToInteger: true,
        emptyIsOutOfRange: true,
        $msgElement: null
    };

    /**
     * Creates the plugin instance
     * Attributes 'data-min' and 'data-max' are mandatory.
     * Attribute 'data-msg' is optional and only works if option '$msgElement' is passed.
     * Input type must be 'text' or 'number'.
     */
    $.fn[pluginName] = function ( options ) {

        // ensures 'options' is an object literal (and not an array either)
        options = (typeof options !== "object" || $.isArray(options) ) ? {} : options;

        return this.each(function () {

            var $this = $(this)
                , isInited = $this.data('inited')
                , existOpts = $this.data('existingOptions');

            // if already inited, merge with existing options
            if( isInited && existOpts ) options = $.extend({}, existOpts, options);

            // If this plugin has NOT been run before merge with defaults
            if( !isInited ) options = $.extend({}, defaultOptions, options);

            // stop if checks fail and only check attributes on first run
            if( !checks($this, options, isInited) ) return;

            // save final options for future checks
            $this.data('existingOptions', options);

            rangeCheck( $this, options );

            if( !isInited ) {

                var interacted = false;
                $this.on('focus, change, keyup', function() {
                    if(!interacted && options.firstInteractionCB) {
                        interacted = true;
                        options.firstInteractionCB();
                    }
                    rangeCheck( $this, options );
                });

                $this.data('inited', true);
            }
        });
    };

})( jQuery );