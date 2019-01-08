/**
 * Cordova Firebase Enhanced Ecommerce Analytics Plugins.
 * @desc Please make sure Firebase and Play services version matches with your other plugins in the project. Also in iOS please open .xcworkspace file in Xcode * rather than .xcodeproj file or You can also directly open folder platforms/ios in Xcode if you do not want to select file. If you do not do so, then Xcode *will not be able to load all the pod dependencies
 * @example
 * 1) Please put google-services.json and Google-Info.plist file in your project root
 *
 * 2) Please add following in your config.xml, before installing the plugin
 * <preference name="GTMContainerName" value="NAME_OF_CONTAINER_FILE" />
 *
 * Container file should be in the format GTM-XXXXXX.json
 *
 *  cordova plugin add -d PathToPluginFolder --variable "FIREBASE_CORE_VERSION" = "16.+"
 * //for iOS
 *  cd platforms/ios
 *  pod install
 */
/*jshint esversion: 6 */
/**
 *  @constant
 *  @default
 */
const defaultProductObject = {
    ITEM_ID: 'string',
    ITEM_NAME: 'string',
    ITEM_CATEGORY: 'string',
    ITEM_VARIANT: 'string',
    ITEM_BRAND: 'string',
    PRICE: 'number',
    CURRENCY: 'string',
    INDEX: 'number',
    QUANTITY: 'number',
};
/**
 *  @constant
 *  @default
 */
const defaultTransactionObject = {
    TRANSACTION_ID: 'string',
    AFFILIATION: 'string',
    VALUE: 'number',
    TAX: 'number',
    SHIPPING: 'number',
    CURRENCY: 'string',
};
/**
 *  @constant
 *  @default
 */
const defaultPromotionObject = {
    ITEM_ID: "string",
    ITEM_NAME: "string",
};
/**
 *  @constant
 *  @default
 */
const defaultExtraCheckoutObject = {
    STEP: "number",
    OPTION: "string",
};
/**
 *  @constant
 *  @default
 */
const defaultRefundObject = {
    TRANSACTION_ID: "string",
    VALUE: "number",
    ITEM_ID: "string",
    QUANTITY: "number"
};


function validateObject(defaultObject, defaultProductKeysArray, objectToCheck, errorCallback) {
    if (typeof objectToCheck === 'object') {
        for (let i = 0, len = defaultProductKeysArray.length; i < len; i++) {
            let keyExists = objectToCheck.hasOwnProperty(defaultProductKeysArray[i]);
            //check if the required key exists
            if (!keyExists) {
                errorCallback(defaultProductKeysArray[i] + ' is missing');
                return false;
            }
            let currentItemDataType = defaultObject[defaultProductKeysArray[i]];
            let currentItem = objectToCheck[defaultProductKeysArray[i]];
            //check if the data type of passed value is same as the required datatype
            if (keyExists && typeof currentItem !== currentItemDataType) {
                errorCallback(defaultProductKeysArray[i] + ' is not a ' + currentItemDataType);
                return false;
            } else if (currentItemDataType === 'string' && currentItem.length === 0) { //string values only, check if it is not empty.
                errorCallback(defaultProductKeysArray[i] + ' cannot be empty');
                return false;
            }

            //if its a last key and above validation is passed, then return true
            if (i === len - 1) {
                return true;
            }
        }
    } else {
        errorCallback('Param should be an object');
        return false;
    }
}


var exec = require('cordova/exec');

/**
 * Measure product impressions by logging event with an ITEM_LIST parameter and one or more items (i.e. products) defined with the relevant fields.
 *
 * @method logProductsListing
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logProductsListing(products, item_list_name, successCallback, errorCallback)
 * @param {Array<object>} products - Array of product items.
 * @param {String} item_list_name Item Lists Name to send to Firebase. Defaults to "Search Results"
 * @example
 * var products = [
 *      {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          INDEX:1 //incremented value, next product should have index 2
 *      }
 * ];
 *
 * var item_list_name = "Search Results";
 * cordova.plugins.FirebaseEcommerceAnalytics.logProductsListing(products, item_list_name, successCallback, errorCallback);
 */
