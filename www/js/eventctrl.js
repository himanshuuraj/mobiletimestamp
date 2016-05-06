angular.module('eventapp', ['ionic','swipe'])
        .controller('eventctrl',function($scope,$http,$ionicLoading,$q,$ionicModal,$ionicPopup,$timeout) {
            
            $scope.eventnamearray = [];
            $scope.username = "";
            $scope.showfooter = false;
            $scope.eventname = "";
            $scope.showpage = "mainpage";
            //var servername = "http://timestamp-ctrlsense.rhcloud.com";
            var servername = "http://localhost:8080";
            $scope.tags = "";
            var updatingtime = false;
            var friendtextbox = document.getElementById("friendtextbox");
            var friendtextvalue = friendtextbox.value;
            var friendarrayinevent = [];
            
            var friendstag = {
                username : "abc",
                name: "abc"
            }
            
            $scope.datatoaddevent = {
                username : "",
                name : "",
                tags : "",
                memories : "",
                opentofriend : "",
                date : "",
                place : "",
                review : "",
                rate : "",
                theatre : "",
                photo : [],
                friendsarray :[]
            };
            
            var frienddetails = {
                name : "",
                photo : "",
                username : ""
            };
            
            $scope.showLoading = function() {
                $ionicLoading.show({
                   template: 'Loading...'
                });
            };

            $scope.hideLoading = function(){
                $ionicLoading.hide();
            };
            
            $scope.check = function(){
               alert('check');
            };
            
            $scope.addneweventinneweventtype = function(){
                window.localStorage.removeItem("eventnamearray");
                $scope.showpage = 'showeventaddingpage';
            };

            $scope.eventnamesuggestion = [];
            $scope.setnameintextbox = function(str){
                $scope.datatoaddevent.name = str;
                $scope.eventnamesuggestion = [];
            };
            
            $scope.getnamesuggestion = function(){
                if($scope.datatoaddevent.name == ""){
                    $scope.eventnamesuggestion = [];
                    return;
                }
                var url = servername;
                if($scope.eventname == "movie"){
                    url += "/givemoviesuggestion?moviename="+$scope.datatoaddevent.name;
                }
                else if($scope.eventname == "restaurant"){
                    url += "/giverestaurantsuggestion?restaurantname="+$scope.datatoaddevent.name;
                }
                else if($scope.eventname == "lifetimeevents"){
                    url += "/givelifetimeeventssuggestion?lifetimeeventsname="+$scope.datatoaddevent.name;
                }
                else if($scope.eventname == "tour"){
                    url += "/givetoursuggestion?tourname="+$scope.datatoaddevent.name;
                }
                else if($scope.eventname == "festival"){
                    url += "/givefestivalsuggestion?festivalname="+$scope.datatoaddevent.name;
                }
                else{
                    return;
                }
                $http.get(url).success(function(data) {
                    if(data.toString() != "no suggestion available")
                      $scope.eventnamesuggestion = data;
                    else
                      $scope.eventnamesuggestion = [];
                    }).error(function(err) {
                        alert("Network error");
                  }); 
            };
            
            $scope.addneweventtype = function(){
                $scope.eventname = "";
                $scope.datatoaddevent.name = "";
                $scope.datatoaddevent.username = "";
                $scope.datatoaddevent.name = "";
                $scope.datatoaddevent.tags = "";
                $scope.datatoaddevent.memories = "";
                $scope.datatoaddevent.opentofriend = "";
                $scope.datatoaddevent.date = "";
                document.getElementById("date").value = "";
                $scope.datatoaddevent.place = "";
                $scope.datatoaddevent.review = "";
                $scope.datatoaddevent.rate = "";
                $scope.datatoaddevent.theatre = "";
                $scope.showpage = "showneweventaddingpage";
            };
            
            $scope.load = function(){
                if(window.localStorage.username)
                    $scope.username = window.localStorage.username;
                $scope.getalleventnames();
               // $scope.getlongtimeaccesstoken();
            }; 
            
            $scope.getalleventnames = function(){
                if(window.localStorage.eventnamearray){
                    $scope.eventnamearray = JSON.parse(window.localStorage.eventnamearray);
                    return;
                }
                $scope.showLoading();
                var url = servername+"/getalleventname?username="+$scope.username;
                $http.get(url).success(function(data) {
                      $scope.eventnamearray = [];
                      for(var index = 0; index<data.length; index++)
                          $scope.eventnamearray.push(data[index].toString().substring(6));
                      $scope.eventnamearray.sort();
                      $scope.hideLoading();
                      window.localStorage.eventnamearray = JSON.stringify($scope.eventnamearray);
                    }).error(function(err) {
                        $scope.hideLoading();
                        alert("network error");
			console.log(err);
                  });  
            };
            
            $scope.showaddeventpage = function(){
              $scope.showpage = 'showeventaddingpage';  
              $scope.datatoaddevent.name = "";
              $scope.datatoaddevent.username = "";
              $scope.datatoaddevent.name = "";
              $scope.datatoaddevent.tags = "";
              $scope.datatoaddevent.memories = "";
              $scope.datatoaddevent.opentofriend = "";
              $scope.datatoaddevent.date = "";
              document.getElementById("date").value = "";
              $scope.datatoaddevent.place = "";
              $scope.datatoaddevent.review = "";
              $scope.datatoaddevent.rate = "";
              $scope.datatoaddevent.theatre = "";
              $scope.datatoaddevent.photo = [];
              $scope.imageuploadingindex = 0;
            };
             
            $scope.getfriendsuggestion = function(){
                var friendtextbox = document.getElementById("friendtextbox");
                var friendtextvalue = friendtextbox.value;
                $scope.friendsuggestion = [];
                var texttogetsuggestion = "";
                if(friendtextvalue == "" || friendtextvalue == undefined)
                    return;
                if(friendtextvalue.toString().indexOf(",") != -1)
                {
                    var lastindexofseperator = friendtextvalue.toString().lastIndexOf(",");
                    texttogetsuggestion = friendtextvalue.substring(lastindexofseperator+1);
                }
                else
                    texttogetsuggestion = friendtextvalue;
                var url = servername + "/friendsuggestion?name=" + texttogetsuggestion;
                $http.get(url).success(function(data){
                    if(data == "no suggestion available")
                        $scope.friendsuggestion = [];
                    else
                        $scope.friendsuggestion = data;
                }).error(function(err){
                    alert('network error');
                });
            };

            var frienddetailintheeventarray = [];           
            $scope.setfriendintextbox = function(name,username){
                friendstag = {
                    name : name,
                    username : username  
                };
               $scope.datatoaddevent.friendsarray.push(friendstag);
               $scope.friendsuggestion = [];
               var friendtextbox = document.getElementById("friendtextbox");
               var friendtextvalue = friendtextbox.value;
               console.log(friendtextvalue);
               if(friendtextvalue.toString().indexOf(",") == -1){
                   friendtextvalue = "";
                   friendtextvalue += name+",";
                   console.log(friendtextvalue);
               }
               else{
                   var lastindexofseperator = friendtextvalue.toString().lastIndexOf(",");
                   friendtextvalue = friendtextvalue.substring(0,lastindexofseperator);
                   friendtextvalue += "," + name+",";
               }
               friendtextbox.value = friendtextvalue;
               $scope.datatoaddevent.tags = friendtextvalue;
               
            };
            
            $scope.deleteevent = function(eventid){
                
                $scope.showLoading();
                var url = servername+"/deleteinevents?&username="+$scope.username+"&eventtype="+"event_"+$scope.eventname+"&_id="+eventid;
                $http.get(url).success(function(data){
                    $scope.eventdescription= data;
                    window.localStorage["event_"+$scope.eventname] = JSON.stringify(data);
                    $scope.hideLoading();
                }).error(function(err){
                    $scope.hideLoading();
                    alert('network error');
                });
            };
            
            var abc;
            function functionclearinterval(){
                clearInterval(abc);
            }
                       
            var myPopup;
            $scope.showimageinlargerview = function(photo){          
                myPopup = $ionicPopup.show({
                   templateUrl : "showimage.html",
                   scope: $scope
                });  
            };
            
            $scope.closepopup = function(){
                if(myPopup)
                    myPopup.close();
            };
            
            $scope.showfulldetails = function(str,photo){
                $scope.photosofselectedevent = photo;
                var fulldetaildiv = document.getElementById(str);
                if(fulldetaildiv.style.height == "0px")
                {
                    var height = 10;
                    abc = setInterval(function(){
                        if(fulldetaildiv.style.height == "250px")
                            clearInterval(abc);
                        else{
                            height += 10;
                            fulldetaildiv.style.height = height.toString()+"px";
                        }
                    },20);
                }
                else if(fulldetaildiv.style.height == "250px")
                {
                    var height = 250;
                    abc = setInterval(function(){
                        if(fulldetaildiv.style.height == "0px")
                            clearInterval(abc);
                        else{
                            height -= 10;
                            fulldetaildiv.style.height = height.toString()+"px";
                        }
                    },20);
                }
            };
            
            $scope.addevent = function(){
              var url = servername;
              if($scope.eventname == 'movie')
                 url += "/insertmovie?";
              else if($scope.eventname == 'restaurant')
                  url += "/insertrestaurant?";
              else if($scope.eventname == 'tour')
                  url += "/inserttour?";
              else if($scope.eventname == "lifetimeevents")
                  url += "/insertlifetimeevents?";
              else if($scope.eventname == "festival")
                  url += "/insertfestival?";
              else
              {
                  url += "/insertotherevents?";
                  var newevent;
                  try{
                        newevent = document.getElementById('newevent').value;
                    }catch(err){}
                  url += "&eventtype="+"event_"+newevent +"&";
                  console.log(url);
              }
              
              url += "username="+$scope.username;
              url +="&name="+$scope.datatoaddevent.name;
              if($scope.datatoaddevent.name == "undefined" || $scope.datatoaddevent.name=="")
              {
                  alert("Please enter the name");
                  return;
              }
              if($scope.datatoaddevent.memories == "undefined" || $scope.datatoaddevent.memories=="")
              {
                  alert("Please enter the memories");
                  return;
              }
              if($scope.datatoaddevent.place == "undefined" || $scope.datatoaddevent.place=="")
              {
                  alert("Please enter the place");
                     return;
              }
              if($scope.eventname == "movie")
              {
                  if($scope.datatoaddevent.theatre == "undefined" || $scope.datatoaddevent.theatre==""){
                   alert("Please enter the theatre");
                   return;
                  }
              }
              var tags;
              if(!updatingtime){
                    $scope.datatoaddevent.date  = document.getElementById("date").value;
                }
              else
                  $scope.datatoaddevent.date  = document.getElementById("datewhileupdating").value;
              
              if($scope.datatoaddevent.date == "undefined" || $scope.datatoaddevent.date=="")
                  {
                    alert("Please enter the date");
                    return;
                  }
                  
              $scope.checkfriendlisttotag($scope.datatoaddevent.tags,$scope.datatoaddevent.friendsarray);

              if($scope.datatoaddevent.friendsarray)
              for(var i = 0;i<$scope.datatoaddevent.friendsarray.length;i++){
                  url+="&friends[]="+encodeURIComponent(JSON.stringify($scope.datatoaddevent.friendsarray[i]));
              }
                
              if($scope.datatoaddevent.tags.charAt($scope.datatoaddevent.tags.length-1) == ",")
                  $scope.datatoaddevent.tags = $scope.datatoaddevent.tags.substring(0,$scope.datatoaddevent.tags.length-1);
              tags = $scope.datatoaddevent.tags.split(",");
              for(var index = 0;index<tags.length; index++)
                 url += "&tags[]="+tags[index];
              
              $scope.showLoading();
                  
              var photos;
              if($scope.datatoaddevent.photo.length > 0)
              {
                  for(var index = 0;index<$scope.datatoaddevent.photo.length; index++){
                      url += "&photo[]="+$scope.datatoaddevent.photo[index];
                  } 
              }
              
              url +="&memories="+$scope.datatoaddevent.memories;
              url += "&opentofriend="+$scope.datatoaddevent.opentofriend;
              url += "&date="+$scope.datatoaddevent.date;
              url += "&place="+$scope.datatoaddevent.place;
              url +="&theatre="+$scope.datatoaddevent.theatre;
              url +="&review="+$scope.datatoaddevent.review;
              url += "&rate="+$scope.datatoaddevent.rate;
              window.localStorage.removeItem("event_"+$scope.eventname);
              $http.get(url).success(function(data) {
                      console.log(data);
                      $scope.hideLoading();
                      $scope.eventnamesuggestion = [];
                      alert("successfully added");
                      $scope.showpage = "mainpage";
                    }).error(function(err) {
                        $scope.hideLoading();
                        alert("network error");
			console.log(err);
                 });
              frienddetailintheeventarray = [];
                 url = servername + "/checkifsuggestionispresent?eventname="+"event_"+$scope.eventname+"&suggestionname="+$scope.datatoaddevent.name;
                 $http.get(url).success(function(data) {
                       console.log(data);
                   }).error(function(err) {
                        alert("Network error");
                 });
                  
            };
            
            $scope.checkfriendlisttotag = function(tags,friendsarray){
                console.log(tags);
                console.log(friendsarray);
                var tagarray = [];
                if(tags.charAt(tags.length-1) == ",")
                  tags = tags.substring(0,tags.length-1);
                tagarray = tags.split(",");
                for(var index1 = 0,index2 = 0;index1<tagarray.length;index1++,index2++){
                   // for(var index2 = 0;index2< friendsarray.length;index2++){
                   if(index2 == friendsarray.length){
                       friendstag.name = tagarray[index1].toString();
                       friendstag.username = "";
                       friendsarray.push(friendstag);
                       continue;
                   }
                        if(tagarray[index1].toString() != friendsarray[index2].name.toString()){
                            friendstag.name = tagarray[index1].toString();
                            friendstag.username = "";
                            friendsarray.splice(index1, 0, friendstag);
                        }
                   // }
                }
                console.log(friendsarray);
            };
            
            $scope.showtheatre = function(){
                if($scope.eventname == 'movie')
                    return true;
                else 
                    return false;
            };
            
            $scope.showreview =  function(){
              if($scope.eventname == 'movie' || $scope.eventname== 'tour' || $scope.eventname == "restaurant")
                  return true;
              else
                  return false;
            };
            
            $scope.showrate = function(){
              if($scope.eventname == 'movie' || $scope.eventname == "tour" || $scope.eventname == 'restaurant')
                  return true;
              else
                  return false;
            };
            
            $scope.showevent = function(str){
                $scope.showfooter = true;
                if($scope.eventname != "" && $scope.eventname != undefined && $scope.eventname != null)
                    document.getElementById($scope.eventname+"id").style.backgroundColor = "white";
                $scope.eventname = str;
                var eventtypeid = str+"id";
                var eventtypeelement = document.getElementById(eventtypeid);
                eventtypeelement.style.backgroundColor = "#9db2c0";
                if(window.localStorage["event_"+str]){
                    $scope.eventdescription = JSON.parse(window.localStorage["event_"+str]);
                    return;
                }
                $scope.showLoading();
                
                str = "event_" + str;
                var url = servername+"/geteventdescription?username=" + $scope.username +"&eventname="+str;
                $http.get(url).success(function(data) {
                      $scope.eventdescription = data;
                      window.localStorage[str] = JSON.stringify($scope.eventdescription);
                      console.log($scope.eventdescription);
                      $scope.hideLoading();
                    }).error(function(err) {
                        alert("Network error");
                        $scope.hideLoading();
                  });
            };
            
            $scope.sharesinglephotoonfacebook = function(){
                  var postMSG="Albert Einstein";
                  var accessToken = window.localStorage.fbAccessToken;
                  var url='https://graph.facebook.com/me/feed?access_token='+accessToken;//+"&message="+postMSG;
                  var imgURL="https://s3.amazonaws.com/timestamphim/hraj3116/albert.png";
                  var formData = new FormData();
                  formData.append("message","Albert Einstein");
                  formData.append("name","Facebook API test");
                  formData.append("source",imgURL);
                  
                  $.ajax({
                    url: url,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data){
                        console.log(data);
                        alert("POST SUCCESSFUL");
                    }
                });
            };
            
            $scope.getlongtimeaccesstoken = function(){
                var accesstoken = window.localStorage.fbAccessToken;
                var url = "https://graph.facebook.com/oauth/access_token?client_id="+"1707847982796388"
                          +"&client_secret="+"0564c2bbc3da5410be6e03951fefe6c9"+"&grant_type=fb_exchange_token&fb_exchange_token="+accesstoken;
                $http.get(url).success(function(data){
                    console.log(data);
                    window.localStorage.newdata = data;
                }).error(function(err){
                    
                });

            };
            
            var newalbumid = "";
            
            $scope.createnewalbum = function(albumname){
                  var accessToken = window.localStorage.fbAccessToken;
                  var url='https://graph.facebook.com/me/albums?access_token='+accessToken;
                  var imgURL="https://s3.amazonaws.com/timestamphim/hraj3116/1457974971548.jpg";
                  var formData = new FormData();
                  formData.append("message",albumname);
                  formData.append("name",albumname);
                     $.ajax({
                    url: url,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data){
                        console.log(data);
                        newalbumid = data.id;
                        $scope.sharemultiplephotosonfacebook();
                    }
                });
            };
            
            $scope.getallthealbumid = function(){
                var postMSG="Your message";
                var accessToken = window.localStorage.fbAccessToken;
                var url='https://graph.facebook.com/me/albums?access_token='+accessToken+"&message="+postMSG;
                  
                openFB.api({
                    method: 'GET',
                    path: '/me/albums',
                    success: function(result) {
                        console.log(result.data);
                        newalbumid = result.data[0];
                        $scope.sharemultiplephotosonfacebook();
                    },
                    error: errorHandler
                    });
            };
            
            $scope.sharemultiplephotosonfacebook = function(){
                var postMSG="Your message";
                var accessToken = window.localStorage.fbAccessToken;
                $scope.a = [];
                var photoUrl = "https://s3.amazonaws.com/timestamphim/hraj3116/1457975041896.jpg";
                $scope.a.push(photoUrl);
                photoUrl = "https://s3.amazonaws.com/timestamphim/hraj3116/1457975041949.jpg";
                $scope.a.push(photoUrl);
                for(var x in $scope.a){
                    var formData = new FormData();
                    formData.append("url",photoUrl);
                    var url='https://graph.facebook.com/'+ newalbumid +'/photos?access_token='+accessToken+"&message="+postMSG;
                    $.ajax({
                        url: url,
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function(data){
                            alert("POST SUCCESSFUL");
                        }
                    });
                }
            };
            
            var idtoupdateevent = "";
            $scope.showpagetoupdateevent = function(id,event){
                console.log(event);
                $scope.datatoaddevent.date = event.date;
                document.getElementById("datewhileupdating").value = event.date;
                $scope.datatoaddevent.memories = event.memories;
                $scope.datatoaddevent.name = event.name;
                $scope.datatoaddevent.opentofriend = event.opentofriend;
                $scope.datatoaddevent.place = event.place;
                $scope.datatoaddevent.friendsarray = event.tags;
                console.log($scope.datatoaddevent.friendsarray);
                $scope.datatoaddevent.tags = "";
                if($scope.datatoaddevent.friendsarray)
                for(var i = 0; i < $scope.datatoaddevent.friendsarray.length;i++){
                    $scope.datatoaddevent.tags += $scope.datatoaddevent.friendsarray[i].name.toString() + ",";
                }
                $scope.datatoaddevent.review = event.review;
                $scope.datatoaddevent.rate = event.rate;
                $scope.datatoaddevent.theatre = event.theatre;
                console.log($scope.datatoaddevent);
                idtoupdateevent = id;
                $scope.showpage = "showeventupdatingpage";
            };
            
            $scope.updateevent = function(){
                updatingtime = true;
                $scope.deleteevent(idtoupdateevent);
                $scope.addevent();
                $scope.showpage = "mainpage";
                updatingtime = false;
            };
            
            $scope.logout = function(){
                window.localStorage.clear();
                window.sessionStorage.removeItem('fbAccessToken');
                window.location.href = "index.html";
            };
            
            $scope.myFile = [];
            $scope.getFileDetails = function (e) {
                $scope.files = [];
                $scope.$apply(function () {
                    for (var i = 0; i < e.files.length; i++) {
                        $scope.files.push(e.files[i])
                    }
                });
            };
        
            $scope.phototoupload = [];
            var uploadingmorefilestoanevent = false;
            $scope.uploadmorephotos = function(id , index){
                if($scope.files == null || $scope.files == undefined || $scope.files.length == 0){
                    alert("no files selected");
                    return;
                }
                $scope.showLoading();
                console.log($scope.eventdescription);
                $scope.getrequesttouploadphoto = [];
                $scope.uploadmorefiles = [];
                var eventid = id;
                $scope.uploadmorefiles = [];
                $scope.imageuploadingindex = 0;
                var url = servername + "/uploadmorephotosintheevent?username="+$scope.username+"&eventtype=event_"+$scope.eventname+"&eventid="+eventid;
                var uploadUrl = servername+"/uploadphotointos3";
                for(var index = 0; index < $scope.files.length; index++){
                    var file = $scope.files[index];
                    var fd = new FormData();
                    fd.append('username',$scope.username);
                    fd.append('file',file);
                    $scope.getrequesttouploadphoto.push($http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }));
                }
                
                $q.all($scope.getrequesttouploadphoto).then(function(data) {
                    var imageurl = "";
                    console.log(data);
                    angular.forEach(data, function(response) {
                       imageurl = "https://s3.amazonaws.com/timestamphim"+"/"+response.data.toString();
                       $scope.uploadmorefiles.push(imageurl);
                    });
                }).then(function(data){
                
                if($scope.uploadmorefiles.length > 0)
                    for(var index = 0; index < $scope.uploadmorefiles.length; index++){
                        url += "&photo[]="+$scope.uploadmorefiles[index];
                    }               
                
                $http.get(url).success(function(data) {
                    //  $scope.eventdescription = data;
                      $scope.hideLoading();
                      $scope.showevent($scope.eventname);
                      alert("successfully added");
                      
                     // $scope.load();
                      console.log(data);
                    }).error(function(err) {
                        $scope.hideLoading();
                        alert("Network error");
			console.log(err);
                  });
                });
                
                window.localStorage.removeItem("event_"+$scope.eventname);
            };
            
            $scope.uploadFile = function(){
                var file = $scope.files;
                if($scope.files == null || $scope.files == undefined || $scope.files.length == 0){
                    alert("no files selected");
                    return;
                }
                var uploadUrl = servername+"/uploadphotointos3";
                for(var index = 0; index < $scope.files.length; index++){
                    uploadFileToUrl($scope.files[index], uploadUrl);
                }
            };

            $scope.imageuploadingindex = 0;
            function uploadFileToUrl(file, uploadUrl){
                var fd = new FormData();
                fd.append('file', file);
                fd.append('username',$scope.username);

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(data){
                   console.log(data);
                   var imageurl = "https://s3.amazonaws.com/timestamphim"+"/"+data.toString();
                   $scope.imageuploadingindex++;
                   alert("image uploaded "+ $scope.imageuploadingindex.toString());
                   $scope.datatoaddevent.photo.push(imageurl);
                })
                .error(function(){
                    console.log("Network error");
                });
            }
     
            $scope.share = function() {
             // openFB.api({path: '/me/taggable_friends', success: successHandler, error: errorHandler});

                openFB.api({
                    method: 'POST',
                    path: '/me/feed',
                    params: {
                        message: "watching london has fallen with @[830963493716943:1:Himanshu Raj]"
                    },
                    success: function() {
                        alert('the item was posted on Facebook');
                    },
                    error: errorHandler});
            };

            function errorHandler(error) {
                alert(error.message);
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
            
            $ionicModal.fromTemplateUrl('shareonfb.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                 }).then(function(modal) {
                    $scope.modal = modal;
                 });

            $scope.openModal = function() {
                    $scope.modal.show();
                 };

            $scope.closeModal = function() {
                    $scope.modal.hide();
                 };

                //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                    $scope.modal.remove();
                 });

                 // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
                    // Execute action
                 });

                 // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                    // Execute action
                 });
})
//.factory('Camera', function($q) {
//
//   return {
//      getPicture: function(options) {
//         var q = $q.defer();
//
//         navigator.camera.getPicture(function(result) {
//            q.resolve(result);
//         }, function(err) {
//            q.reject(err);
//         }, options);
//
//         return q.promise;
//      }
//   }
//
//})
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
