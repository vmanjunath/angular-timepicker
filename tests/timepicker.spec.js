describe('Timepicker directive', function() {
	var $scope, element, directiveScope;

	beforeEach(module('dnTimePicker'));

	beforeEach(inject(function($rootScope, $compile) {
		$scope = $rootScope.$new();

		element = angular.element('<input type="text" dn-timepicker ng-model="time">');

		$compile(element)($scope);

		$scope.$digest();

		directiveScope = element.isolateScope();
	}));

	it('should set model value to current date if none given', function() {
		expect($scope.time).toBeTruthy();
	});

	it('should convert time string to Date object', function() {
		var date = new Date();		
		date.setSeconds(0);

		var converted1 = directiveScope.stringToDate('9:15');
		var converted2 = directiveScope.stringToDate('12:15 am');
		var converted3 = directiveScope.stringToDate('12:15 pm');

		date.setHours(9);
		date.setMinutes(15);

		expect(converted1 instanceof Date).toBe(true);
		expect(converted1.getTime() == date.getTime()).toBe(true);

		date.setHours(0);
		expect(converted2.getTime() == date.getTime()).toBe(true);

		date.setHours(12);
		expect(converted3.getTime() == date.getTime()).toBe(true);
	});

	it('should build a list of selectable time', function() {
		var minTime = directiveScope.stringToDate('12:00');
		var maxTime = directiveScope.stringToDate('13:00');

		var timeList = directiveScope.buildTimeList(minTime, maxTime, 15);

		expect(timeList.length).toBe(5);
	});
});