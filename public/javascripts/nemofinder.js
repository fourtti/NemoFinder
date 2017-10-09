var app = angular.module('NemoFinder', ['ngResource','ngRoute']);
var loadsoffish =  JSON.parse(localStorage.getItem('fishdata'));
var loadsofids =  JSON.parse(localStorage.getItem('fishids'));
var fishmaps = []; 
//fishmaps = JSON.parse(localStorage.getItem('locmaps'));; //used to store local maps, as an array: [name,[fish]]
var fishmarkers = []; //stores google map markers so they can be removed
var sonar = false;
var mymapindex = 0;

if(window.localStorage.getItem('fishdata')=='null' || window.localStorage.getItem('fishdata')=='undefined'){
    //console.log("setting up data storage");
    loadsoffish = [];
    localStorage.setItem('fishdata', JSON.stringify(loadsoffish)); 
} else {
    var loadsoffish =  JSON.parse(localStorage.getItem('fishdata'));
}
if(window.localStorage.getItem('fishids')=='null' || window.localStorage.getItem('fishids')=='undefined'){
    //console.log("setting up data storage");
    loadsofids = [];
    localStorage.setItem('fishids', JSON.stringify(loadsofids)); 
} else {
    var loadsofids =  JSON.parse(localStorage.getItem('fishids'));
}
if(window.localStorage.getItem('locmaps')=='null' || window.localStorage.getItem('locmaps')=='undefined'){
    //console.log("setting up data storage");
    fishmaps = [];
    localStorage.setItem('locmaps', JSON.stringify(fishmaps)); 
} else {
    var fishmaps =  JSON.parse(localStorage.getItem('locmaps'));
}

var openView = "home";
var fishCount = 0;


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
        
        }).when('/onlinemap', {
            templateUrl: 'partials/onlinemap.html',
            controller: 'OnlineMapCtrl'
        
        }).when('/sonar/fishX/:fishX/fishY/:fishY/fishWeight/:fishWeight', {
            templateUrl: 'partials/sonar.html',
            controller: 'SonarInsert'

        }).when('/drone', {
            templateUrl: 'partials/drone.html',
            controller: 'DroneControl'

        }).when('/localmaps', {
            templateUrl: 'partials/localmaps.html',
            controller: 'LocalMapsControl'

        }).when('/mymaps', {
            templateUrl: 'partials/mymaps.html',
            controller: 'MyMapsControl'

        }).when('/openmap', {
            templateUrl: 'partials/openmap.html',
            //controller: 'MyMapsControl'

        }).when('/mySavedMaps',{
            templateUrl: 'partials/viewmaps.html',
            controller: 'savedMapControl'
        }).when('/:id/viewMap',{
            templateUrl: 'partials/singleMap.html',
            controller: 'singleMapController'
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
        //console.log("token removed");

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
            //console.log(payload);
            return{
                email: payload.email,
                name: payload.name,
                id: payload._id
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
    $scope.$on('$viewContentLoaded', function(){
        openView = "login";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url('../../images/fishing_background_5.jpg')"
        });
    });
    $scope.userLogin = function(){
        //console.log("login function");
        authentication.login($scope.user).then(function(){
            //console.log('tuli reittiin');
            $location.path("/online");
        });
        
    };
}]);

app.controller("OnlineCtrl", ["$scope", "$location", "authentication",function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        openView = "online";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url('../../images/fishing_background_5.jpg')"
        });
    });
    $scope.user = authentication.currentUser();
    $scope.isLoggedIn = authentication.isLoggedIn();
    $scope.userLogOut = function(){
        //console.log("yritit logata ulos");
        authentication.logout();
        //console.log("toimi logout");
        $location.path("/home");   
    };

}]);

