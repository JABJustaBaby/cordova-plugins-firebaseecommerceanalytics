/********* FirebaseEcommerceAnalytics.m Cordova Plugin Implementation *******/

#import "FirebaseEcommerceAnalytics.h"
@import Firebase;


@implementation FirebaseEcommerceAnalytics

/*
 * @brief Cordova Default Plugin Initialize
 * @description Method is called when plugin is first loaded in the app
 */

-(void) pluginInitialize
{
    [super pluginInitialize];
    NSLog(@"[FirebaseEcommerceAnalytics] Plugin Initialized");
    [FIRApp configure];
}


- (void) logProductsListing:(CDVInvokedUrlCommand *)command {
    NSArray *params = [command argumentAtIndex:0];
//    NSLog(@"params = %@", params);
    int len = (int)params.count;
    NSMutableArray *items = [[NSMutableArray alloc] init];
    for(int i=0; i < len; i++){
        NSDictionary *productObject = [params objectAtIndex:i];
        int index = i;
        id obj = productObject[@"INDEX"];
        if ((obj != nil) && (obj != (id)[NSNull null])) {
            index = [obj intValue];
        }
        NSDictionary *product = [self getProductDictionaryWithIndex:productObject];
        [items addObject:product];
    }
    
    // Prepare ecommerce dictionary.
    NSArray *productData = [items copy];
//    NSLog(@"productData = %@", productData);
    NSDictionary *ecommerce = @{
                                @"items" : productData,
                                kFIRParameterItemList : @"Search Results" // List name.
                                };
    
    // Log select_content event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventViewSearchResults parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logSelectProduct:(CDVInvokedUrlCommand *)command {
    NSDictionary *productObject = [self getProductDictionaryWithIndex:[command argumentAtIndex:0]];
    NSArray *items = @[productObject];
    NSLog(@"productObject = %@", productObject);
    NSDictionary *ecommerce = @{
                                @"items" : items,
                                kFIRParameterItemList : @"Search Results" // List name.
                                };
    
    // Log select_content event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventSelectContent parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logProductDetailView:(CDVInvokedUrlCommand *)command {
    NSDictionary *productObject = [self getProductDictionary:[command argumentAtIndex:0]];
    NSArray *items = @[productObject];
    NSDictionary *ecommerce = @{
                                @"items" : items,
                                kFIRParameterItemList : @"Search Results" // List name.
                                };
    
    // Log view_item event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventViewItem parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logAddToCart:(CDVInvokedUrlCommand *)command {
    NSDictionary *productObject = [self getProductDictionaryWithQuantity:[command argumentAtIndex:0]];
    NSArray *items = @[productObject];
    NSDictionary *ecommerce = @{
                                @"items" : items
                                };

    [FIRAnalytics logEventWithName:kFIREventAddToCart parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logRemoveFromCart:(CDVInvokedUrlCommand *)command {
    NSDictionary *productObject = [self getProductDictionaryWithQuantity:[command argumentAtIndex:0]];
    NSArray *items = @[productObject];
    NSDictionary *ecommerce = @{
                                @"items" : items
                                };
    [FIRAnalytics logEventWithName:kFIREventRemoveFromCart parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logPromotionView:(CDVInvokedUrlCommand *)command {
    // Define promotion with relevant parameters.
    NSDictionary *params = [command argumentAtIndex:0];
    NSDictionary *promotion = @{
                                kFIRParameterItemID :[self checkAndFormatToString:[params objectForKey:@"ITEM_ID"]], // promotion ID; either ITEM_ID or ITEM_NAME is.
                                kFIRParameterItemName : [self checkAndFormatToString:[params objectForKey:@"ITEM_NAME"]], // promotion name.
                                kFIRParameterCreativeName : [self checkAndFormatToString:[params objectForKey:@"CREATIVE_NAME"]],
                                kFIRParameterCreativeSlot : [self checkAndFormatToString:[params objectForKey:@"CREATIVE_SLOT"]]
                                };
    
    // Prepare ecommerce dictionary.
    NSArray *promotions = @[promotion];
    NSDictionary *ecommerce = @{
                                @"promotions" : promotions
                                };
    
    // Log view_item, view_item_list, or view_search_results
    // event with ecommerce bundle.
    [FIRAnalytics logEventWithName:kFIREventViewItem parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logSelectPromotion:(CDVInvokedUrlCommand *)command {
    // Define promotion with relevant parameters.
    NSDictionary *params = [command argumentAtIndex:0];
    NSString *item_id =[self checkAndFormatToString:[params objectForKey:@"ITEM_ID"]];
    NSDictionary *promotion = @{
                                kFIRParameterItemID : item_id, // promotion ID; either ITEM_ID or ITEM_NAME is.
                                kFIRParameterItemName : [self checkAndFormatToString:[params objectForKey:@"ITEM_NAME"]], // promotion name.
                                kFIRParameterCreativeName : [self checkAndFormatToString:[params objectForKey:@"CREATIVE_NAME"]],
                                kFIRParameterCreativeSlot : [self checkAndFormatToString:[params objectForKey:@"CREATIVE_SLOT"]]
                                };
    
    // Prepare ecommerce dictionary.
    NSArray *promotions = @[promotion];
    
    // Set properties for the event to be shown in the Google Analytics (Firebase) reports.
    // These properties will not impact the Universal Analytics reporting.
    NSDictionary *ecommerce = @{
                                kFIRParameterItemID : item_id,
                                kFIRParameterContentType : @"Internal Promotions",
                                @"promotions" : promotions
                                };
    
    // Log select_content, view_item_list, or view_search_results event with ecommerce bundle.
    [FIRAnalytics logEventWithName:kFIREventSelectContent parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logBeginCheckout:(CDVInvokedUrlCommand *)command {
    NSArray *params = [command argumentAtIndex:0];
    //    NSLog(@"params = %@", params);
    int len = (int)params.count;
    NSMutableArray *items = [[NSMutableArray alloc] init];
    for(int i=0; i < len; i++){
        NSDictionary *product = [self getProductDictionaryWithQuantity:[params objectAtIndex:i]];
        [items addObject:product];
    }
    
    // Prepare ecommerce dictionary.
    NSArray *productData = [items copy];
    //    NSLog(@"productData = %@", productData);
    NSDictionary *ecommerce = @{
                                @"items" : productData,
                                };
    // Log BEGIN_CHECKOUT event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventBeginCheckout parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logAdditionalCheckoutProcess:(CDVInvokedUrlCommand *)command {
    NSArray *params = [command argumentAtIndex:0];
    NSDictionary *checkoutOptions = [command argumentAtIndex:1];
    //    NSLog(@"params = %@", params);
    int len = (int)params.count;
    NSMutableArray *items = [[NSMutableArray alloc] init];
    for(int i=0; i < len; i++){
        NSDictionary *product = [self getProductDictionaryWithQuantity:[params objectAtIndex:i]];
        [items addObject:product];
    }
    
    // Prepare ecommerce dictionary.
    NSArray *productData = [items copy];
    //    NSLog(@"productData = %@", productData);
    NSNumber *checkoutStep = [NSNumber numberWithInt:[[checkoutOptions objectForKey:@"STEP"] intValue]];
    NSString *checkoutType = [self checkAndFormatToString:[checkoutOptions objectForKey:@"OPTION"]];
    NSDictionary *ecommerce = @{
                                @"items" : productData,
                                kFIRParameterCheckoutStep: checkoutStep,
                                kFIRParameterCheckoutOption: checkoutType
                                };
    // Log BEGIN_CHECKOUT event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventBeginCheckout parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logCheckoutOption:(CDVInvokedUrlCommand *)command {
    NSDictionary *checkoutOptions = [command argumentAtIndex:0];
    NSNumber *checkoutStep = [NSNumber numberWithInt:[[checkoutOptions objectForKey:@"STEP"] intValue]];
    NSString *checkoutType = [self checkAndFormatToString:[checkoutOptions objectForKey:@"OPTION"]];
    NSDictionary *ecommerce = @{
                                kFIRParameterCheckoutStep: checkoutStep,
                                kFIRParameterCheckoutOption: checkoutType
                                };
    // Log BEGIN_CHECKOUT event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventSetCheckoutOption parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logPurchases:(CDVInvokedUrlCommand *)command {
    NSArray *params = [command argumentAtIndex:0];
    NSDictionary *transactionDetails = [command argumentAtIndex:1];
    //    NSLog(@"params = %@", params);
    int len = (int)params.count;
    NSMutableArray *items = [[NSMutableArray alloc] init];
    for(int i=0; i < len; i++){
        NSDictionary *product = [self getProductDictionaryWithQuantity:[params objectAtIndex:i]];
        [items addObject:product];
    }
    
    // Prepare ecommerce dictionary.
    NSArray *productData = [items copy];
    NSString *coupon = [self checkAndFormatToString:[transactionDetails objectForKey:@"COUPON"]];
    NSNumber *revenue =[NSNumber numberWithDouble:[[transactionDetails objectForKey:@"VALUE"] doubleValue]];
    NSNumber *tax =[NSNumber numberWithDouble:[[transactionDetails objectForKey:@"TAX"] doubleValue]];
    NSNumber *shipping =[NSNumber numberWithDouble:[[transactionDetails objectForKey:@"SHIPPING"] doubleValue]];
    NSDictionary *ecommerce = @{
                                @"items": productData,
                                kFIRParameterItemList: @"Purchase List",
                                kFIRParameterTransactionID : [self checkAndFormatToString:[transactionDetails objectForKey:@"TRANSACTION_ID"]],
                                kFIRParameterAffiliation : [self checkAndFormatToString:[transactionDetails objectForKey:@"AFFILIATION"]],
                                kFIRParameterValue : revenue, // Revenue.
                                kFIRParameterTax : tax,
                                kFIRParameterShipping : shipping,
                                kFIRParameterCurrency : [self checkAndFormatToString:[transactionDetails objectForKey:@"CURRENCY"]],
                                kFIRParameterCoupon : coupon
                                };
    // Log ecommerce_purchase event with ecommerce dictionary.
    [FIRAnalytics logEventWithName:kFIREventEcommercePurchase parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logFullRefund:(CDVInvokedUrlCommand *)command {
    NSDictionary *refundParams = [command argumentAtIndex:0];
    NSNumber *revenue =[NSNumber numberWithDouble:[[refundParams objectForKey:@"VALUE"] doubleValue]];
    // Prepare ecommerce bundle with transaction ID to be refunded.
    NSDictionary *ecommerce = @{
                                kFIRParameterTransactionID : [self checkAndFormatToString:[refundParams objectForKey:@"TRANSACTION_ID"]], // Required.
                                kFIRParameterValue : revenue // Optional in Universal Analytics.
                                };
    
    // Log purchase_refund event with ecommerce.
    [FIRAnalytics logEventWithName:kFIREventPurchaseRefund parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}
- (void) logPartialRefund:(CDVInvokedUrlCommand *)command {
    NSDictionary *refundParams = [command argumentAtIndex:0];
    NSNumber *revenue =[NSNumber numberWithDouble:[[refundParams objectForKey:@"VALUE"] doubleValue]];
    NSNumber *quantity = [NSNumber numberWithInt:[[refundParams objectForKey:@"QUANTITY"] intValue]];
    // quantities of products being refunded.
    NSDictionary *refundedProduct = @{
                                      kFIRParameterItemID : [self checkAndFormatToString:[refundParams objectForKey:@"ITEM_ID"]], // Required for partial refund.
                                      kFIRParameterQuantity : quantity
                                      };
    
    // Prepare ecommerce bundle with transaction ID to be refunded.
    NSDictionary *ecommerce = @{
                                @"items" : @[ refundedProduct ],
                                kFIRParameterTransactionID : [self checkAndFormatToString:[refundParams objectForKey:@"TRANSACTION_ID"]], // Required.
                                kFIRParameterValue : revenue // Optional in Universal Analytics.

                                };
    
    // Log purchase_refund event with ecommerce.
    [FIRAnalytics logEventWithName:kFIREventPurchaseRefund parameters:ecommerce];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (NSString *) checkAndFormatToString: (id) data {
     if ([data isKindOfClass:[NSString class]]) {
         return data;
     } else {
         return [NSString stringWithFormat:@"%@", data];
     }
}

- (NSDictionary *) getProductDictionary: (NSDictionary*) options {
    NSDictionary *defaultProduct = [NSDictionary dictionaryWithObjectsAndKeys:
                                    kFIRParameterItemID, @"item_id",
                                    kFIRParameterItemName, @"item_name",
                                    kFIRParameterItemCategory, @"item_category",
                                    kFIRParameterItemVariant, @"item_variant",
                                    kFIRParameterItemBrand, @"item_brand",
                                    kFIRParameterCurrency, @"currency",
                                    kFIRParameterPrice, @"price", nil];
    return [self createFirebaseParamFormat:options withDefault:defaultProduct];
}


- (NSDictionary *) getProductDictionaryWithQuantity: (NSDictionary*) options {
    NSDictionary *defaultProduct = [NSDictionary dictionaryWithObjectsAndKeys:
                                    kFIRParameterItemID, @"item_id",
                                    kFIRParameterItemName, @"item_name",
                                    kFIRParameterItemCategory, @"item_category",
                                    kFIRParameterItemVariant, @"item_variant",
                                    kFIRParameterItemBrand, @"item_brand",
                                    kFIRParameterCurrency, @"currency",
                                    kFIRParameterPrice, @"price",
                                    kFIRParameterQuantity, @"quantity", nil];
    return [self createFirebaseParamFormat:options withDefault:defaultProduct];
}

- (NSDictionary *) getProductDictionaryWithIndex: (NSDictionary*) options {

    NSDictionary *defaultProduct = [NSDictionary dictionaryWithObjectsAndKeys:
                                    kFIRParameterItemID, @"item_id",
                                    kFIRParameterItemName, @"item_name",
                                    kFIRParameterItemCategory, @"item_category",
                                    kFIRParameterItemVariant, @"item_variant",
                                    kFIRParameterItemBrand, @"item_brand",
                                    kFIRParameterCurrency, @"currency",
                                    kFIRParameterPrice, @"price",
                                    kFIRParameterIndex, @"index", nil];
    return [self createFirebaseParamFormat:options withDefault:defaultProduct];
    
}

- (NSDictionary *)createFirebaseParamFormat:(NSDictionary *)params withDefault:(NSDictionary *)defaultProduct
{
    NSMutableDictionary *mappedParams = [NSMutableDictionary dictionaryWithDictionary:params];
    [defaultProduct enumerateKeysAndObjectsUsingBlock:^(NSString *original, NSString *new, BOOL *stop) {
        id data = [params objectForKey:original];
        if (data) {
            [mappedParams removeObjectForKey:original];
            [mappedParams setObject:data forKey:new];
        }
    }];
    
    NSDictionary *dictionary = [mappedParams copy];
    NSMutableDictionary *output = [NSMutableDictionary dictionaryWithCapacity:dictionary.count];
    [dictionary enumerateKeysAndObjectsUsingBlock:^(id key, id data, BOOL *stop) {
        [output removeObjectForKey:key];
        key = [key stringByReplacingOccurrencesOfString:@" " withString:@"_"];
        if ([data isKindOfClass:[NSNumber class]]) {
            data = [NSNumber numberWithDouble:[data doubleValue]];
            [output setObject:data forKey:key];
        } else {
            [output setObject:[NSString stringWithFormat:@"%@", data] forKey:key];
        }
    }];
//    NSLog(@"output = %@", output);
    return [output copy];
}

@end
