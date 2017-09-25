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

        }).when('/sonar/fishX/:fishX/fishY/:fishY/fishWeight/:fishWeight', {
            templateUrl: 'partials/sonar.html',
            controller: 'SonarInsert'

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
    });
}]);

app.controller('SonarInsert', ['$scope', '$resource', function($scope, $resource){
    alert("perkele");
}]);

