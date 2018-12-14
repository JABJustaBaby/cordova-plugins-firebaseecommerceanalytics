package me.rahul.plugins.firebaseecommerceanalytics;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.android.gms.analytics.HitBuilders;
import com.google.firebase.analytics.FirebaseAnalytics.Event;
import com.google.firebase.analytics.FirebaseAnalytics.Param;

import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * This class echoes a string called from JavaScript.
 */
public class FirebaseEcommerceAnalytics extends CordovaPlugin {

    private static final String TAG = "FirebaseEcommercePlugin";

    private FirebaseAnalytics firebaseAnalytics;

    @Override
    protected void pluginInitialize() {
        Log.d(TAG, "Starting Firebase Analytics plugin");

        Context context = this.cordova.getActivity().getApplicationContext();

        this.firebaseAnalytics = FirebaseAnalytics.getInstance(context);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        // Log Product Listings
        if (action.equals("logProductsListing")) {
            JSONArray products = args.getJSONArray(0);
            String list_name = args.getString(1);
            this.logProductsListing(products, list_name, callbackContext);
            return true;
        }
        // Log Product select/click events
        if (action.equals("logSelectProduct")) {
            JSONObject product = args.getJSONObject(0);
            String list_name = args.getString(1);
            this.logSelectProduct(product, list_name, callbackContext);
            return true;
        }
        if (action.equals("logProductDetailView")) {
            JSONObject product = args.getJSONObject(0);
            this.logProductDetailView(product, callbackContext);
            return true;
        }
        if (action.equals("logAddToCart")) {
            JSONObject product = args.getJSONObject(0);
            this.logAddToCart(product, callbackContext);
            return true;
        }
        if (action.equals("logRemoveFromCart")) {
            JSONObject product = args.getJSONObject(0);
            this.logRemoveFromCart(product, callbackContext);
            return true;
        }
        if (action.equals("logPromotionView")) {
            JSONObject product = args.getJSONObject(0);
            this.logPromotionView(product, callbackContext);
            return true;
        }
        if (action.equals("logSelectPromotion")) {
            JSONObject product = args.getJSONObject(0);
            this.logSelectPromotion(product, callbackContext);
            return true;
        }
        if (action.equals("logBeginCheckout")) {
            JSONArray products = args.getJSONArray(0);
            this.logBeginCheckout(products, callbackContext);
            return true;
        }
        if (action.equals("logAdditionalCheckoutProcess")) {
            JSONArray products = args.getJSONArray(0);
            JSONObject checkoutOptions = args.getJSONObject(1);
            this.logAdditionalCheckoutProcess(products, checkoutOptions, callbackContext);
            return true;
        }
        if (action.equals("logCheckoutOption")) {
            JSONObject checkoutOptions = args.getJSONObject(0);
            this.logCheckoutOption(checkoutOptions, callbackContext);
            return true;
        }
        if (action.equals("logPurchases")) {
            JSONArray products = args.getJSONArray(0);
            JSONObject transactionDetails = args.getJSONObject(1);
            this.logPurchases(products, transactionDetails, callbackContext);
            return true;
        }
        if (action.equals("logFullRefund")) {
            JSONObject refundData = args.getJSONObject(0);
            this.logFullRefund(refundData, callbackContext);
            return true;
        }
        if (action.equals("logPartialRefund")) {
            JSONObject refundData = args.getJSONObject(0);
            this.logPartialRefund(refundData, callbackContext);
            return true;
        }
        return false;
    }

    private void logProductsListing(JSONArray products, String list_name, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle
            ArrayList items = new ArrayList();
            for (int i = 0, size = products.length(); i < size; i++) {
                JSONObject product = products.getJSONObject(i);
                if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                    callbackContext.error("Required param ITEM_ID or ITEM_NAME is empty");
                    return;
                } else {
                    Bundle a = this.getProductBundle(product, i, false);
                    items.add(a);
                }
            }
            Bundle ecommerceBundle = new Bundle();
            ecommerceBundle.putParcelableArrayList("items", items);

            // Set relevant bundle-level parameters

            ecommerceBundle.putString(Param.ITEM_LIST, list_name); // List name

