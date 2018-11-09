"use strict";

/**
 * API Constant
 * @description API Constant provide the main API url
 * @author Samuel Castro
 * @since 12/3/15
 */
angular.module('hyper').constant('Config', {
  API_URL: "https://hyperplus-api.hypermartialarts.com/v1",
  //API_URL: "https://hyperplus-stage.hypermartialarts.com/v1",
  AUTH_URL: "https://identity.hypermartialarts.com/v1",
  //AUTH_URL: "https://identity-stage.hypermartialarts.com/v1",
  //AUTH_URL: "https://identity-api-dev.hypermartialarts.com/v1",
  API_TRAINING_URL : "https://traininglab-api.hypermartialarts.com/v1",
  //API_TRAINING_URL : "https://traininglab-stage.hypermartialarts.com/v1",
  //API_TRAINING_URL : "https://traininglab-api-dev.hypermartialarts.com/v1",
  FACEBOOK_APP_ID: "577235809101073",
  //FACEBOOK_APP_ID: "582342665257054",
  FACEBOOK_APP_NAMESPACE: "hypertraininglab",
  //FACEBOOK_APP_NAMESPACE: "hypermartialarts",
  FACEBOOK_APP_NAME: "Hyper Training Lab",
  //FACEBOOK_APP_NAME: "Hyper Training Lab - Stage",
  PUBLIC_URL: "https://hypermartialarts.com/traininglab",
  DEFAULT_POINTS_URL: "https://s3.amazonaws.com/HyperApp/Social/default-summary.png",
  PASSWORD_RECOVERY_LINK: "https://hyperproschool.com/account/recover/",
  PRIVACY_POLICY_LINK: "https://hypertraininglab.com/privacy/", 
  GET_HELP_LINK: "https://hypertraininglab.com/feedback/",
  FEEDBACK_LINK: "https://hypertraininglab.com/feedback/",
  STRIPE_PK: 'pk_live_ooR8c33CL9VAHtFe4aRH8Q4B',
  //STRIPE_PK: 'pk_test_3QsMyrjhrI4Fbdf775izIAmZ',
  NOTIFICATION : {
    TOPIC : 'traininglab'
  }
});
