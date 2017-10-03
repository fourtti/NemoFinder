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
        
        }).when('/sonar/fishX/:fishX/fishY/:fishY/fishWeight/:fishWeight', {
            templateUrl: 'partials/sonar.html',
            controller: 'SonarInsert'

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
        currentUser: currentUser,
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

app.controller("OnlineCtrl", ["$scope", "$http", "$location", "authentication",function($scope,$http,$location,authentication){
    $scope.userLogOut = function(){
        console.log("yritit logata ulos");
        authentication.logout();
        console.log("toimi logout");
        $location.path("/home");   
    };
    $scope.searchFunc = function() {
        console.log("kutsuttu searcFunc");
        let searchString = "/fish/list/?long=" + $scope.search.long + "&lat=" + $scope.search.lat + "&maxDistance=" + $scope.search.maxDistance + "&amount=" + $scope.search.amount;
        $http({
            method: 'GET',
            url: searchString

            // success asynchronously when the response is available
            }).then(function successCallback(response) {
                $scope.dataArray = response.data;

            // if an error occurs
            }, function errorCallback(response) {
                console.log("shit they are on to us");

        });

        
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
        //startTimer();

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

        //var myDelay = 2000;
        //var thisDelay = 2000;
        //var start = Date.now();

        //simuloitu kalat javascriptin sisältä, ei tarvitse unity
        function startTimer() {    
            setTimeout(function() {
                var randomSize = getRandomArbitrary(1, 21);
                var randomDepth = getRandomArbitrary(1, 15);
                var randomLat = getRandomArbitrary(-15, 15);
                fishPing(randomSize, randomDepth, randomLat);
                var actual = Date.now() - start;
                thisDelay = myDelay - (actual - myDelay);
                start = Date.now();
                startTimer();
            }, thisDelay);
        }
    });
}]);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

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

    $injector = angular.element(document).injector();
    $injector.get('$http').post('fish/add/'+flong+'/'+flat+'/'+depth);

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
    let fishWidth = 20 + size * 5.5;
    let fishHeight = 0.47619047619 * fishWidth;

	let one_meter = $(".measuring-line").height() / 15;
	let top = (depth * one_meter) - (fishHeight / 2);
	let left = (15 * one_meter) + ((locallat) * one_meter) - (fishWidth / 2);


    //ratio: korkeus = 0.47619047619 * leveys
    //kala maz koko = 300.0width + 142.857142857 height
    //vaihtelu = 40-250
    //1 kokoyksikkö = 8.4 leveys pikseliä

    console.log("creating fish with attributes:\n"
        + "size: "+size + "\n"
        + "depth: " + depth + "\n"
        + "local lat: " + locallat + "\n"
        + "Y-line height: " + $(".measuring-line").height() + "\n"
        + "one meter Y: " + one_meter + "\n"
        + "X-line width: " + $("#surface-line").width() + "\n"
        + "top: " + top + "\n"
        + "left: " + left + "\n"
        );

	let style = 'style="top: '+top+'px; left: '+left+'px; height : '+fishHeight+'px;  width: '+fishWidth+'px;   "';

	let fishId = ("fishIndication_"+fishCount);

	let fish = '<div '+ style + ' class="fish-indication" id="'+ fishId + '">'
	 + '</div>';

	fishId = "#"+fishId;
	$(fish).appendTo($("#fishContainer"));
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
    $injector = angular.element(document).injector();
    $injector.get('$window').location =(whereto);
    //let scope =  $injector.get('$scope');
    //$injector.get('$location').path(whereto);
    //angular.injector(['ng', 'NemoFinder']).get('$location').path(whereto.toString());
    //angular.injector(['ng', 'NemoFinder']).get("Unity").reroute(whereto);
};

app.factory('Unity', [function(){
    return {
    reroute:function (whereto){
        console.log("This is inside the Unity angular factory, headed for "+whereto);
        //$location.path(whereto);
    }
    };
}]);