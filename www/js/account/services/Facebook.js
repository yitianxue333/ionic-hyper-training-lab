/**
 * Facebook Service
 * @description Handles communication between facebook and hyper client
 * @author Kanchana Yapa
 * @since 12/09/15
 */
angular.module('hyper.account').factory('Facebook', function($q, _, $http, $cordovaFile, $timeout, $httpParamSerializer, $cordovaFileTransfer, Config, Account, Identity, User) {

    /**
     * Adds the facebook strategy to users strategy list
     * @param authResponse
     */
    function handleHyperAuthentication(facebookData) {
        var authDefered = $q.defer();
        Identity.addAuthenticator({
          "strategy": "facebook",
          "auth_id": facebookData.authResponse.userID,
          "secret": facebookData.authResponse.accessToken
        }).then(
        function(response) {
          if(response && response.status.result === 'success') {

            //Set user profile image
            var user = User.getUser();
            User.setUser(user);

            //Set User facebook information
            User.setFacebookInfo({
              userId : facebookData.authResponse.userID,
              accessToken: facebookData.authResponse.accessToken,
              expire: facebookData.authResponse.expiresIn,
              name: facebookData.profileInfo.name,
              email: facebookData.profileInfo.email
            });

            authDefered.resolve(response);
          } else {
            logout();

            authDefered.reject(response);
          }
        }
       );

       return authDefered.promise;
    }


    /**
     * This method is to get the user profile info from the facebook api.
     * @param accessToken
     * @returns {*}
     */
    function getProfileInfo(accessToken, permission) {
      var info = $q.defer();
      if(!permission) {
        permission = [];
      }
      facebookConnectPlugin.api('/me?fields=email,name,verified', permission,
        function (response) {
          info.resolve(response);
        },
        function (response) {
          info.reject(response);
        }
      );
      return info.promise;
    }

    /**
     * Handle Connecting to Facebook and Updating Hyper API after
     */
    function connect() {
      var connectDefered = $q.defer();
      login().then(function success(response) {
        handleHyperAuthentication(response).then(function success(response) {
          connectDefered.resolve(response);
        }, function fail(error) {
          connectDefered.reject(error);
        });
      }, function fail(error) {
        connectDefered.reject(error);
      });

      return connectDefered.promise;
    }

    /**
     * Signin to facebook
     */
    function login() {
      var fbLogin = $q.defer();

      if(!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
        alert('Facebook plugin does not work on web view');
        fbLogin.reject("FACEBOOK_SERVICE: Unsupported platform");
        return fbLogin.promise;
      }

      facebookConnectPlugin.getLoginStatus(function(success) {
        if(success.status === 'connected') {
          console.log('HYFACEBOOKLOGIN: getLoginStatus', success.status);
          console.log("HYFACEBOOKLOGIN: User already authenticated the app and logged in");

          getProfileInfo(success.authResponse.accessToken).then(function (profileInfo) {
            console.log("HYFACEBOOKCONNECT: ProfileInfo", profileInfo);
            fbLogin.resolve({ authResponse: success.authResponse, profileInfo: profileInfo });
          }, function error(error) {
            fbLogin.reject(error);
          });

        } else {
          console.log('HYFACEBOOKLOGIN: getLoginStatus', success.status);
          console.log("HYFACEBOOKLOGIN: User has not authorised or logged into facebook");

          //Authenticate user
          facebookConnectPlugin.login(['email', 'public_profile'], function(response) {

            if (!response.authResponse) {
              fbLoginError("Cannot find the authResponse");
              fbLogin.reject("Cannot find the authResponse");
            } else {

              console.log("HYFACEBOOKLOGIN: User logged into Facebook successfully");

              hasPermission(response.authResponse.accessToken, 'publish_actions').then(function (hasPublishPermission) {
                console.log("HYFACEBOOKLOGIN: Cheked permissions --", hasPublishPermission)
                if(!hasPublishPermission) {

                  console.log("HYFACEBOOKLOGIN: get publish actions")
                  // Authorise publish permissions
                  setTimeout(function() {
                    console.log("HYFACEBOOKLOGIN: PLugin exists", facebookConnectPlugin);
                      facebookConnectPlugin.login(["publish_actions"], function(publishResponse) {
                        console.log("HYFACEBOOKLOGIN: Publish actions retrived", publishResponse)
                        if (!publishResponse.authResponse){
                          fbLogin.reject("Error retrieving publish action");
                        } else {

                          //Get profile information for the user
                          getProfileInfo(publishResponse.authResponse.accessToken).then(function (profileInfo) {
                            console.log("HYFACEBOOKCONNECT: ProfileInfo", profileInfo);
                            fbLogin.resolve({ authResponse: publishResponse.authResponse, profileInfo: profileInfo });
                          }, function error(error) {
                            fbLogin.reject(error);
                          });
                        }
                      },  function(error) {
                          console.log(error);

                          fbLogin.reject("Error retrieving publish action");
                      });
                  }, 800);
                } else {
                  
                  console.log("HYFACEBOOKLOGIN: Facebook has publish permissions already");
                  
                  //Get profile information for the user
                  getProfileInfo(response.authResponse.accessToken).then(function success(profileInfo) {
                    console.log("HYFACEBOOKLOGIN: ProfileInfo", profileInfo);
                    fbLogin.resolve({ authResponse: response.authResponse, profileInfo: profileInfo });
                  }, function error(error) {
                    fbLogin.reject(error);
                  });
                }
              }, function error(error) {
                  fbLogin.reject(error);
              });
            }

          }, function (error) {

            /**
             * his is the fail callback from the login method
             */
            console.log("HYFACEBOOKLOGIN: User failed to log into facebook", error);
            fbLogin.reject(error);
          });
        }
      });

      return fbLogin.promise;
    }



    /**
     * Log out of the facebook plugin
     */
    function logout(succsess, fail) {
      var fbLogout = $q.defer();
      facebookConnectPlugin.logout(function(success) {
        fbLogout.resolve(success);
      }, function(error) {
        fbLogout.reject(error);
      });
      return fbLogout.promise;
    }


    /**
     * Share a given image url
     * @param url photo url to upload
     * @param message posted message to facebook
     * @param accessToken
     */
    function sharePhotoUrl(url, message, accessToken) {
      var infoPost = $q.defer();
      $http({
        method: 'POST',
        url: 'https://graph.facebook.com/me/photos',
        data: $httpParamSerializer({
          "url": url,
          "caption": message,
          "access_token": accessToken
        }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function successCallback(response) {
        infoPost.resolve(response);
      }, function errorCallback(response) {
        infoPost.reject(error);
      });

      return infoPost.promise;
    }

    /**
     * Share a given image url
     * @param url photo url to upload
     * @param message posted message to facebook
     * @param accessToken
     */
    function sharePhoto(url, message, accessToken) {
      var photoPromise = $q.defer();
      var fd = new FormData();
      window.resolveLocalFileSystemURL(url, function(fileEntry) {
        fileEntry.file(function(file) {
          var mime = file.type;
          var filename = file.name;
          var options = {
            mimeType: mime,
            fileName: filename,
            httpMethod: "POST",
            params : {
             "access_token": accessToken,
             "caption": message
            }
          };

          /**
           * Submit images to facebook
           */
          $cordovaFileTransfer.upload("https://graph.facebook.com/me/photos", url, options).then(function(result) {
            result = result.response ? angular.fromJson(result.response) : result;
            photoPromise.resolve(result);
          }, function(err) {
            photoPromise.reject(err);
          });
        }, function(e) {
          photoPromise.reject(response);
        });
      }, function(e) {
        photoPromise.reject(response);
      });

      return photoPromise.promise;
    }

    /**
     * Share a given image url
     */
    function shareVideo(url, title, description, accessToken) {
      var videoPromise = $q.defer();
      reolveFilePath(url, function(fileEntry) {
        fileEntry.file(function(file) {
          var mime = file.type;
          var size = file.size;
          var filename = file.name;

          var options = {
            mimeType: mime,
            fileName: filename,
            httpMethod: "POST",
            params : {
              "access_token": accessToken,
              "title": title,
              "description": description
            }
          };

          /**
           * Share vdeo on faccebook
           */
          $cordovaFileTransfer.upload("https://graph-video.facebook.com/me/videos", url, options).then(function(result) {
            result = result.response ? angular.fromJson(result.response) : result;
            videoPromise.resolve(result);
          }, function(err) {
            videoPromise.reject(err);
          }, function (progress) {
            videoPromise.notify(progress);
          });
        });
      },function(error) {
        videoPromise.reject(error);
      });

      return videoPromise.promise;
    }



    /**
     * Get Post details
     * @param id post id
     * @param fields returned lit of fields video "thumbnails,source,picture", picture "source,picture"
     * @param access_token facebook accessToken

     */
    function getPostDetails(id, fields, access_token) {
      var info = $q.defer();
      var tries = 0;

      (function poll() {
        $http.get( 'https://graph.facebook.com/' + id, {
          params: {
              "access_token": access_token,
              "fields": fields.join(",")
          }
        }).then(function(success) {
          if(success.data) {
            if(verifyFields(success.data, fields)) {
              info.resolve(success);
            } else if(tries < 20) {
              tries++;
              info.notify(tries);
              $timeout(poll, 5000);
            } else {
              info.reject({ data : success.data, message : "Information retreival timed out" });
            }
          }
        }, function(error) {
          info.reject(error);
        });
      })();

      return info.promise;
    }

    /**
     * Share a given post to the facebook feed
     */
    function sharePost(message, url, accessToken) {
      var infoPost = $q.defer();

      $http({
        method: 'POST',
        url: 'https://graph.facebook.com/me/feed',
        data: $httpParamSerializer({
          "message": message,
          "link": url,
          "access_token": accessToken
        }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function successCallback(response) {
        infoPost.resolve(response);
      }, function errorCallback(response) {
        infoPost.reject(error);
      });

      return infoPost.promise;
    }

    /**
     * Create Points object in the facebook API and create score action on users time line
     * @param title
     * @param description
     * @param points
     * @param url
     * @param imageUrl
     * @param accessToken
     **/
    function sharePointsObject(title, description, userMessage, points, url, siteName, imageUrl, accessToken) {
                                        console.log("share points object");
      var infoPost = $q.defer();
      var objectText = {
      	"fb:app_id": Config.FACEBOOK_APP_ID,
      	"og:type": Config.FACEBOOK_APP_NAMESPACE + ":points",
      	"og:url": url,
      	"og:site_name": siteName,
      	"og:title": title,
      	"og:description": description,
      	"og:image": imageUrl,
        "og:image:type" : "image/png",
        "og:image:width": 201,
        "og:image:height": 201

      };
      objectText[Config.FACEBOOK_APP_NAMESPACE + ":hyper_point"] = points;
                                        console.log("line no 403");
      $http({
        method: 'POST',
        url: openGraphURL("objects/{appname}:points"),
        data: $httpParamSerializer({
            "object": JSON.stringify(objectText),
            "access_token": accessToken
        }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function successCallback(response) {
              console.log(response);
        if(response.data && response.data.id) {

          // Post action linking the achievement Object
          shareScoreAction(response.data.id, userMessage, accessToken).then(function success(response) {
            infoPost.resolve(response);
          }, function fail(error) {
            infoPost.reject(error);
          });
        }
      }, function errorCallback(error) {
              console.log("error"+error);
        infoPost.reject(error);
      });
      return infoPost.promise;
    }


    function shareScoreAction(objectId, userMessage, accessToken) {
                                        console.log("share Score Action");
      var infoAction = $q.defer();

      $http({
        method: 'POST',
        url: openGraphURL("{appname}:score"),
        data: $httpParamSerializer({
            "points": objectId,
            "message": userMessage,
            "fb:explicitly_shared": "true",
            "access_token": accessToken
        }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function successCallback(response) {
              console.log("fedgfhe"+response);
        infoAction.resolve(response);
      }, function errorCallback(response) {
              console.log("error"+response);
        infoAction.reject(error);
      });

      return infoAction.promise;
    }

    /**
     * Create Badge object in the facebook API and create share action on users time line
     * @param title
     * @param description
     * @param points
     * @param url
     * @param imageUrl
     * @param accessToken
     **/
    function shareBadgeObject(title, description, url, site_name, imageUrl, accessToken) {
      var infoPost = $q.defer();
      var objectText = {
      	"fb:app_id": Config.FACEBOOK_APP_ID,
      	"og:type": Config.FACEBOOK_APP_NAMESPACE + ":badge",
      	"og:url": url,
      	"og:site_name": site_name,
      	"og:title": title,
      	"og:description": description,
      	"og:image": imageUrl,
        "og:image:type" : "image/png",
        "og:image:width": 201,
        "og:image:height": 201
      };

      $http({
        method: 'POST',
        url: openGraphURL("objects/{appname}:badge"),
        data: $httpParamSerializer({
            "object": JSON.stringify(objectText),
            "access_token": accessToken
        }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function successCallback(response) {
        if(response.data && response.data.id) {

          // Post action linking the achievement Object
          shareBadgeAction(response.data.id, accessToken).then(function success(response) {
            infoPost.resolve(response);
          }, function fail(error) {
            infoPost.reject(error);
          });
        }
      }, function errorCallback(error) {
        infoPost.reject(error);
      });
      return infoPost.promise;
    }


    function shareBadgeAction(objectId, accessToken) {
      var infoAction = $q.defer();

      $http({
        method: 'POST',
        url: openGraphURL("{appname}:share"),
        data: $httpParamSerializer({
            "badge": objectId,
            "fb:explicitly_shared": "true",
            "access_token": accessToken
        }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function successCallback(response) {
        infoAction.resolve(response);
      }, function errorCallback(response) {
        infoAction.reject(error);
      });

      return infoAction.promise;
    }


    function getOGPost(id, accessToken) {
      var info = $q.defer();
      $http.get('https://graph.facebook.com/' + id + '?access_token=' + accessToken).then(function(success) {
        info.resolve(success);
      },function(error) {
        info.reject(error);
      });

      return info.promise;
    }

    function hasPermission(accessToken, permission) {
      var info = $q.defer();
      getPermissions(accessToken, permission).then(function success(permissions) {
        console.log("HYFACEBOOKLOGIN: Retrieved permissions", permissions);
        var hasPermission = _.findIndex(permissions.data, function(o) { return (o.permission == permission && o.status == "granted"); });
        console.log("HYFACEBOOKLOGIN: Compared permissions", hasPermission);
        info.resolve((hasPermission !== -1));
      }, function error(error) {
        console.log("HYFACEBOOKLOGIN: permission check error", error);
        info.resolve(false);
      });
      return info.promise;
    }

    function getPermissions(accessToken) {
      var info = $q.defer();
      $http.get('https://graph.facebook.com/me/permissions?access_token=' + accessToken).then(function(success) {
        info.resolve(success.data);
      },function(error) {
        info.reject(error);
      });
      return info.promise;
    }

    function openGraphURL(path) {
      return ("https://graph.facebook.com/me/" + path).replace("{appname}", Config.FACEBOOK_APP_NAMESPACE);
    }

    function verifyFields(data, fields) {
        for(var x=0; x< fields.length; x++){
          if(data[fields[x]] == undefined || data[fields[x]].length == 0) {
            return false;
          }
        }
        return true;
    }

    function reolveFilePath(url, success, fail) {
        if(ionic.Platform.isAndroid()) {
          if(url.indexOf("content://") !== -1) {
            window.FilePath.resolveNativePath(url, function(fileEntryFilePath) {
              fileEntryFilePath = (fileEntryFilePath.indexOf("file://") === -1) ? "file://".concat(fileEntryFilePath) : fileEntryFilePath;
              window.resolveLocalFileSystemURL(fileEntryFilePath, function(fileEntry) {
                success(fileEntry);
              });
            }, function(e) {
              fail(e);
            });
          } else {
            url = (url.indexOf("file://") === -1 ) ? "file://".concat(url) : url;
            window.resolveLocalFileSystemURL(url, function(fileEntry) {
              success(fileEntry);
            });
          }
        }

        if(ionic.Platform.isIOS()) {
          window.resolveLocalFileSystemURL(url, function(fileEntry) {
            success(fileEntry);
          }, function(e){
            fail(e);
          });
        }
    }

    return {
      login: login,
      connect: connect,
      logout: logout,
      getProfileInfo: getProfileInfo,
      sharePhoto: sharePhoto,
      shareVideo: shareVideo,
      sharePost: sharePost,
      getPermissions: getPermissions,
      getPostDetails: getPostDetails,
      reolveFilePath: reolveFilePath,
      sharePhotoUrl: sharePhotoUrl,
      sharePointsObject: sharePointsObject,
      shareScoreAction: shareScoreAction,
      shareBadgeObject: shareBadgeObject,
      shareBadgeAction: shareBadgeAction,
      getOGPost: getOGPost
    };
  });
