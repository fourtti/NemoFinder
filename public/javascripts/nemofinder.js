var app = angular.module('NemoFinder', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        }).when('/sonar', {
            templateUrl: 'partials/sonar.html',
            controller: 'SonarCtrl'
        }).when('/online', {
            templateUrl: 'partials/online.html',
            controller: 'OnlineCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.service("authentication", ["$window","$http", function($window,$http){
    var saveToken = function (token){
        $window.localStorage["nemo-token"] = token;
    };
    var getToken = function (){
        return $window.localStorage["nemo-token"];
    };
//    var register = function(user){
//        return $http.post("/users/register", user).success(function(data){
//            saveToken(data.token);
//        });
//    };
    var login = function(user){
        return $http.post("/users/login", user).success(function(data){
            saveToken(data.token);
        });
    };
    var logout = function(){
        $window.localStorage.removeItem("nemo-token");
        console.log("token removed");

    };
    var isLoggedIn = function(){
        var token = getToken();

        if (token){
            var payload = JSON.parse($window.atob(token.split(".")[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    var currentUser = function(){
        if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split(".")[1]));
            return{
                email: payload.email,
                name: payload.name
            };
        }
    };


    return {
        saveToken: saveToken,
        getToken: getToken,
        //register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser
    };
}]);


app.controller("LoginCtrl", ["$scope","$location", "authentication",function($scope,$location,authentication){
    $scope.userLogin = function(){
        console.log("login function");
        authentication.login($scope.user).then(function(){
        console.log('tuli reittiin');
        $location.path("/online");
        });
        
    };
}]);

app.controller("OnlineCtrl", ["$scope", "$location", "authentication",function($scope,$location,authentication){
    $scope.userLogOut = function(){
        console.log("yritit logata ulos");
        authentication.logout();
        console.log("toimi logout");
        $location.path("/home");   
    };
}]);

app.controller('HomeCtrl', ['$scope', '$resource',  function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
        $('body').css( {
            "background" : "url(../../images/fishing_background_1.png)"
        });
    });
}]);


app.controller('SonarCtrl', ['$scope', '$resource', function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
    	//asetetaan backgroundi oikeaksi
        $('body').css( {
            "background-image" : "none",
            "background-color" : "black"
        });

        $(window).resize(function() {
		  	$("#measuring-line").css( {
		  		"height" : ($(window).height()-80)+"px"
		  	})
		  	adjustMeasurementLines();
		});
		$(window).trigger('resize');

		function adjustMeasurementLines() {
			var fromtop = $('#measuring-line').height()/5 - 2;
			$('#measuring-line').children('div').each(function () {
				if (!($(this).is(':first-child'))) {
					$(this).css( {
		    			"margin-top" : fromtop+"px"
		    		})
				}
			});
		}

    });

}]);

