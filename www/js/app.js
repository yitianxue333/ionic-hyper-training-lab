/**
 * Hyper Mobile App
 * @description Here the project description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper', ['ionic', 'ngCordova', 'ngResource', 'ngCookies','angularMoment','angular-jwt', 'ngCordovaOauth', 'ionic.service.core',
  'ionic.service.analytics', 'hyper.core', 'hyper.dashboard', 'hyper.account', 'hyper.authentication',
  'hyper.profile', 'hyper.recordPoints', 'hyper.stats', 'hyper.badges', 'hyper.leaderboard', 'hyper.training'])

  .run(function($ionicPlatform, $ionicAnalytics, Account, Profile, User, Deploy, Connectivity) {

       
       //screen.lockOrientation('portrait');

    /**
     * Checking for updates
     */
    Deploy.checkForUpdates();

    /**
     * Getting account options
     */
    Profile.getOptions().then(
      function(response) {
        User.setAccountOptions(response.payload)
      }
    );

    $ionicPlatform.ready(function() {
      /**
       * Registering on Ionic Analytics
       */
      $ionicAnalytics.register();

      /**
       * Kick off the platform web client
       */
      Ionic.io();

      /**
       * This will give you a fresh user or the previously saved 'current user'
       */
      var user = Ionic.User.current();

      /**
       * If the user doesn't have an id, you'll need to give it one.
       */
      if (!user.id) {
        user.id = Ionic.User.anonymousId();
        // user.id = 'your-custom-user-id';
      }

      Connectivity.checkConnection();
      Connectivity.setUpConnectionLosDetection();
    });
  })

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

      /**
       * Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
       */
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      // LOCK ORIENTATION TO PORTRAIT.
      if(screen && screen.lockOrientation)
        screen.lockOrientation('portrait');

    });
  });
