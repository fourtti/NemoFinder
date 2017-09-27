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

        }).when('/drone', {
            templateUrl: 'partials/drone.html',
            controller: 'DroneControl'

        }).otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource',  function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
        $('body').css( {
            "background" : "url(../../images/fishing_background_1.png)"
        });
    });
}]);

app.controller('LoginCtrl', ['$scope', '$resource', 
	function($scope, $resource){

	}]);

app.controller('SonarCtrl', ['$scope', '$resource', function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
    	//asetetaan backgroundi oikeaksi
        $('body').css( {
            "background-image" : "none",
            "background-color" : "black"
        });

        $(window).resize(function() {
		  	$(".measuring-line").css( {
		  		"height" : ($(window).height()-80)+"px"
		  	})
		  	adjustMeasurementLines();
		  	adjustSonarWidth();
		  	adjustSonarIndicator();
		  	$(".measuring-line-second").css( {
		  		"margin-left" : $("#surface-line").width()
		  	})
		});

		$(window).trigger('resize');

		function adjustMeasurementLines() {
			var fromtop = $('.measuring-line-first').height()/5 - 2;
			$('.measuring-line-first').children('div').each(function () {
				if (!($(this).is(':first-child'))) {
					$(this).css( {
		    			"margin-top" : fromtop+"px"
		    		})
				}
			});
		}

		function adjustSonarWidth() {
			$("#surface-line").css( {
				"width" : $(".measuring-line").height() * 2
			})
		}

		function adjustSonarIndicator() {
			$("#radar-indicator").css( {
				"margin-left" : $("#surface-line").width() / 2
			})
		}
		//X == -15 to +15 (etu-taka)
		//depth 0 to 15
		//size 1-26 //arvo, ei kiloja

		function fishPing(size, depth, paramX) {
			console.log("Fishping called: ");
			//$('<img src="../../images/nemofinder_fish_indicator_4.png" alt=""'
			//	+ 'style=""'
			//	+ '/>').appendTo($("body"));
		} 
    });
}]);



app.controller('DroneControl', ['$scope', '$resource', function($scope, $resource){
}]);

function addFish(lat,long,depth,size){
    console.log("addFish call");
}

function fishPing(size,depth,locallat){
    console.log("fishPing general call");
}

function showDrone(){
    console.log("droning");
    if (window.location.href.indexOf("drone") == -1){
        console.log("hide");
        document.getElementById("unityPlayer").style.visibility='hidden';
    } else {
        console.log("show");
        document.getElementById("unityPlayer").style.visibility='visible';
    }
}

function revealDrone(){
    document.getElementById("unityPlayer").style.visibility='visible';
}

function hideDrone(){
    document.getElementById("unityPlayer").style.visibility='hidden'; 
}