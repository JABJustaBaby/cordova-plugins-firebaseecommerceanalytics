#import <Cordova/CDV.h>

@interface FirebaseEcommerceAnalytics : CDVPlugin

- (void)logProductsListing:(CDVInvokedUrlCommand *)command;
- (void)logSelectProduct:(CDVInvokedUrlCommand *)command;
- (void)logProductDetailView:(CDVInvokedUrlCommand *)command;
- (void)logAddToCart:(CDVInvokedUrlCommand *)command;
- (void)logRemoveFromCart:(CDVInvokedUrlCommand *)command;
- (void)logPromotionView:(CDVInvokedUrlCommand *)command;
- (void)logSelectPromotion:(CDVInvokedUrlCommand *)command;
- (void)logBeginCheckout:(CDVInvokedUrlCommand *)command;
- (void)logAdditionalCheckoutProcess:(CDVInvokedUrlCommand *)command;
- (void)logCheckoutOption:(CDVInvokedUrlCommand *)command;
- (void)logPurchases:(CDVInvokedUrlCommand *)command;
- (void)logFullRefund:(CDVInvokedUrlCommand *)command;
- (void)logPartialRefund:(CDVInvokedUrlCommand *)command;
@end