exports.logProductsListing = function (products, item_list_name, successCallback, errorCallback) {
    if (!item_list_name || item_list_name.length === 0) {
        item_list_name = "Search Results";
    }
    exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logProductsListing', [
        products, item_list_name
    ]);
};

/**
 * This function is used to log product click/select impressions..
 *
 * @method logSelectProduct
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logSelectProduct(product,item_list_name,successCallback, errorCallback)
 * @param {Object} product - Single product object
 * @param {String} item_list_name Item Lists Name to send to Firebase. Defaults to "Search Results"
 * @example
 * var product = {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          INDEX:1 //incremented value, next product should have index 2
 * };
 *
 * var item_list_name = "Search Results";
 * cordova.plugins.FirebaseEcommerceAnalytics.logSelectProduct(product,item_list_name, successCallback, errorCallback);
 */


exports.logSelectProduct = function (product, item_list_name, successCallback, errorCallback) {
    if (!item_list_name || item_list_name.length === 0) {
        item_list_name = "Search Results";
    }
    //Get the default required keys
    let defaultProductKeysArray = Object.keys(defaultProductObject);

    //get index to remove QUANTITY key from default products keys array
    let index = defaultProductKeysArray.indexOf('QUANTITY');

    //remove the index
    defaultProductKeysArray.splice(index, 1);

    if (validateObject(defaultProductObject, defaultProductKeysArray, product, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logSelectProduct', [
            product, item_list_name
        ]);
    }
};

/**
 * Measure product clicks by logging a SELECT_CONTENT event with an item (i.e. product) defined with the relevant fields
 *
 * @method logProductDetailView
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logProductDetailView(product,successCallback, errorCallback)
 * @param {Object} product - Single product object
 * @example
 * var product = {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          INDEX:1 //incremented value, next product should have index 2
 * };
 *
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logProductDetailView(product,successCallback, errorCallback);
 */
exports.logProductDetailView = function (product, successCallback, errorCallback) {
    //Get the default required keys
    let defaultProductKeysArray = Object.keys(defaultProductObject);
    //get index to remove QUANTITY key from default products keys array
    let index = defaultProductKeysArray.indexOf('QUANTITY');

    //remove the index
    defaultProductKeysArray.splice(index, 1);

    if (validateObject(defaultProductObject, defaultProductKeysArray, product, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logProductDetailView', [
            product,
        ]);
    }
};

/**
 * Measure a product being added to a shopping cart by logging an ADD_TO_CART event with an item (i.e. product) defined with the relevant fields
 *
 * @method logAddToCart
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logAddToCart(product,successCallback, errorCallback)
 * @param {Object} product - Single product object
 * @example
 * var product = {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          QUANTITY:1
 * };
 *
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logAddToCart(product,successCallback, errorCallback);
 */
exports.logAddToCart = function (product, successCallback, errorCallback) {
    //Get the default required keys
    let defaultProductKeysArray = Object.keys(defaultProductObject);

    //get index to remove INDEX key from default products keys array
    let index = defaultProductKeysArray.indexOf('INDEX');

    //remove the index
    defaultProductKeysArray.splice(index, 1);

    if (validateObject(defaultProductObject, defaultProductKeysArray, product, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logAddToCart', [product]);
    }
};

/**
 * Measure a product being removed from a shopping cart by logging a REMOVE_FROM_CART event with an item (i.e. product) defined with the relevant fields
 *
 * @method logRemoveFromCart
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logRemoveFromCart(product,successCallback, errorCallback)
 * @param {Object} product - Single product object
 * @example
 * var product = {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          QUANTITY:1
 * };
 *
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logRemoveFromCart(product,successCallback, errorCallback);
 */
exports.logRemoveFromCart = function (product, successCallback, errorCallback) {
    //Get the default required keys
    let defaultProductKeysArray = Object.keys(defaultProductObject);

    //get index to remove INDEX key from default products keys array
    let index = defaultProductKeysArray.indexOf('INDEX');

    //remove the index
    defaultProductKeysArray.splice(index, 1);

    if (validateObject(defaultProductObject, defaultProductKeysArray, product, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logRemoveFromCart', [
            product,
        ]);
    }
};

