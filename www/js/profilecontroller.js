/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('profileapp', ['ionic'])
        .controller('profilectrl',function($scope,$http,$ionicLoading,$q,$timeout) {
            $scope.profilepic = "";
            $scope.username = "";
            $scope.name = "";
            $scope.followerslist = [];
            $scope.followinglist = [];
            $scope.followersnumber = 0;
            $scope.followingnumber = 0;
            $scope.location = "";
            $scope.age = 0;
            $scope.status = "";
            $scope.noofposts = 0;
            $scope.email = "";
            $scope.userdata = "";
            $scope.dob = "";
            
            var servername = "http://timestamp-ctrlsense.rhcloud.com";
            //var servername = "http://localhost:8080";
            
            $scope.load = function(){
                if(window.localStorage.username)
                    $scope.username = window.localStorage.username;
                var url = servername+"/getuserprofiledetails?username="+$scope.username.toString();
                $http.get(url).success(function(data) {
                        $scope.userdata = data;
                        $scope.profilepic = $scope.userdata.photo;
                        $scope.name = $scope.userdata.name;
                        $scope.followerslist = $scope.userdata.followerslist;
                        $scope.followinglist = $scope.userdata.followinglist;
                        $scope.followersnumber = $scope.followerslist.length;
                        $scope.followingnumber = $scope.followinglist.length;
                        $scope.email = $scope.userdata.email;
                        $scope.dob = $scope.userdata.dob.toString();
                        console.log(data);
                    }).error(function(err) {
                            console.log(err);
                    });   
            };
})
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



