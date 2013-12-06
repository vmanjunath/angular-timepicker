/* 
 *   Angular Timepicker 1.0.2
 *   https://github.com/Geta/angular-timepicker
 *
 *   Copyright 2013, Geta AS
 *   Author: Dzulqarnain Nasir
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

angular.module('dnTimepicker', ['ui.bootstrap'])
    .directive('dnTimepicker', ['$compile', '$parse', '$position', '$document', '$filter', function($compile, $parse, $position, $document, $filter) {

        // Converts step to minutes
        // (string) step
        function stringToMinutes(step) {
            var t = step.match(/(\d+)(h?)/);
            return t[1] * (t[2] ? 60 : 1);
        }

        // Fetches the index for the closest value in the array
        // (object) value
        // (array) from
        function getClosestIndex(value, from) {
            if(!value) return -1;
            
            var closest = null;
            var index = -1;

            var _value = value.getHours() * 60 + value.getMinutes();
            for (var i = 0; i < from.length; i++) {
                var current = from[i];
                var _current = current.getHours() * 60 + current.getMinutes();

                if (closest === null || Math.abs(_current - _value) < Math.abs(closest - _value)) {
                    closest = _current;
                    index = i;
                }
            }
            return index;
        }

        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {

                // Converts string to Date object
                // (string) time
                scope.stringToDate = function(time) {
                    if(!time) return null;

                    var d = new Date();
                    var t = time.match(/(\d+)(?::(\d\d))?\s*(p|a?)/i);

                    if(!t) return null;

                    var hours = parseInt(t[1]);
                    
                    d.setHours(hours + (hours == 12 ? (t[3] ? (t[3].toLowerCase() == 'p' ? 0 : -12) : 0) : (t[3].toLowerCase() == 'p' ? 12 : 0)));
                    d.setMinutes(parseInt(t[2]) || 0);
                    d.setSeconds(0);

                    return d;
                };

                // Builds a list of Date objects
                // (Date)minTime
                // (Date)maxTime
                // (int)step
                scope.buildTimeList = function(minTime, maxTime, step) {
                    var result = [];

                    var i = minTime;
                    while (i <= maxTime) {
                        result.push(new Date(i));
                        i.setMinutes(i.getMinutes() + step);
                    }

                    return result;
                };

                // Local variables
                var minTime = scope.stringToDate(attrs.minTime) || scope.stringToDate('00:00'),
                    maxTime = scope.stringToDate(attrs.maxTime) || scope.stringToDate('23:59'),
                    step = stringToMinutes(attrs.step || '15m'),
                    current = null;

                scope.timepicker = {
                    element: null,
                    timeFormat: attrs.timeFormat || 'h:mm a',
                    isOpen: false,
                    activeIdx: -1,
                    optionList: scope.buildTimeList(minTime, maxTime, step)
                };

                // Select action handler
                // (int) index
                scope.select = function(index) {
                    scope.update(scope.timepicker.optionList[index]);

                    // Closes the timepicker
                    if (scope.timepicker.isOpen) scope.timepicker.isOpen = false;
                };

                // Update the current selected time
                // (Date) value
                scope.update = function(value) {
                    if(!value) return;

                    current.setHours(value.getHours());
                    current.setMinutes(value.getMinutes());
                    current.setSeconds(value.getSeconds());

                    scope.model = current;

                    ngModel.$render();
                };

                ngModel.$render = function() {
                    var timeString = ngModel.$viewValue ? $filter('date')(ngModel.$viewValue, scope.timepicker.timeFormat) : '';
                    element.val(timeString);
                };

                // Checks for current active item
                // (int) index
                scope.isActive = function(index) {
                    return index === scope.timepicker.activeIdx;
                };

                // Sets the current active item
                // (int) index
                scope.setActive = function(index) {
                    scope.timepicker.activeIdx = index;
                };

                // Opens the timepicker
                scope.openPopup = function() {
                    // Set position
                    scope.position = $position.position(element);
                    scope.position.top = scope.position.top + element.prop('offsetHeight');

                    // Open list
                    scope.timepicker.isOpen = true;

                    // Set active item
                    scope.timepicker.activeIdx = getClosestIndex(ngModel.$viewValue, scope.timepicker.optionList);

                    // Trigger digest
                    scope.$digest();

                    // Scroll to selected
                    if (scope.timepicker.element && scope.timepicker.activeIdx > -1) {
                        var target = scope.timepicker.element[0].querySelector('.active');
                        target.parentNode.scrollTop = target.offsetTop;
                    }
                };

                // Set up the element
                element
                    .bind('focus', function() {
                        scope.openPopup();
                    })
                    .bind('change', function() {
                        var time = scope.stringToDate(element.val());

                        // If the manually entered time is not valid, update it with last valid value
                        if(time instanceof Date) {
                            scope.update(time);
                        } else {
                            scope.update(current);
                        }

                        scope.timepicker.isOpen = false;
                        scope.$apply();
                    });

                $document.bind('click', function() {
                    if (scope.timepicker.isOpen && event.target !== element[0]) {
                        scope.timepicker.isOpen = false;
                        scope.$apply();
                    }
                });

                // Append timepicker dropdown
                element.after($compile(angular.element('<dn-timepicker-popup></dn-timepicker-popup>'))(scope));

                // Set initial value
                if(!(scope.model instanceof Date)) {
                    scope.model = new Date();
                }

                current = scope.model;

                // Set initial selected item
                scope.timepicker.activeIdx = getClosestIndex(scope.model, scope.timepicker.optionList);
                if (scope.timepicker.activeIdx > -1) scope.select(scope.timepicker.activeIdx);
            }
        };
    }])
    .directive('dnTimepickerPopup', [function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: '<ul class="dn-timepicker-popup dropdown-menu" ng-style="{display: timepicker.isOpen && \'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\
            <li ng-repeat="time in timepicker.optionList" ng-class="{active: isActive($index) }" ng-mouseenter="setActive($index)" ng-click="select($index)">\
            <a>{{time | date:timepicker.timeFormat}}</a>\
            </li>\
            </ul>',
            link: function(scope, element, attrs) {
                scope.timepicker.element = element;

                element.find('a').bind('click', function(event) {
                    event.preventDefault();
                });
            }
        };
    }]);