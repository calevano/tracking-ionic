// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngMap'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $timeout, NgMap) {
    var watchID;
    $scope.directions       = "";
    $scope.latitu_longitude = "";
    NgMap.getMap().then(function(map) {
        // console.log(map.getCenter());
        // console.log('markers', map.markers);
        // console.log('shapes', map.shapes);
    });
    $ionicPlatform.ready(function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><p>Localizando</p>'
        });

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            $scope.latitu_longitude = position.coords.latitude+','+position.coords.longitude;
            $ionicLoading.hide();
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    });

    document.getElementById("watchPosition").addEventListener("click", watchPosition);
    function watchPosition() {
        window.plugins.toast.showLongTop("Comenzo el tracking");
        document.getElementById("address_map").className = "";
        var options = {
            maximumAge          : 3600000,
            timeout             : 3000,
            enableHighAccuracy  : true
        }

        function onSuccess(position) {
            $timeout(function () {
                $scope.directions = position.coords.latitude + ', '+ position.coords.longitude;
                $scope.latitu_longitude = position.coords.latitude+','+position.coords.longitude;
                console.log("$scope.directions_: ", $scope.directions );
            });
        };

        function onError(error) {
            console.log('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
        }
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

    document.getElementById("clearPosition").addEventListener("click", clearPosition);
    function clearPosition(){
        window.plugins.toast.showLongTop("Se termino el Tracking");
        console.log("eliminando_position");
        document.getElementById("address_map").className = "d-hidden";
        navigator.geolocation.clearWatch(watchID);
    }


});