/**
 * Measure promotion impressions by logging a VIEW_ITEM, VIEW_ITEM_LIST, or VIEW_SEARCH_RESULTS event with a promotion item defined with the relevant fields
 *
 * @method logPromotionView
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logPromotionView(promotion)
 * @param {Object} promotion - Single promotion data
 * @example
 * var promotion = {
 *          ITEM_ID:"PROMO_1234",
 *          ITEM_NAME:"Summer Sale",
 *          CREATIVE_NAME:"summer_banner2",
 *          CREATIVE_SLOT:"banner_slot1"
 * };
 *
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logPromotionView(promotion,successCallback, errorCallback);
 */
exports.logPromotionView = function (promotion, successCallback, errorCallback) {
    let defaultProductKeysArray = Object.keys(defaultPromotionObject);
    if (validateObject(defaultPromotionObject, defaultProductKeysArray, promotion, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logPromotionView', [
            promotion,
        ]);
    }
};

/**
 * Measure promotion clicks by logging a SELECT_CONTENT event with a promotion defined with the relevant fields
 *
 * @method logSelectPromotion
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logSelectPromotion(promotion,successCallback, errorCallback)
 * @param {Object} promotion - Single promotion data
 * @example
 * var promotion = {
 *          ITEM_ID:"PROMO_1234",
 *          ITEM_NAME:"Summer Sale",
 *          CREATIVE_NAME:"summer_banner2",
 *          CREATIVE_SLOT:"banner_slot1"
 * };
 *
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logSelectPromotion(promotion,successCallback, errorCallback);
 */

exports.logSelectPromotion = function (promotion, successCallback, errorCallback) {
    let defaultProductKeysArray = Object.keys(defaultPromotionObject);
    if (validateObject(defaultPromotionObject, defaultProductKeysArray, promotion, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logSelectPromotion', [
            promotion,
        ]);
    }
};

/**
 * Measure the first step in a checkout process by logging a BEGIN_CHECKOUT event with one or more items (i.e. products) defined with the relevant fields
 *
 * @method logBeginCheckout
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logBeginCheckout(products,successCallback, errorCallback)
 * @param {Array<object>} products - Array of product items.
 * @example
 * var products = [
 *      {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          QUANTITY:1 //incremented value, next product should have index 2
 *      }
 * ];
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logBeginCheckout(products,successCallback, errorCallback);
 */
exports.logBeginCheckout = function (products, successCallback, errorCallback) {
    exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logBeginCheckout', [
        products,
    ]);
};

/**
 * Measure additional steps in a checkout process by logging a CHECKOUT_PROGRESS event with one or more items (i.e. products) defined with the relevant fields
 *
 * @method logAdditionalCheckoutProcess
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logAdditionalCheckoutProcess(products, extraCheckoutSteps,successCallback, errorCallback)
 * @param {Array<object>} products - Array of product items.
 * @param {Object} extraCheckoutSteps - Optional extra checkout steps, can send seperately using logCheckoutOption method too. *
 * @example
 * var products = [
 *      {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          QUANTITY:1 //incremented value, next product should have index 2
 *      }
 * ];
 *
 * var extraCheckoutSteps = {
 *         STEP:2, // number
 *         OPTION:"Visa",
 * };
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logAdditionalCheckoutProcess(products, extraCheckoutSteps,successCallback, errorCallback);
 */
exports.logAdditionalCheckoutProcess = function (
    products,
    extraCheckoutSteps,
    successCallback,
    errorCallback
) {
    exec(
        successCallback,
        errorCallback,
        'FirebaseEcommerceAnalytics',
        'logAdditionalCheckoutProcess',
        [products, extraCheckoutSteps]
    );
};

