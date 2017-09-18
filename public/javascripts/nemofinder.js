var app = angular.module('NemoFinder', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/login.html'
        })
        .when('login', {
        	templateUrl: 'partials/login.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);