app.controller("OnlineMapCtrl", ["$scope", "$http", "$location", "authentication",function($scope,$http,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        openView = "online";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url('../../images/fishing_background_5.jpg')"
        });
    });


    $scope.user = authentication.currentUser();
    $scope.isLoggedIn = authentication.isLoggedIn();
    $scope.userLogOut = function(){
        //console.log("yritit logata ulos");
        authentication.logout();
        //console.log("toimi logout");
        $location.path("/home");   
    };

    $scope.searchFunc = function() {
        //console.log("kutsuttu searcFunc");
        let searchString = "/fish/list/?long=" + $scope.search.long + "&lat=" + $scope.search.lat + "&maxDistance=" + $scope.search.maxDistance + "&amount=" + $scope.search.amount;
        $http({
            method: 'GET',
            url: searchString

            // success asynchronously when the response is available
            }).then(function successCallback(response) {
                let dataArray = response.data;

                let location = { lat: parseFloat($scope.search.lat), lng: parseFloat($scope.search.long) };
                window.map.setCenter(location);

                for(item in dataArray) {
                    if(dataArray.hasOwnProperty(item)){
                        //console.log("iterate array");
                        let long = dataArray[item].obj.coords[0];
                        let lat = dataArray[item].obj.coords[1]; 

                        let marker = new google.maps.Marker({

                            position: {lat: lat, lng: long },
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                strokeColor: "red",
                                scale: 3
                            },
                        map: window.map,
                        title: "Boat"
                        });
                        //console.log("after marker attempt");
                    }
                }
       
            // if an error occurs
            }, function errorCallback(response) {
                //console.log("shit they are on to us");
        });
    };

}]);



app.controller('HomeCtrl', ['$scope', '$resource', 'authentication', function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
        openView = "home";

        $('body').css( {
        	"background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url('../../images/fishing_background_5.jpg')"
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
        openView = "drone";
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url('../../images/fishing_background_5.jpg')"
        });
    });

    $scope.$on('$destroy', function() {
        showDrone();
    });
}]);

app.controller('LocalMapsControl', ['$scope', '$resource', function($scope, $resource){
    openView = "localmaps";
    $scope.$on('$viewContentLoaded', function(){
        $('body').css( {
            "background": "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url('../../images/fishing_background_5.jpg')"
        });
    });
}]);

app.controller('MyMapsControl', ['$scope', '$resource', function($scope, $resource){
    $scope.$on('$viewContentLoaded', function(){
        const mapdiv = document.getElementById('mapsdiv');
        //console.log( document.getElementById('map-btn-template').childNodes[1]);
        for(let i=0;i<fishmaps.length;i++){
            //let mapbtn = document.importNode(document.getElementById('map-btn-template').content, true);
            let mapbtn = document.getElementById('map-btn-template').childNodes[1].cloneNode(true);
            let ii=i+0;
            //console.log(mapbtn.childNodes[1]);
            mapbtn.childNodes[1].onclick = function(){mymapindex=ii;};
            mapbtn.childNodes[1].innerText=""+fishmaps[i][0];
            mapdiv.appendChild(mapbtn);
        }
    });
}]);

app.controller('savedMapControl',['$scope', '$resource', 'authentication', function($scope,$resource,authentication){
    $scope.user = authentication.currentUser();
    $scope.isLoggedIn = authentication.isLoggedIn();
    let url = '/users/' + $scope.user.id + '/maps';
    //console.log(authentication.getToken());
    let maps = $resource(url,{},{
            get:{
                method: "GET",
                headers:{Authorization: "Bearer " + authentication.getToken()},
                isArray:true
            }
    });

        maps.get(function(maparray){
            $scope.maps = maparray;
            });
}]);

app.controller('singleMapController',['$scope','$resource','authentication','$routeParams', function($scope,$resource,authentication,$routeParams){
    $scope.user = authentication.currentUser();
    $scope.isLoggedIn = authentication.isLoggedIn();
    let map = $resource('/api/maps/' + $routeParams.id + '/fishdata',{}, {
            get:{
                method: "GET",
                headers:{Authorization: "Bearer " + authentication.getToken()},
                isArray:true
            }
    });
    map.get(function(dataArray){
        for(let i = 0; i < dataArray.length; i++){
        var marker = new google.maps.Marker({
            position: {lat: dataArray[i].coords[1], lng: dataArray[i].coords[0]},
            icon: "../../images/tinygoldfish.png",
            map: window.map
            });
        };

    });
}]);

