/**
 * User Service
 * @description Handles user data
 * @author Kanchana Yapa
 * @author Samuel Castro
 * @since 12/01/15
 * @updated 12/15/15
 */
angular.module('hyper.account').factory('User', function($rootScope, LocalStorage, Config) {

  /**
   * For the purpose of this example I will store user data on ionic local storage but you should save it on a database
   * @param user_data
   */
  function setUser(user_data) {
    LocalStorage.set('currentUser', user_data);
    $rootScope.$broadcast('onUpdateUser', user_data);
  }

  /**
   * Getting user profile info
   */
  function getUser() {
    return LocalStorage.get('currentUser');
  }

  /**
   * Set identity info
   * @param identity info
   */
  function setIdentityInfo(identity) {
    LocalStorage.set('currentIdentity', identity);
    $rootScope.$broadcast('onUpdateIdentity', identity);    
  }

  /**
   * Get identity info
   */
  function getIdentityInfo() {
    return LocalStorage.get('currentIdentity');    
  }

  /**
   * Storing stats data
   * @param stats
   */
  function setStats(stats) {
    LocalStorage.set('stats', stats);
    $rootScope.$broadcast('onUpdateStats', stats);
  }

  /**
   * Removing stats
   */
  function removeStats() {
    LocalStorage.remove('stats');
    $rootScope.$broadcast('onUpdateStats', {});
  }

  /**
   * Getting stats data
   */
  function getStats() {
    return LocalStorage.get('stats');
  }

  /**
   * Storing account options
   * @param data
   */
  function setAccountOptions(data) {
    LocalStorage.set('accountOptions', data);
  }

  /**
   * Getting account options
   */
  function getAccountOptions() {
    return LocalStorage.get('accountOptions');
  }

  /**
   * Set Facebook info
   * @param info
   */
  function setFacebookInfo(info) {
    LocalStorage.set('facebook', info);
  }

  /**
   * Getting Facebook Info
   */
  function getFacebookInfo() {
    return LocalStorage.get('facebook');
  }

  /**
   * Remove Facebook Info
   */
  function removeFacebookInfo() {
    LocalStorage.remove('facebook');
  }

  /**
   * Set Media
   * @param info
   */
  function setMediaInfo(info) {
    LocalStorage.set('media', info);
  }

  /**
   * Getting Media Info
   */
  function getMediaInfo() {
    return LocalStorage.get('media');
  }

  /**
   * Remove Media Info
   */
  function removeMediaInfo() {
    LocalStorage.remove('media');
  }

  function setStrategies(strategies) {
    LocalStorage.set('strategies', strategies);
  }

  function getStrategies() {
    return LocalStorage.get('strategies');    
  }

  function getProfileImageUrl(size) {
    if(!size) size = "large";

     var user = getUser();
     return user && user.user_info ? user.user_info.avatar : "";
  }

  function userNeedsInitialSetup(contact_info, user_info, ma_info) {
    return (contact_info && (!contact_info.first_name || !contact_info.last_name))
      || (user_info && !user_info.display_name)
      || (user_info && !user_info.timezone);
  }

  return {
    getUser: getUser,
    setUser: setUser,
    setStats: setStats,
    getStats: getStats,
    removeStats: removeStats,
    setAccountOptions: setAccountOptions,
    getAccountOptions: getAccountOptions,
    setFacebookInfo: setFacebookInfo,
    getFacebookInfo: getFacebookInfo,
    removeFacebookInfo: removeFacebookInfo,
    setMediaInfo: setMediaInfo,
    getMediaInfo: getMediaInfo,
    removeMediaInfo: removeMediaInfo,
    setStrategies: setStrategies,
    getStrategies: getStrategies,
    getProfileImageUrl: getProfileImageUrl,
    setIdentityInfo: setIdentityInfo,
    getIdentityInfo: getIdentityInfo,
    userNeedsInitialSetup: userNeedsInitialSetup
  };
});
