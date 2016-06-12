/**
 * @class TimeService
 * @classdesc
 * @ngInject
 */
function TimeService($log, $interval, cfg) {

  // jshint shadow: true
  var TimeService = this;

  TimeService.now = new Date(2016, 5, 1, 12, 0);

  var clockStepMonths = 1;

  var addTime = function() {
    TimeService.now.setMonth(TimeService.now.getMonth() + clockStepMonths);
  };

  TimeService.tick = function() {
    // call monthly function
    addTime();
  };

  var stop;

  TimeService.clock = function() {
    if(angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
    else {
      stop = $interval(TimeService.tick, 2 * 1000);
    }
  };

}


angular.module('timeService', []).service('TimeService', TimeService);