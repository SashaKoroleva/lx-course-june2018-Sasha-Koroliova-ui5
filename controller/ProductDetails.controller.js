sap.ui.define([
    "sasha/koroliova/app/controller/BaseController",
    "sap/ui/core/routing/History"
], function (BaseController,History) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            oRouter.getRoute("ProductDetails").attachPatternMatched(this.onPatternMatched, this);
        },
        /**
         * "ProductDetails" route pattern matched event handler.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         */
        onPatternMatched: function (oEvent) {
            var that = this;
            var mRouteArguments = oEvent.getParameter("arguments");
            var sProductID = mRouteArguments.productId;
            var oODataModel = this.getView().getModel("odata");

            oODataModel.metadataLoaded().then(function () {
                var sKey = oODataModel.createKey("/OrderProducts", {id: sProductID});
                that.getView().bindObject({
                    path: sKey,
                    model: "odata"
                });
            });
        },
        /**
         * Go to order page.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         */
        onNavBack: function (oEvent) {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("OrdersOverview", {}, true);
            }
        }
    });
});
