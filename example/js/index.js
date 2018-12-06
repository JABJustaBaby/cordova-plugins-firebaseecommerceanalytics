/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const products = [{
    ITEM_ID: "sku1234",
    ITEM_NAME: "Donut Friday Scented T-Shirt",
    ITEM_CATEGORY: "Apparel/Men/Shirts",
    ITEM_VARIANT: "Blue",
    ITEM_BRAND: "Google",
    PRICE: 29.99,
    CURRENCY: "USD",
    INDEX: 1 //incremented value, next product should have index 2
}, {
    ITEM_ID: "sku5678",
    ITEM_NAME: "Android Workout Capris",
    ITEM_CATEGORY: "Apparel/Women/Pants",
    ITEM_VARIANT: "Black",
    ITEM_BRAND: "Google",
    PRICE: 39.99,
    CURRENCY: "USD",
    INDEX: 2 //incremented value, next product should have index 2
}];


const cartProducts = [{
    ITEM_ID: "sku1234",
    ITEM_NAME: "Donut Friday Scented T-Shirt",
    ITEM_CATEGORY: "Apparel/Men/Shirts",
    ITEM_VARIANT: "Blue",
    ITEM_BRAND: "Google",
    PRICE: 29.99,
    CURRENCY: "USD",
    QUANTITY: 1 //incremented value, next product should have index 2
}, {
    ITEM_ID: "sku5678",
    ITEM_NAME: "Android Workout Capris",
    ITEM_CATEGORY: "Apparel/Women/Pants",
    ITEM_VARIANT: "Black",
    ITEM_BRAND: "Google",
    PRICE: 39.99,
    CURRENCY: "USD",
    QUANTITY: 2 //incremented value, next product should have index 2
}];


const promotion = {
    ITEM_ID: "PROMO_1234",
    ITEM_NAME: "Summer Sale",
    CREATIVE_NAME: "summer_banner2",
    CREATIVE_SLOT: "banner_slot1"
};

const singleProductWithQuantity = {
    ITEM_ID: "sku1234",
    ITEM_NAME: "Donut Friday Scented T-Shirt",
    ITEM_CATEGORY: "Apparel/Men/Shirts",
    ITEM_VARIANT: "Blue",
    ITEM_BRAND: "Google",
    PRICE: 29.99,
    CURRENCY: "USD",
    QUANTITY: 1 //incremented value, next product should have index 2
};

const singleProductWithIndex = {
    ITEM_ID: "sku1234",
    ITEM_NAME: "Donut Friday Scented T-Shirt",
    ITEM_CATEGORY: "Apparel/Men/Shirts",
    ITEM_VARIANT: "Blue",
    ITEM_BRAND: "Google",
    PRICE: 29.99,
    CURRENCY: "USD",
    INDEX: 1 //incremented value, next product should have index 2
};

const singleProductDetail = {
    ITEM_ID: "sku1234",
    ITEM_NAME: "Donut Friday Scented T-Shirt",
    ITEM_CATEGORY: "Apparel/Men/Shirts",
    ITEM_VARIANT: "Blue",
    ITEM_BRAND: "Google",
    PRICE: 29.99,
    CURRENCY: "USD",
};

const extraCheckoutSteps = {
    STEP: 2, // number
    OPTION: "Visa",
};


const transactionDetails = {
    TRANSACTION_ID: "T12345",
    AFFILIATION: "Google Store - Online",
    VALUE: 37.39,
    TAX: 2.85,
    SHIPPING: 5.34,
    CURRENCY: "USD",
    COUPON: "SUMMER2017"
};


const fullRefundData = {
    TRANSACTION_ID: "T12345", // number
    VALUE: 37.39,
};

const partialRefundData = {
    TRANSACTION_ID: "T12345", // number
    VALUE: 37.39,
    ITEM_ID: "sku1234",
    QUANTITY: 1
};
const app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log("Device is Ready");
    },

    logProductListing: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logProductsListing(products, console.log, console.log);
    },

    logSelectProduct: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logSelectProduct(singleProductWithIndex, console.log, console.log);
    },

    logProductDetails: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logProductDetailView(singleProductWithIndex, console.log, console.log);
    },

    logAddToCart: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logAddToCart(singleProductWithQuantity, console.log, console.log);
    },

    logRemoveFromCart: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logRemoveFromCart(singleProductWithQuantity, console.log, console.log);
    },

    logPromotions: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logPromotionView(promotion, console.log, console.log);
    },

    logSelectPromotion: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logSelectPromotion(promotion, console.log, console.log);
    },

    logBeginCheckout: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logBeginCheckout(cartProducts, console.log, console.log);
    },

    logAdditionalCheckout: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logAdditionalCheckoutProcess(cartProducts, extraCheckoutSteps, console.log, console.log);
    },

    logCheckoutOptions: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logCheckoutOption(extraCheckoutSteps, console.log, console.log);
    },

    logPurchases: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logPurchases(cartProducts, transactionDetails, console.log, console.log);
    },

    logFullRefund: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logFullRefund(fullRefundData, console.log, console.log);
    },


    logPartialRefund: function () {
        cordova.plugins.FirebaseEcommerceAnalytics.logPartialRefund(partialRefundData, console.log, console.log);
    },
};

app.initialize();