            // Log view_search_results or view_item_list event with ecommerce bundle
            this.firebaseAnalytics.logEvent(Event.VIEW_SEARCH_RESULTS, ecommerceBundle);
            callbackContext.success();
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logSelectProduct(JSONObject product, String list_name, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                callbackContext.error("Required param ITEM_ID or ITEM_NAME is empty");
                return;
            } else {
                Bundle a = this.getProductBundle(product, 1, false);
                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putBundle("items", a);

                // Set relevant bundle-level parameters

                ecommerceBundle.putString(Param.ITEM_LIST, list_name); // List name
                // Log select_content event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.SELECT_CONTENT, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logProductDetailView(JSONObject product, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                callbackContext.error("Required param ITEM_ID or ITEM_NAME is empty");
                return;
            } else {
                // Prepare ecommerce bundle
                Bundle a = this.getProductBundle(product, -1, false);
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putBundle("items", a);

                // Log view_item event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.VIEW_ITEM, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logAddToCart(JSONObject product, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                callbackContext.error("Required param ITEM_ID or ITEM_NAME or QUANTITY is empty");
                return;
            } else {
                // pass index as 0 if we need to get quantity from params
                Bundle a = this.getProductBundle(product, 0, true);
                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putBundle("items", a);

                // Log add_to_cart event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.ADD_TO_CART, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logRemoveFromCart(JSONObject product, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                callbackContext.error("Required param ITEM_ID or ITEM_NAME or QUANTITY is empty");
                return;
            } else {
                // pass index as 0 if we need to get quantity from params
                Bundle a = this.getProductBundle(product, 0, true);
                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putBundle("items", a);

                // Log remove_from_cart event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.REMOVE_FROM_CART, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logPromotionView(JSONObject promotion, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (promotion.getString("ITEM_ID").isEmpty() || promotion.getString("ITEM_NAME").isEmpty()) {
                callbackContext.error("Required param ITEM_ID or ITEM_NAME is empty");
                return;
            } else {
                // pass index as 0 if we need to get quantity from params
                Bundle promotionBundle = new Bundle();
                promotionBundle.putString(Param.ITEM_ID, promotion.getString("ITEM_ID")); // promotion ID; either
                                                                                          // ITEM_ID or ITEM_NAME is
                                                                                          // required
                promotionBundle.putString(Param.ITEM_NAME, promotion.getString("ITEM_NAME")); // promotion name
                promotionBundle.putString(Param.CREATIVE_NAME, promotion.getString("CREATIVE_NAME"));
                promotionBundle.putString(Param.CREATIVE_SLOT, promotion.getString("CREATIVE_SLOT"));

                // Prepare ecommerce bundle

                ArrayList promotions = new ArrayList();
                promotions.add(promotionBundle);

                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putParcelableArrayList("promotions", promotions);

                // Log view_item, view_item_list, or view_search_results event with ecommerce
                // bundle
                this.firebaseAnalytics.logEvent(Event.VIEW_ITEM, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logSelectPromotion(JSONObject promotion, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (promotion.getString("ITEM_ID").isEmpty() || promotion.getString("ITEM_NAME").isEmpty()) {
                callbackContext.error("Required param ITEM_ID or ITEM_NAME is empty");
                return;
            } else {
                // pass index as 0 if we need to get quantity from params
                Bundle promotionBundle = new Bundle();
                promotionBundle.putString(Param.ITEM_ID, promotion.getString("ITEM_ID")); // promotion ID; either
                                                                                          // ITEM_ID or ITEM_NAME is
                                                                                          // required
                promotionBundle.putString(Param.ITEM_NAME, promotion.getString("ITEM_NAME")); // promotion name
                promotionBundle.putString(Param.CREATIVE_NAME, promotion.getString("CREATIVE_NAME"));
                promotionBundle.putString(Param.CREATIVE_SLOT, promotion.getString("CREATIVE_SLOT"));

                // Prepare ecommerce bundle

                ArrayList promotions = new ArrayList();
                promotions.add(promotionBundle);

                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putParcelableArrayList("promotions", promotions);

                // Set properties for the event to be shown in the Google Analytics (Firebase)
                // reports.
                // These properties will not impact the Universal Analytics reporting.
                ecommerceBundle.putString(Param.CONTENT_TYPE, "Internal Promotions");
                ecommerceBundle.putString(Param.ITEM_ID, promotion.getString("ITEM_ID"));

                // Log select_content, view_item_list, or view_search_results event with
                // ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.SELECT_CONTENT, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logBeginCheckout(JSONArray products, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle
            ArrayList items = new ArrayList();
            for (int i = 0, size = products.length(); i < size; i++) {
                JSONObject product = products.getJSONObject(i);
                if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                    callbackContext.error("Required param ITEM_ID or ITEM_NAME or QUANTITY is empty");
                    return;
                } else {
                    Bundle a = this.getProductBundle(product, i, true);
                    items.add(a);
                }
            }
            Bundle ecommerceBundle = new Bundle();
            ecommerceBundle.putParcelableArrayList("items", items);

            // Set checkout step and optional checkout option

            // ecommerceBundle.putLong( Param.CHECKOUT_STEP, 1 ); // Optional for first step
            // ecommerceBundle.putString( Param.CHECKOUT_OPTION, "Visa" ); // Optional

            /// Log BEGIN_CHECKOUT event with ecommerce bundle
            this.firebaseAnalytics.logEvent(Event.BEGIN_CHECKOUT, ecommerceBundle);
            callbackContext.success();
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logAdditionalCheckoutProcess(JSONArray products, JSONObject checkoutOptions,
            CallbackContext callbackContext) {

        try {
            // create a list of items(products) needs to be added to ecommerceBundle
            ArrayList items = new ArrayList();
            for (int i = 0, size = products.length(); i < size; i++) {
                JSONObject product = products.getJSONObject(i);
                if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                    callbackContext.error("Required param ITEM_ID or ITEM_NAME or QUANTITY is empty");
                    return;
                } else {
                    Bundle a = this.getProductBundle(product, i, true);
                    items.add(a);
                }
            }
            Bundle ecommerceBundle = new Bundle();
            ecommerceBundle.putParcelableArrayList("items", items);

            // Set checkout step and optional checkout option

            ecommerceBundle.putLong(Param.CHECKOUT_STEP, checkoutOptions.getInt("STEP"));
            ecommerceBundle.putString(Param.CHECKOUT_OPTION, checkoutOptions.getString("OPTION")); // Optional

            // Log CHECKOUT_PROGRESS event with ecommerce bundle
            this.firebaseAnalytics.logEvent(Event.CHECKOUT_PROGRESS, ecommerceBundle);
            callbackContext.success();
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }

    }

    private void logCheckoutOption(JSONObject checkoutOptions, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (checkoutOptions.getString("STEP").isEmpty() || checkoutOptions.getString("OPTION").isEmpty()) {
                callbackContext.error("Required param STEP or OPTION is empty");
                return;
            } else {
                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putLong(Param.CHECKOUT_STEP, checkoutOptions.getInt("STEP"));
                ecommerceBundle.putString(Param.CHECKOUT_OPTION, checkoutOptions.getString("OPTION")); // Optional

                // Log remove_from_cart event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.SET_CHECKOUT_OPTION, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logPurchases(JSONArray products, JSONObject transactionOptions, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle
            ArrayList items = new ArrayList();

            if (transactionOptions.getString("TRANSACTION_ID").isEmpty()
                    || transactionOptions.getString("AFFILIATION").isEmpty()
                    || transactionOptions.getString("CURRENCY").isEmpty()) {
                callbackContext.error("Required param TRANSACTION_ID or AFFILIATION or VALUE or CURRENCY is empty");
                return;
            }

            for (int i = 0, size = products.length(); i < size; i++) {
                JSONObject product = products.getJSONObject(i);
                if (product.getString("ITEM_ID").isEmpty() || product.getString("ITEM_NAME").isEmpty()) {
                    callbackContext.error("Required param ITEM_ID or ITEM_NAME or QUANTITY is empty");
                    return;
                } else {
                    Bundle a = this.getProductBundle(product, i, true);
                    items.add(a);
                }
            }
            Bundle ecommerceBundle = new Bundle();
            ecommerceBundle.putParcelableArrayList("items", items);

            // Set relevant transaction-level parameters

            ecommerceBundle.putString(Param.TRANSACTION_ID, transactionOptions.getString("TRANSACTION_ID"));
            ecommerceBundle.putString(Param.AFFILIATION, transactionOptions.getString("AFFILIATION"));
            ecommerceBundle.putDouble(Param.VALUE, transactionOptions.getDouble("VALUE")); // Revenue
            ecommerceBundle.putString(Param.CURRENCY, transactionOptions.getString("CURRENCY"));

            // if(!transactionOptions.isNull("TAX")) {
            // ecommerceBundle.putDouble(Param.TAX, transactionOptions.getDouble("TAX"));
            // }
            // if(!transactionOptions.isNull("SHIPPING")) {
            // ecommerceBundle.putDouble(Param.SHIPPING,
            // transactionOptions.getDouble("SHIPPING"));
            // }
            // if(!transactionOptions.isNull("COUPON")) {
            // ecommerceBundle.putString(Param.COUPON,
            // transactionOptions.getString("COUPON"));
            // }

            ecommerceBundle.putDouble(Param.TAX, transactionOptions.getDouble("TAX"));
            ecommerceBundle.putDouble(Param.SHIPPING, transactionOptions.getDouble("SHIPPING"));
            ecommerceBundle.putString(Param.COUPON, transactionOptions.getString("COUPON"));

            // Log ecommerce_purchase event with ecommerce bundle

            this.firebaseAnalytics.logEvent(Event.ECOMMERCE_PURCHASE, ecommerceBundle);
            callbackContext.success();
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logFullRefund(JSONObject refundData, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (refundData.getString("TRANSACTION_ID").isEmpty()) {
                callbackContext.error("Required param TRANSACTION_ID or VALUE is empty");
                return;
            } else {
                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putString(Param.TRANSACTION_ID, refundData.getString("TRANSACTION_ID"));
                ecommerceBundle.putDouble(Param.VALUE, refundData.getDouble("VALUE"));

                // Log purchase_refund event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.PURCHASE_REFUND, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void logPartialRefund(JSONObject refundData, CallbackContext callbackContext) {
        try {
            // create a list of items(products) needs to be added to ecommerceBundle

            if (refundData.getString("TRANSACTION_ID").isEmpty() || refundData.getString("ITEM_ID").isEmpty()) {
                callbackContext.error("Required param TRANSACTION_ID or ITEM_ID or VALUE or QUANTITY is empty");
                return;
            } else {
                // Prepare ecommerce bundle
                Bundle ecommerceBundle = new Bundle();
                ecommerceBundle.putString(Param.TRANSACTION_ID, refundData.getString("TRANSACTION_ID"));
                ecommerceBundle.putDouble(Param.VALUE, refundData.getDouble("VALUE"));

                // For partial refunds, define the item IDs and quantities of products being
                // refunded

                Bundle refundedProduct = new Bundle();
                refundedProduct.putString(Param.ITEM_ID, refundData.getString("ITEM_ID")); // Required for partial
                                                                                           // refund
                refundedProduct.putLong(Param.QUANTITY, refundData.getLong("QUANTITY")); // Required for partial refund

                ArrayList items = new ArrayList();
                items.add(refundedProduct);
                ecommerceBundle.putParcelableArrayList("items", items);

                // Log purchase_refund event with ecommerce bundle
                this.firebaseAnalytics.logEvent(Event.PURCHASE_REFUND, ecommerceBundle);
                callbackContext.success();
            }

        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private Bundle getProductBundle(JSONObject product, int index, boolean quantity) {
        Bundle a = new Bundle();
        try {
            a.putString(Param.ITEM_ID, product.getString("ITEM_ID"));
            a.putString(Param.ITEM_NAME, product.getString("ITEM_NAME"));
            if (!product.getString("ITEM_CATEGORY").isEmpty()) {
                a.putString(Param.ITEM_CATEGORY, product.getString("ITEM_CATEGORY"));
            }
            if (!product.getString("ITEM_BRAND").isEmpty()) {
                a.putString(Param.ITEM_BRAND, product.getString("ITEM_BRAND"));
            }
            // if (!product.isNull("PRICE")) {
            // a.putDouble(Param.PRICE, product.getDouble("PRICE"));
            // }
            a.putDouble(Param.PRICE, product.getDouble("PRICE"));

            if (!product.getString("CURRENCY").isEmpty()) {
                a.putString(Param.CURRENCY, product.getString("CURRENCY"));
            }
            // index = -1. its a product details page, no need for index or quantity
            if (index != -1) {
                if (!quantity) {
                    a.putLong(Param.INDEX, product.getLong("INDEX"));
                } else {
                    a.putLong(Param.QUANTITY, product.getLong("QUANTITY"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return a;
    }

}
