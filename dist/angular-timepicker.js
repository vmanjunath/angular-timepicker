/*!
 * angular-timepicker 1.0.7
 * https://github.com/Geta/angular-timepicker
 * Copyright 2014, Geta AS
 * Contributors: Dzulqarnain Nasir <dzul@geta.no>
 * Licensed under: MIT (http://www.opensource.org/licenses/MIT)
 */

(function(angular) {
    "use strict";
    angular.module("dnTimepicker", [ "ui.bootstrap.position", "dateParser" ]).factory("dnTimepickerHelpers", function() {
        return {
            stringToMinutes: function(str) {
                if (!str) {
                    return null;
                }
                var t = str.match(/(\d+)(h?)/);
                return t[1] ? t[1] * (t[2] ? 60 : 1) : null;
            },
            buildOptionList: function(minTime, maxTime, step) {
                var result = [], i = angular.copy(minTime);
                while (i <= maxTime) {
                    result.push(new Date(i));
                    i.setMinutes(i.getMinutes() + step);
                }
                return result;
            },
            getClosestIndex: function(value, from) {
                if (!angular.isDate(value)) {
                    return -1;
                }
                var closest = null, index = -1, _value = value.getHours() * 60 + value.getMinutes();
                for (var i = 0; i < from.length; i++) {
                    var current = from[i], _current = current.getHours() * 60 + current.getMinutes();
                    if (closest === null || Math.abs(_current - _value) < Math.abs(closest - _value)) {
                        closest = _current;
                        index = i;
                    }
                }
                return index;
            }
        };
    }).directive("dnTimepicker", [ "$compile", "$parse", "$position", "$document", "dateFilter", "$dateParser", "dnTimepickerHelpers", "$log", function($compile, $parse, $position, $document, dateFilter, $dateParser, dnTimepickerHelpers, $log) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                ngModel: "="
            },
            link: function(scope, element, attrs, ctrl) {
                var current = null, list = [], updateList = true;
                scope.timepicker = {
                    element: null,
                    timeFormat: "h:mm a",
                    minTime: $dateParser("0:00", "H:mm"),
                    maxTime: $dateParser("23:59", "H:mm"),
                    step: 15,
                    isOpen: false,
                    activeIdx: -1,
                    optionList: function() {
                        if (updateList) {
                            list = dnTimepickerHelpers.buildOptionList(scope.timepicker.minTime, scope.timepicker.maxTime, scope.timepicker.step);
                            updateList = false;
                        }
                        return list;
                    }
                };
                attrs.$observe("dnTimepicker", function(value) {
                    if (value) {
                        scope.timepicker.timeFormat = value;
                    }
                    ctrl.$render();
                });
                attrs.$observe("timeFormat", function(value) {
                    if (value) {
                        $log.warn("The time-format attribute is deprecated and will be removed in the next version. Specify time format as value for dn-timepicker attribute.");
                        scope.timepicker.timeFormat = value;
                    }
                    ctrl.$render();
                });
                attrs.$observe("minTime", function(value) {
                    if (!value) return;
                    scope.timepicker.minTime = $dateParser(value, scope.timepicker.timeFormat);
                    updateList = true;
                });
                attrs.$observe("maxTime", function(value) {
                    if (!value) return;
                    scope.timepicker.maxTime = $dateParser(value, scope.timepicker.timeFormat);
                    updateList = true;
                });
                attrs.$observe("step", function(value) {
                    if (!value) return;
                    var step = dnTimepickerHelpers.stringToMinutes(value);
                    if (step) scope.timepicker.step = step;
                    updateList = true;
                });
                scope.$watch("ngModel", function(value) {
                    if (angular.isDate(value)) current = value;
                });
                ctrl.$render = function() {
                    element.val(angular.isDate(current) ? dateFilter(current, scope.timepicker.timeFormat) : ctrl.$viewValue);
                };
                ctrl.$parsers.unshift(function(viewValue) {
                    var date = angular.isDate(viewValue) ? viewValue : $dateParser(viewValue, scope.timepicker.timeFormat);
                    if (isNaN(date)) {
                        ctrl.$setValidity("time", false);
                        return undefined;
                    }
                    ctrl.$setValidity("time", true);
                    if (!current) current = scope.ngModel;
                    current.setHours(date.getHours());
                    current.setMinutes(date.getMinutes());
                    current.setSeconds(date.getSeconds());
                    return current;
                });
                scope.select = function(time) {
                    if (!angular.isDate(time)) {
                        return;
                    }
                    if (!current) current = scope.ngModel;
                    current.setHours(time.getHours());
                    current.setMinutes(time.getMinutes());
                    current.setSeconds(time.getSeconds());
                    ctrl.$setViewValue(current);
                    ctrl.$render();
                };
                scope.isActive = function(index) {
                    return index === scope.timepicker.activeIdx;
                };
                scope.setActive = function(index) {
                    scope.timepicker.activeIdx = index;
                };
                scope.scrollToSelected = function() {
                    if (scope.timepicker.element && scope.timepicker.activeIdx > -1) {
                        var target = scope.timepicker.element[0].querySelector(".active");
                        target.parentNode.scrollTop = target.offsetTop - 50;
                    }
                };
                scope.openPopup = function() {
                    scope.position = $position.position(element);
                    scope.position.top = scope.position.top + element.prop("offsetHeight");
                    scope.timepicker.isOpen = true;
                    scope.timepicker.activeIdx = dnTimepickerHelpers.getClosestIndex(scope.ngModel, scope.timepicker.optionList());
                    scope.$digest();
                    scope.scrollToSelected();
                };
                scope.closePopup = function() {
                    if (scope.timepicker.isOpen) {
                        scope.timepicker.isOpen = false;
                        scope.$apply();
                        element[0].blur();
                    }
                };
                element.after($compile(angular.element("<div dn-timepicker-popup></div>"))(scope));
                element.bind("focus", function() {
                    scope.openPopup();
                }).bind("keypress keyup", function(e) {
                    if (e.which === 38 && scope.timepicker.activeIdx > 0) {
                        scope.timepicker.activeIdx--;
                        scope.scrollToSelected();
                    } else if (e.which === 40 && scope.timepicker.activeIdx < scope.timepicker.optionList().length - 1) {
                        scope.timepicker.activeIdx++;
                        scope.scrollToSelected();
                    } else if (e.which === 13 && scope.timepicker.activeIdx > -1) {
                        scope.select(scope.timepicker.optionList()[scope.timepicker.activeIdx]);
                        scope.closePopup();
                    }
                    scope.$digest();
                });
                $document.bind("click", function(event) {
                    if (scope.timepicker.isOpen && event.target !== element[0]) {
                        scope.closePopup();
                    }
                });
                if (!angular.isDate(scope.ngModel)) {
                    var date = $dateParser(scope.ngModel, scope.timepicker.timeFormat);
                    if (!isNaN(date)) {
                        scope.ngModel = date;
                    } else {
                        $log.warn("Failed to parse model.");
                    }
                }
                current = scope.ngModel;
            }
        };
    } ]).directive("dnTimepickerPopup", function() {
        return {
            restrict: "A",
            replace: true,
            transclude: false,
            template: '<ul class="dn-timepicker-popup dropdown-menu" ng-style="{display: timepicker.isOpen && \'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}"><li ng-repeat="time in timepicker.optionList()" ng-class="{active: isActive($index) }" ng-mouseenter="setActive($index)"><a ng-click="select(time)">{{time | date:timepicker.timeFormat}}</a></li></ul>',
            link: function(scope, element, attrs) {
                scope.timepicker.element = element;
                element.find("a").bind("click", function(event) {
                    event.preventDefault();
                });
            }
        };
    });
})(angular);