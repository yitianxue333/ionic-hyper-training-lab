/**
 * Hyper Routes
 * @description That section contains all the project routes
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper')
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/core/menu.html'
      })
      .state('home', {
        url: '/home',
        params: {
          show: []
        },
        templateUrl: 'views/account/home.html',
        public: true
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/account/login.html',
        public: true
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/account/signup.html',
        public: true
      })
      .state('signupwarning', {
        url: '/signupwarning',
        templateUrl: 'views/account/signup-warning.html',
        public: true
      })
      .state('signupfbwarning', {
        url: '/signupfbwarning',
        templateUrl: 'views/account/signup-fbinfo-warning.html',
        public: true
      })
      .state('signupfbwarningunverified', {
        url: '/signupfbwarningunverified',
        templateUrl: 'views/account/signup-fbinfo-warning-unverified.html',
        public: true
      })
      .state('app.dashboard', {
        url: '/dashboard',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/dashboard/dashboard.html'
          }
        }
      })
      .state('app.profileUser', {
        url: '/profile-user/:showCongratulations',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/profile/profile-user.html'
          }
        }
      })
      .state('app.profileAccount', {
        url: '/profile-account/:showCongratulations',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/profile/profile-account.html'
          }
        }
      })
      .state('app.profilesignup', {
        url: '/profilesignup/:showCongratulations',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/profile/profile-signup.html'
          }
        }
      })
      .state('app.recordPoints', {
        url: '/record-points',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/record-points/record-points.html'
          }
        }
      })
      .state('app.stats', {
        url: '/stats',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/stats/stats.html'
          }
        }
      })
      .state('app.badges', {
        url: '/badges',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/badges/badges.html'
          }
        }
      })
      .state('app.leaderboard', {
        url: '/leaderboard',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/leaderboard/leaderboard.html'
          }
        }
      })
      .state('app.training', {
        url: '/training',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/training/training.html'
          }
        }
      })
      .state('app.modules', {
        url: '/modules',
        params: {
          query: []
        },
        views: {
          'menuContent': {
            templateUrl: 'views/training/modules.html'
          }
        }
      })
      .state('app.trainer', {
        url: '/trainer/:trainerId',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/training/trainer.html'
          }
        }
      })
      .state('app.trainers', {
        url: '/trainers/:trainerId',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/training/trainers.html'
          }
        }
      })
      .state('app.module', {
        url: '/module/:moduleId',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/training/module.html'
          }
        }
      }).state('app.purchase', {
        url: '/purchase/:moduleId',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/training/purchase.html'
          }
        }
      }).state('app.purchaseError', {
      url: '/purchase-error',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'views/training/purchase-error.html'
        }
      }
    }).state('app.myLibrary', {
      url: '/my-library',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'views/profile/my-library.html'
        }
      }
    }).state('app.settings', {
      url: '/settings',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'views/profile/settings.html'
        }
      }
    });

    /**
     * If none of the above states are matched, use this as the fallback
     */
    $urlRouterProvider.otherwise('/home');

    $ionicConfigProvider.views.swipeBackEnabled(false);
  });
