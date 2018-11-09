/**
 * Interceptor request/response
 * @description This section contais the request/response interceptor
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper')
  .config(
    function ($httpProvider) {
      
      var authRequest = function ($rootScope, $cookieStore, $injector, Authentication, requestCount) {
        
        return {
          'request':function (config) {

            /**
             * If is not a Rest Call, return the config request without token
             */
            if (config.url.indexOf('.html') > -1) {
              return config;
            }

            /**
             * Adding a custom load if there is a new request
             */
            if (!config.headers.disableLoading) {
                  requestCount.increase();

                  $injector.get('$ionicLoading').show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                  });
            }

            /**
             * Decode url if necessary
             */
            if (config.url.indexOf('%2') > -1) {
              config.url = decodeURIComponent(config.url);
            }

            config.params = config.params || {};
            config.headers = config.headers || {};

            var token = Authentication.getToken();
            var confirmToken = Authentication.getConfirmationToken();

            /**
             * Adding request token
             */
            if (token && !config.public && config.authToken === 'params') {
              config.url += '/' + token;
            } else if(config.confirmToken && confirmToken) {
              if(config.confirmToken == 'params') {
                config.url += '/' + confirmToken;
              } else {
                config.headers.Authorization =  confirmToken;
              }
            } else if (token && !config.public) {
                config.headers.Authorization =  token;
            }

            return config;
          }
        };
      };

      var response = function ($injector, $timeout, requestCount) {
        function waitAndHide() {
            $timeout(function() {
                if (requestCount.get() === 0) {
                    $injector.get('$ionicLoading').hide();
                }
                else{
                    waitAndHide();
                }
            }, 300);
        }

        return {
          'response':function (resp) {

              /**
               * Closing custom loading
               */
              requestCount.descrease();
              if (requestCount.get() === 0) {
                    waitAndHide();                
              }

              return resp;
          }
        };
      };

      var requestDenied = function ($rootScope, $q, $injector, $timeout, requestCount) {
           function waitAndHide() {
              $timeout(function() {
                  if (requestCount.get() === 0){
                      $injector.get('$ionicLoading').hide();
                  }
                  else{
                      waitAndHide();
                  }
              }, 300);
            }

        return {
          responseError: function (response) {

            /**
             * Closing custom loading
             */
            requestCount.descrease();
            if (requestCount.get() === 0) {
                  waitAndHide();                
            }

            if(response.data && response.data.state) {
              switch (response.status) {
                case 400:
                  /**
                   * Add Bad Request behaviour
                   */
                  $injector.get('Alert').showLongCenter("Error 400 - " + response.data.state.message);

                  break;

                case 401:
                  /**
                   * Unauthorized
                   */
                  $injector.get('Alert').showLongCenter("Error 401 - " + response.data.state.message);

                  break;

                case 403:
                  /**
                   * Add unauthorized behaviour
                   */
                  $injector.get('$state').go('app.dashboard');
                  $injector.get('Alert').showLongCenter("Error 403 - " + response.data.state.message);

                  break;

                case 404:
                  /**
                   * Not Found exception
                   */
                  $injector.get('Alert').showLongCenter("Error 404 - " + response.data.state.message);
                  break;

                case 406:
                  /**
                   * Not Acceptable
                   */
                  $injector.get('Alert').showLongCenter("Error 406 - " + response.data.state.message);
                  break;

                case 500:
                  /**
                   * Internal Server Error exception
                   */
                  $injector.get('Alert').showLongCenter("Error 500 - " + response.data.state.message);
                  break;

                default:
                  /**
                   * Default exception
                   */
                  $injector.get('Alert').showLongCenter('Error ' + response.data.state.message);
                  break;
              }
            }
  

            return response;
          }
        };
      };
      $httpProvider.interceptors.push(authRequest);
      $httpProvider.interceptors.push(response);
      $httpProvider.interceptors.push(requestDenied);
    }
  )
  .factory('requestCount', function() {
    var count = 0;
    return {
        increase: function() {
            count++;
        },
        descrease: function() {
            if (count === 0) return;
            count--;
        },
        get: function() {
            return count;
        }
    };
});