function addFish(flat,flong,size,depth){

    loadsoffish.push([flat,flong,depth,size]);
    localStorage.setItem('fishdata', JSON.stringify(loadsoffish));
    $injector = angular.element(document).injector();
    $injector.get('$http').post('fish/add/'+flong+'/'+flat+'/'+depth).then(function(data){
        loadsofids.push(data.data.id);
        localStorage.setItem('fishids', JSON.stringify(loadsofids)); 
        });

    if (window.location.href.indexOf("localmaps") != -1){

        var marker = new google.maps.Marker({
            position: {lat: flat, lng: flong},
            icon: "../../images/tinygoldfish.png",
            map: window.map,
            title: "Fish : "+depth+"m deep, "+size+'kg'
            });
        fishmarkers.push(marker);
        };
    };

function fishestomap(){

      for(let i = 0; i < loadsoffish.length; i++){
        var marker = new google.maps.Marker({
            position: {lat: loadsoffish[i][parseFloat(0)], lng: loadsoffish[i][parseFloat(1)]},
            icon: "../../images/tinygoldfish.png",
            map: window.map,
            title: "Fish : "+loadsoffish[i][2]+"m deep, "+loadsoffish[i][3]+'kg'
            });
        fishmarkers.push(marker);
        };
    };

function mapfishes(){
      for(let i = 0; i < fishmaps[mymapindex][1].length; i++){
        var marker = new google.maps.Marker({
            position: {lat: fishmaps[mymapindex][1][i][parseFloat(0)], lng: fishmaps[mymapindex][1][i][parseFloat(1)]},
            icon: "../../images/tinygoldfish.png",
            map: window.map,
            title: "Fish : "+fishmaps[mymapindex][1][i][2]+"m deep, "+fishmaps[mymapindex][1][i][3]+'kg'
            });
        fishmarkers.push(marker);
        };
};

function saveMap(){
    let mapnamefield=document.getElementById('mapnameinput');
    if(mapnamefield.value.length>0){
        $injector = angular.element(document).injector();
        let win = $injector.get('$window');
        let user = JSON.parse(win.atob((angular.injector(['ng', 'NemoFinder']).get("authentication").getToken().split(".")[1])));
        fishmaps.push([mapnamefield.value,loadsoffish]);
        localStorage.setItem('locmaps', JSON.stringify(fishmaps));
        if(user._id.length>0){
            $injector.get('$http').post('/api/maps/new',{name: mapnamefield.value, fishdata: loadsofids, owner: user._id, private:false}).then(function(){});
            clearFishes();
            mapnamefield.value="";
        };
    };
};

function clearFishes(){
    loadsoffish=[];
    localStorage.setItem('fishdata', JSON.stringify(loadsoffish));
    loadsofids = [];
    localStorage.setItem('fishids', JSON.stringify(loadsofids)); 
    clearMarkers();
}

function clearMarkers(){
    for(let i = 0; i < fishmarkers.length; i++){
        fishmarkers[i].setMap(null);
    };
    fishmarkers=[];
}

function clearMaps(){
    fishmaps = [];
    localStorage.setItem('fishids', JSON.stringify(fishmaps)); 
}

function sonarON(){
    let btn = document.getElementById('togglebtn');
    u.getUnity().SendMessage("DroneSonar", "ToggleON","");
    btn.innerHTML='Sonar OFF';
    btn.onclick = function() { sonarOFF();};
    sonar=true;
}

function sonarOFF(){
    let btn = document.getElementById('togglebtn');
    u.getUnity().SendMessage("DroneSonar", "ToggleOFF","");
    btn.innerHTML='Sonar ON';
    btn.onclick = function() { sonarON();};
    sonar=false;
}

function fishPing(size,depth,locallat){
    
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
        //console.log("hide");
        document.getElementById("unityPlayer").style.visibility='hidden';
    } else {
        //console.log("show");
        document.getElementById("unityPlayer").style.visibility='visible';
    }
}

function hideDrone(){
    showDrone();
}

function reroute(whereto){
    //console.log("This would handle unity UI redirects, but they currently have issues.");
    /*
    $injector = angular.element(document).injector();
    $injector.get('$window').location =(whereto);
    */
    //let scope =  $injector.get('$scope');
    //$injector.get('$location').path(whereto);
    //angular.injector(['ng', 'NemoFinder']).get('$location').path(whereto.toString());
    //angular.injector(['ng', 'NemoFinder']).get("Unity").reroute(whereto);
};

app.factory('Unity', [function(){
    return {
    reroute:function (whereto){
        //console.log("This is inside the Unity angular factory, headed for "+whereto);
        //$location.path(whereto);
    }
    };
}]);