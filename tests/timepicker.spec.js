describe('Timepicker directive', function() {
	var $scope, element, directiveScope;

	beforeEach(module('dnTimePicker'));

	beforeEach(inject(function($rootScope, $compile) {
		$scope = $rootScope.$new();

		element = angular.element('<input type="text" dn-timepicker min-time="12:00" max-time="13:00" step="15m" ng-model="time">');

		$compile(element)($scope);

		$scope.$digest();

		directiveScope = element.isolateScope();
	}));

	it('should set model value to current date if none given', function() {
		expect($scope.time).toBeTruthy();
	});

	it('should convert time string to Date object', function() {
		var date = new Date();
		date.setHours(12);
		date.setMinutes(15);
		date.setSeconds(0);

		var converted = directiveScope.stringToDate('12:15');

		expect(converted instanceof Date).toBe(true);
		expect(converted.getTime() == date.getTime()).toBe(true);
	});

	it('should convert Date object to time string', function() {
		var date = new Date();
		date.setHours(12);
		date.setMinutes(15);
		date.setSeconds(0);

		var converted = directiveScope.dateToString(date);

		expect(typeof converted === 'string').toBe(true);
		expect(converted === '12:15').toBe(true);
	})

	it('should build a list of selectable time', function() {
		var minTime = directiveScope.stringToDate('12:00');
		var maxTime = directiveScope.stringToDate('13:00');

		var timeList = directiveScope.buildTimeList(minTime, maxTime, 15);

		expect(timeList.length).toBe(5);
	});
})