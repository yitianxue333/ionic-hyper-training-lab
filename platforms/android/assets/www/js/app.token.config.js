/**
 * Token Validation
 * @description This section contais the token validation process
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper')

  .run(function(Authentication) {

    /**
     * Decoding and validating JWT token
     */
    Authentication.tokenValidation();

  });
