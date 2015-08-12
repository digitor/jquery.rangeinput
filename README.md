# jquery.rangeinput
jQuery plugin for specifying a minimum and maximum value for an input field with a list of buttons to enable/disable at each range limit.

## Attributes 
- Attributes 'data-min' and 'data-max' are mandatory.
- Attribute 'data-msg' is optional and only works if option '$msgElement' is passed.
- Input type must be 'text' or 'number'.

## Plugin options
- minBtnList {array of jQuery elements} optional - a list of buttons that should be disabled when min limit is reached
- maxBtnList {array of jQuery elements} optional - a list of buttons that should be disabled when max limit is reached
- outOfRangeList {array of jQuery elements} optional - a list of buttons that should be disabled when input is out of min-max range
- minCB {function} optional - function to call when min limit is reached
- maxCB {function} optional - function to call when max limit is reached
- inRangeCB {function} optional - function to call when input value is in range (neither min nor max limits are reached)
- outOfRangeCB {function} optional - function to call when input value is out of min-max range
- firstInteractionCB {function} optional - function to call on first interaction, you may want to use this to hide the validation messaging
- allowConsoleOverride {boolean} optional - switch for overrideing console where not supported by browser
- inputVal {number/int} optional - set the input to a value
- restrictToInteger {boolean} optional - force input value to be an integer or float
- emptyIsOutOfRange {boolean} optional - consider an empty field as out of range
- $msgElement {jQuery element} optional - a jQuery element that will contain the validation messaging

## Development
Please beware, this plugin is in it's very early stages of development and hasn't been thoroughly tested yet.