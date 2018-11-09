//
//  FacebookConnectPlugin.h
//  GapFacebookConnect
//
//  Created by Jesse MacFadyen on 11-04-22.
//  Updated by Ally Ogilvie on 29/Jan/2014.
//  Updated by Jeduan Cornejo on 3/Jul/2015
//  Copyright 2011 Nitobi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <Cordova/CDV.h>
#import <JWPlayer-iOS-SDK/JWPlayerController.h>

@interface CordovaJWPlayer : CDVPlugin <JWPlayerDelegate>
    
    @property (nonatomic) JWPlayerController *player;
    @property (nonatomic) IBOutlet UITextView *callbacksView;
    @property (nonatomic) IBOutlet UILabel *playbackTime;
    @property (nonatomic) IBOutlet UIButton *playButton;
    @property (nonatomic) NSArray *playlist;
    @property (nonatomic) NSMutableDictionary *defaultOptions;
    @property (nonatomic) NSMutableDictionary *options;
    @property (nonatomic, retain) NSString *listenerOnPlayCallbackId;
    @property (nonatomic, retain) NSString *listenerOnPauseCallbackId;
    @property (nonatomic, retain) NSString *listenerOnPlayerStateChangeCallbackId;
    @property (nonatomic, retain) NSString *listenerOnBeforePlayCallbackId;
    @property (nonatomic, retain) NSString *listenerOnReadyCallbackId;
    @property (nonatomic, retain) NSString *listenerOnCompleteCallbackId;
    @property (nonatomic, retain) NSString *listenerOnBeforeCompleteCallbackId;
    @property (nonatomic, retain) NSString *listenerOnIdleCallbackId;
    @property (nonatomic, retain) NSString *listenerOnFullscreenCallbackId;
    @property (nonatomic, retain) NSArray *currentSupportedOrientation;
    @property (nonatomic, assign) UIInterfaceOrientation currentDeviceOrentation;

    extern const struct JWPOptionReadable
    {
        __unsafe_unretained NSString *forceFullScreenOnLandscape;
        __unsafe_unretained NSString *forceLandscapeOnFullScreen;
        __unsafe_unretained NSString *onlyFullScreen;
        __unsafe_unretained NSString *autostart;
        __unsafe_unretained NSString *controls;
        __unsafe_unretained NSString *repeat;
        __unsafe_unretained NSString *image;
        __unsafe_unretained NSString *title;
    } JWPOptionState;

- (void)play:(CDVInvokedUrlCommand*)command;
@end

@interface CordovaPlayerViewController : UIViewController

@property (strong, nonatomic) NSString *calledWith;

@end

const struct JWPOptionReadable JWPOptionState =
{
    .forceFullScreenOnLandscape = @"forceFullScreenOnLandscape",
    .forceLandscapeOnFullScreen = @"forceLandscapeOnFullScreen",
    .onlyFullScreen = @"onlyFullScreen",
    .autostart = @"autostart",
    .controls = @"controls",
    .repeat = @"repeat",
    .image = @"image",
    .title = @"title"
};
