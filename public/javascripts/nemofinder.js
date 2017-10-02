var app = angular.module('NemoFinder', ['ngResource','ngRoute']);
var openView = "home";
var fishCount = 0;
var loadsoffish;

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

        }).when('/drone', {
            templateUrl: 'partials/drone.html',
            controller: 'DroneControl'

        }).when('/localmaps', {
            templateUrl: 'partials/localmaps.html',
            controller: 'LocalMapsControl'

        }).otherwise({
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
    	openView = "home";

        $('body').css( {
            "background" : "url(../../images/fishing_background_1.png)"
        });
    });
}]);


app.controller('SonarCtrl', ['$scope', '$resource', function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
    	openView = "sonar";

    	//asetetaan backgroundi oikeaksi
        $('body').css( {
            "background-image" : "none",
            "background-color" : "black"
        });

        $(window).resize(function() {
		  	$(".measuring-line").css( {
		  		"height" : ($(window).height()-160)+"px"
		  	})
		  	adjustMeasurementLines();
		  	adjustSonarWidth();
		  	adjustSonarIndicator();
		  	$(".measuring-line-second").css( {
		  		"margin-left" : $("#surface-line").width()
		  	})
		  	$("#fishContainer").height($(".measuring-line").height());
		  	$("#fishContainer").width($("#surface-line").width());

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



app.controller('DroneControl', ['$scope', '$resource', function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
        showDrone();
    });

    $scope.$on('$destroy', function() {
        showDrone();
    });
}]);

app.controller('LocalMapsControl', ['$scope', '$resource', function($scope, $resource){
}]);

function addFish(flat,flong,depth,size){
    console.log("addFish general call");
    if (window.location.href.indexOf("localmaps") != -1){
    console.log("addFish maps update");
    var marker = new google.maps.Marker({
        position: {lat: flat, lng: flong},
        map: window.map,
        title: "Fish : "+depth+"m deep, "+size+"kg"
      });
    }
}

function fishPing(size,depth,locallat){
    console.log("fishPing general call, size: " + size +  ", depth: " + depth + ", locallat:  " + locallat);
    if (openView === "sonar") {
    	addfishIndication(size,depth,locallat);
    }
}

function addfishIndication(size,depth,locallat) {
	let one_meter = $(".measuring-line").height() / 15;
	console.log("measuring lina Y-suunta korkeus: "+$(".measuring-line").height());
	let one_meter_lat = $("#surface-line").width() / 30;
	console.log("Surface line X-suunta leveys: "+$("#surface-line").width());
	let top = (depth * one_meter);
	let left = (15 + locallat * one_meter_lat);

	//console.log("margintop is: " + margintop + ", depth is: " + depth
	// + ", onemeter is: " + one_meter
	// + ", measuring-line height is: "  + $(".measuring-line").height());

	let style = 'style="top: '+top+'px; left: '+left+'px; "';

	let fishId = ("fishIndication_"+fishCount);

	let fish = '<div '+ style + ' class="fish-indication" id="'+ fishId + '">'
		+ '<img src="../../images/nemofinder_fish_indicator_4.png" alt="" />'
	 + '</div>';

	fishId = "#"+fishId;
	$(fish).appendTo($("[ng-view]"));
	fishCount++;
	//console.log("selector: " + $(fishId).attr("selector"));

	$(fishId).fadeOut(2000, function() {
		//console.log("removing fish: "+fishId);
		$(fishId).remove();
	});
	
}



function showDrone(){
    if (window.location.href.indexOf("drone") == -1){
        console.log("hide");
        document.getElementById("unityPlayer").style.visibility='hidden';
    } else {
        console.log("show");
        document.getElementById("unityPlayer").style.visibility='visible';
    }
}

function hideDrone(){
    showDrone();
}

function reroute(whereto){
    console.log("This would handle unity UI redirects, but they currently have issues.");
}