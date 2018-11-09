/**
 * Local Storage service
 * @description This is a wrapper for the window.localStorage service
 * @author Samuel Castro
 * @since 12/15/15
 */
angular.module('hyper.core').factory('LocalStorage', function() {

  /**
   * Setting a localStorage object
   * @param key
   * @param value
   */
  function set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Getting a localStorage object
   * @param key
   * @returns {{}}
   */
  function get(key) {
    try{
      return JSON.parse(window.localStorage.getItem(key));
    } catch (exception) {
      return {};
    }
  }

  /**
   * Removing the localStorage object
   * @param key
   */
  function remove(key) {
    window.localStorage.removeItem(key)
  }

  return {
    set: set,
    get: get,
    remove: remove
  };
});
