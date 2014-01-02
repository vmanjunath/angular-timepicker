describe('Timepicker directive', function() {

	beforeEach(module('dnTimepicker'));

	// beforeEach(inject(function($rootScope, $compile) {
	// 	$scope = $rootScope.$new();
	// 	$scope.time = new Date();

	// 	element = angular.element('<input type="text" dn-timepicker="HH:mm" ng-model="time">');

	// 	$compile(element)($scope);

	// 	$scope.$digest();

	// 	directiveScope = element.isolateScope();
	// }));

	describe('helper function test', function() {
		it('should convert string to minutes', inject(function(dnTimepickerHelpers) {
			var str1 = '1h',
				str2 = '30m',
				str3 = '30';

			expect(dnTimepickerHelpers.stringToMinutes(str1)).toBe(60);
			expect(dnTimepickerHelpers.stringToMinutes(str2)).toBe(30);
			expect(dnTimepickerHelpers.stringToMinutes(str3)).toBe(30);
		}));

		it('should build a list of selectable time', inject(function($dateParser, dnTimepickerHelpers) {
			var minTime = $dateParser('12:00', 'HH:mm');
			var maxTime = $dateParser('13:00', 'HH:mm');

			var timeList = dnTimepickerHelpers.buildOptionList(minTime, maxTime, 15);

			expect(timeList.length).toBe(5);
			expect(timeList[0].getHours()).toBe(12);
			expect(timeList[0].getMinutes()).toBe(0);
			expect(timeList[1].getHours()).toBe(12);
			expect(timeList[1].getMinutes()).toBe(15);
			expect(timeList[2].getHours()).toBe(12);
			expect(timeList[2].getMinutes()).toBe(30);
			expect(timeList[3].getHours()).toBe(12);
			expect(timeList[3].getMinutes()).toBe(45);
			expect(timeList[4].getHours()).toBe(13);
			expect(timeList[4].getMinutes()).toBe(0);
		}));

		it('should return closest index', inject(function($dateParser, dnTimepickerHelpers) {
			var minTime = $dateParser('12:00', 'HH:mm');
			var maxTime = $dateParser('13:00', 'HH:mm');

			var timeList = dnTimepickerHelpers.buildOptionList(minTime, maxTime, 15);

			var testTime1 = $dateParser('12:36', 'HH:mm'),
				testTime2 = $dateParser('12:01', 'HH:mm'),
				testTime3 = $dateParser('12:59', 'HH:mm');

			expect(dnTimepickerHelpers.getClosestIndex(testTime1, timeList)).toBe(2);
			expect(dnTimepickerHelpers.getClosestIndex(testTime2, timeList)).toBe(0);
			expect(dnTimepickerHelpers.getClosestIndex(testTime3, timeList)).toBe(4);
		}));
	});

	describe('UI function test', function() {
		var $scope, $compile, element, directiveScope;

		beforeEach(inject(function(_$rootScope_, _$compile_) {
	        $scope = _$rootScope_;
	        $compile = _$compile_;

	        element = angular.element('<input type="text" dn-timepicker="HH:mm" ng-model="time">');

			$compile(element)($scope);

			$scope.$digest();

			//directiveScope = element.isolateScope();
	    }));

		it('should have a list of selectable time', function() {
			var list = element.next();

			expect(list.hasClass('dn-timepicker-popup')).toBe(true);
			expect(list.children().length).toBeTruthy();
		});
	});

	// it('should set model value to current date if none given', function() {
	// 	expect($scope.time).toBeTruthy();
	// 	expect($scope.time instanceof Date).toBe(true);
	// });

	// it('should convert time string to Date object', function() {
	// 	var date = new Date();		
	// 	date.setSeconds(0);

	// 	var converted1 = directiveScope.stringToDate('9:15');
	// 	var converted2 = directiveScope.stringToDate('12:15 am');
	// 	var converted3 = directiveScope.stringToDate('12:15 pm');
	// 	var converted4 = directiveScope.stringToDate('9:15 am');
	// 	var converted5 = directiveScope.stringToDate('9:15 pm');

	// 	date.setHours(9);
	// 	date.setMinutes(15);

	// 	expect(converted1 instanceof Date).toBe(true);
	// 	expect(converted1.getTime() == date.getTime()).toBe(true);

	// 	date.setHours(0);
	// 	expect(converted2.getTime() == date.getTime()).toBe(true);

	// 	date.setHours(12);
	// 	expect(converted3.getTime() == date.getTime()).toBe(true);

	// 	date.setHours(9);
	// 	expect(converted4.getTime() == date.getTime()).toBe(true);

	// 	date.setHours(21);
	// 	expect(converted5.getTime() == date.getTime()).toBe(true);
	// });

	// it('should build a list of selectable time', function() {
	// 	var minTime = directiveScope.stringToDate('12:00');
	// 	var maxTime = directiveScope.stringToDate('13:00');

	// 	var timeList = directiveScope.buildTimeList(minTime, maxTime, 15);

	// 	expect(timeList.length).toBe(5);
	// 	expect(timeList[0].getHours()).toBe(12);
	// 	expect(timeList[0].getMinutes()).toBe(0);
	// 	expect(timeList[1].getHours()).toBe(12);
	// 	expect(timeList[1].getMinutes()).toBe(15);
	// 	expect(timeList[2].getHours()).toBe(12);
	// 	expect(timeList[2].getMinutes()).toBe(30);
	// 	expect(timeList[3].getHours()).toBe(12);
	// 	expect(timeList[3].getMinutes()).toBe(45);
	// 	expect(timeList[4].getHours()).toBe(13);
	// 	expect(timeList[4].getMinutes()).toBe(0);
	// });

	// it('should only update the time properties of the model', function() {
	// 	$scope.time = new Date(2012, 11, 15, 13, 30, 0);
	// 	$scope.$apply();

	// 	var updatedTime = new Date(2013, 11, 6, 14, 45, 0);

	// 	directiveScope.update(updatedTime);
	// 	$scope.$apply();

	// 	expect($scope.time.getTime() == updatedTime.getTime()).toBe(false);
	// 	expect($scope.time.getHours() == updatedTime.getHours()).toBe(true);
	// 	expect($scope.time.getMinutes() == updatedTime.getMinutes()).toBe(true);
	// });
});