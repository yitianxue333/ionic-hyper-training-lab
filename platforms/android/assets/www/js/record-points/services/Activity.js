/**
 * Activity Service
 * @description Activity service manage activity data set with the server
 * @author Kanchana Yapa
 * @since 12/22/15
 */
angular.module('hyper.recordPoints').factory('Activity', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_URL + '/:op', {}, {
    get: { method: 'GET', params:{ op: 'activity' } },
    save: { method: 'POST', params:{ op: 'activity' }, authToken: 'params' },
    getBadges: { method: 'GET', params:{ op: 'activity/badges' }, authToken: 'params' },
    getWeeklyStats: { method: 'GET', params:{ op: 'activity/stats/week' }, authToken: 'params' },
    getMonthlyStats: { method: 'GET', params:{ op: 'activity/stats/combined' }, authToken: 'params' }
  });

  var resourceLeaderboard = $resource(Config.API_URL + '/activity/leaderboard/:type/:period/:pointsType', {  }, {
    getLeaderboard:  { method: 'GET', params: {offset:"@offset"}, authToken: 'params' }
  });

  function get() {
    return resource.get().$promise;
  }

  function save(params) {
    return resource.save(params).$promise;
  }

  function getBadges() {
    return resource.getBadges().$promise;
  }

  function getWeeklyStats() {
    return resource.getWeeklyStats().$promise;
  }

  function getCombinedStats() {
    return resource.getMonthlyStats().$promise;
  }

  function getLeaderboard(params) {
    return resourceLeaderboard.getLeaderboard(params).$promise;
  }

  return {
    get: get,
    getBadges: getBadges,
    getLeaderboard: getLeaderboard,
    getWeeklyStats: getWeeklyStats,
    getCombinedStats: getCombinedStats,
    save: save
  };
});
