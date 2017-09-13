var app = angular.module('NemoFinder', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'

        }).otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
	function($scope, $resource){

	}]);

app.controller('LoginCtrl', ['$scope', '$resource', 
	function($scope, $resource){

	}]);