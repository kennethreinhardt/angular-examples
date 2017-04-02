(function () {
'use strict';

angular.module('MenuApp', ['ui.router']);

angular.module('MenuApp').config(RoutesConfig);

  RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function RoutesConfig($stateProvider, $urlRouterProvider) {
  
    // Redirect to tab 1 if no other URL matches
    $urlRouterProvider.otherwise('/tab1');
  
    // Set up UI states
    $stateProvider
      .state('tab1', {
        url: '/home',
        templateUrl: 'src/tab1.html'
      })
  
      .state('tab2', {
        url: '/categories',
        templateUrl: 'src/tab2.html'
      })
  
      .state('tab3', {
        url: '/items',
        templateUrl: 'src/tab3.html'
      });
  }


})();
