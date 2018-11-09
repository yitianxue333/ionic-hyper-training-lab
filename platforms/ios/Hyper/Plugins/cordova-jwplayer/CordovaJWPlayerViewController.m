//
//  CordovaJWPlayerViewController.m
//  Hyper
//
//  Created by SCIT MATRIX on 11/10/16.
//
//


#import "CordovaJWPlayerViewController.h"

@implementation CDVViewController (UpdateSupportedOrientations)

- (void)updateSupportedOrientations:(NSArray *)orientations {
    
    [self setValue:orientations forKey:@"supportedOrientations"];
    
}

@end
