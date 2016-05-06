// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
        .controller('loginctrl', function($scope,$http) {
            
    $scope.username = "";
    //var servername = "http://timestamp-ctrlsense.rhcloud.com";
    var servername = "http://localhost:8080";
    var usernamenotification = "notavailable";
    $scope.checkusername = function(){
        $scope.username = document.getElementById("username").value;
        var url = servername+"/checkusername?username="+$scope.username;
        var usernamenotification = document.getElementById("usernamenotification");
        console.log($scope.username);
        if($scope.username.length < 5){
            usernamenotification.innerHTML = "Please Enter at least 5-digit username";
            return;
        }
                $http.get(url).success(function(data) {
                        usernamenotification.innerHTML = data;
                    }).error(function(err) {
			console.log(err);
                    });
    };
    
    $scope.setupusernameandlogin = function(){
        if(document.getElementById("usernamenotification").innerHTML == "not available"){
            alert("please enter a valid username");
            return;
        };
        var userdata = $scope.userdata;
        userdata = JSON.parse(userdata);
        userdata.username = document.getElementById("username").value;
        var url = servername+"/signupdetails?";
        url += "name="+userdata.name;
        url += "&username=" + userdata.username;
        url += "&id=" + userdata.id;
        url += "&birthday=" + userdata.birthday;
        url += "&gender=" + userdata.gender;
        url += "&email=" + userdata.email;
        url += "&photo=" +userdata.photo;
        $http.get(url).success(function(data) {
            
                          window.localStorage.userdata = JSON.stringify(userdata);
                          console.log(userdata);
                          window.localStorage.username = data;
                          window.location.href = "event.html";
                                                			
                    }).error(function(err) {
                        alert("network error");
			console.log(err);
                  });
    };
    // Defaults to sessionStorage for storing the Facebook token
    // openFB.init({appId: '1707847982796388'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
      openFB.init({appId: '1707847982796388', tokenStore: window.localStorage});

    $scope.loginusingfb = function(){
        //if(!window.localStorage.fbAccessToken){
        login();      
    };

    function login() {
        openFB.login(
                function(response) {
                    if(response.status === 'connected') {
                        console.log('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
                    } else {
                        console.log('Facebook login failed: ' + response.error);
                    }
                }, {scope: 'email,public_profile,publish_actions,user_birthday,user_photos,read_custom_friendlists'});
         getInfo();
         
    }

    function getInfo() {
        openFB.api({
            path: '/me',
            params: {fields: 'id,name,gender,email'},
            success: function(data) {
                data.photo = 'http://graph.facebook.com/' + data.id + '/picture?type=large';
                console.log(JSON.stringify(data));
                var url = servername+"/checkifuserisnew?fbid="+data.id.toString();
                $http.get(url).success(function(responsedata) {
                        console.log(responsedata);
                        if(responsedata == 'newuser'){
                            $scope.userdata = JSON.stringify(data);
                            $scope.mainpart = "getuniqueusername";
                        }
                        else{
                            console.log(responsedata);
                            window.localStorage.username = responsedata;
                            window.localStorage.userdata = JSON.stringify(data);
                            window.location.href = "event.html";
                        }			
                    }).error(function(err) {
			console.log(err);
                    });
            },
            error: errorHandler});
    }

    function share() {
        console.log(document.getElementById('Message').value);
        openFB.api({
            method: 'POST',
            path: '/me/feed',//"watching london has fallen with @[{589464594539840}:1:{Madhav Kumar}] ''
            params: {
                message: "watching london has fallen with @[{830963493716943}:1:{Himanshu Raj}]"
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: errorHandler});
    }

    function readPermissions() {
        openFB.api({
            method: 'GET',
            path: '/me/permissions',
            success: function(result) {
                alert(JSON.stringify(result.data));
            },
            error: errorHandler
        });
    }

    function revoke() {
        openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                },
                errorHandler);
    }
    
    var successHandler = function(result){
        console.log(result);
    } 
    
    $scope.getfriendlist = function(){
        openFB.api({path: '/me/friends', success: successHandler, error: errorHandler});
    }
    
    function logout() {
        openFB.logout(
                function() {
                    alert('Logout successful');
                },
                errorHandler);
    }

    function errorHandler(error) {
        alert(error.message);
    }

    $scope.mainpart = "login";
    $scope.load = function(){
        if(window.localStorage.username){
            window.location.href = "event.html";
        }  
    };
    $scope.changemainpart = function(mainpart){
        $scope.mainpart= mainpart;
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
