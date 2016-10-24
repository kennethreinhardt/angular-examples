(function () {
'use strict';

angular.module('LunchCheck', [])
.controller('LunchCheckController', LunchCheckController);

LunchCheckController.$inject = ['$scope'];

function LunchCheckController($scope) {
  $scope.checkIfTooMuch = function () {
    if ($scope.lunchDishes == null || $scope.lunchDishes == "") {
      $scope.lunchMessage = "Please enter data first";
    } else {
      var str =  $scope.lunchDishes;
      var result = str.split(",");
      if (result.length > 0 && result.length < 4) {
        $scope.lunchMessage = "Enjoy";
      } else {
        $scope.lunchMessage = "Too much...";
      }
    }
  };

}

})();