/**
 * Measure additional information about the state of the checkout process. You can either measure checkout options either as part of a checkout step event (as logAdditionalCheckoutProcess method) or upon a user selecting an option after the event for a given checkout step has already been logged
 *
 * @method logCheckoutOption
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logCheckoutOption(checkoutOption,successCallback, errorCallback)
 * @param {object} checkoutOption - Checkout option object
 * @example
 * var checkoutOption = {
 *         STEP:2, // number
 *         OPTION:"Visa",
 * };
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logCheckoutOption(checkoutOption,successCallback, errorCallback);
 */
exports.logCheckoutOption = function (checkoutOption, successCallback, errorCallback) {
    exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logCheckoutOption', [
        checkoutOption,
    ]);
};

/**
 * Measure purchases by logging an ECOMMERCE_PURCHASE event with one or more items (i.e. products) defined with the relevant fields
 *
 * @method logPurchases
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logPurchases(products, transactionDetails,successCallback, errorCallback)
 * @param {Array<object>} products - Array of product items.
 * @param {object} transactionDetails - Transaction details object
 * @example
 * var products = [
 *      {
 *          ITEM_ID:"sku1234",
 *          ITEM_NAME:"Donut Friday Scented T-Shirt",
 *          ITEM_CATEGORY:"Apparel/Men/Shirts",
 *          ITEM_VARIANT:"Blue",
 *          ITEM_BRAND:"Google",
 *          PRICE:29.99,
 *          CURRENCY: "USD",
 *          QUANTITY:1 //incremented value, next product should have index 2
 *      }
 * ];
 * var transactionDetails = {
 *      TRANSACTION_ID: "T12345",
 *      AFFILIATION: "Google Store - Online",
 *      VALUE: 37.39,
 *      TAX: 2.85,
 *      SHIPPING:5.34,
 *      CURRENCY: "USD",
 *      COUPON: "SUMMER2017"
 * };
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logPurchases(products, transactionDetails,successCallback, errorCallback);
 */


exports.logPurchases = function (products, transactionDetails, successCallback, errorCallback) {
    let defaultProductKeysArray = Object.keys(defaultTransactionObject);
    if (validateObject(defaultTransactionObject, defaultProductKeysArray, transactionDetails, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logPurchases', [
            products,
            transactionDetails,
        ]);
    }
};

/**
 * Measure full refunds by logging a PURCHASE_REFUND event with the relevant transaction ID specified.
 *
 * @method logFullRefund
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logFullRefund(refundData,successCallback, errorCallback)
 * @param {object} refundData - Refund Data object
 * @example
 * var refundData = {
 *       TRANSACTION_ID:"T12345", // number
 *       VALUE:37.39,
 * };
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logFullRefund(refundData,successCallback, errorCallback);
 */
exports.logFullRefund = function (refundData, successCallback, errorCallback) {
    let defaultProductKeysArray = Object.keys(defaultRefundObject);
    //remove the partial refund keys ITEM_ID and QUANTITY
    defaultProductKeysArray.splice(2, 2);
    if (validateObject(defaultRefundObject, defaultProductKeysArray, refundData, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logFullRefund', [
            refundData,
        ]);
    }
};

/**
 *  Measure partial refunds by logging a PURCHASE_REFUND event with the relevant transaction ID specified.and one or more items (i.e. products) defined with item IDs and quantities.
 *
 * @method logPartialRefund
 * @summary USAGE - cordova.plugins.FirebaseEcommerceAnalytics.logPartialRefund(refundData,successCallback, errorCallback)
 * @param {object} refundData - Refund Data object
 * @example
 * var refundData = {
 *        TRANSACTION_ID:"T12345", // number
 *        VALUE:37.39,
 *        ITEM_ID: "sku1234",
 *        QUANTITY: 1
 * };
 *
 * cordova.plugins.FirebaseEcommerceAnalytics.logPartialRefund(refundData,successCallback, errorCallback);
 */
exports.logPartialRefund = function (refundData, successCallback, errorCallback) {
    let defaultProductKeysArray = Object.keys(defaultRefundObject);
    if (validateObject(defaultRefundObject, defaultProductKeysArray, refundData, errorCallback)) {
        exec(successCallback, errorCallback, 'FirebaseEcommerceAnalytics', 'logPartialRefund', [
            refundData,
        ]);
    }
};