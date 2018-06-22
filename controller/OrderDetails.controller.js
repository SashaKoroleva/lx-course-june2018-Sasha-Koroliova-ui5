sap.ui.define([
    "sasha/koroliova/app/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            oRouter.getRoute("OrderDetails").attachPatternMatched(this.onPatternMatched, this);
        },
        /**
         * "OrderDetails" route pattern matched event handler.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         */
        onPatternMatched: function (oEvent) {
            var that = this;
            var mRouteArguments = oEvent.getParameter("arguments");
            var sOrderID = mRouteArguments.orderId;
            var oODataModel = this.getView().getModel("odata");

            oODataModel.metadataLoaded().then(function () {
                var sKey = oODataModel.createKey("/Orders", {id: sOrderID});
                that.getView().bindObject({
                    path: sKey,
                    model: "odata"
                });
            });
        },
        /**
         * Go to orders overview page.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         */
        onNavBack: function () {
            this.getRouter().navTo("OrdersOverview");
        },
        /**
         * Go to product page.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         */
        onOpenProductPagePress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext("odata");
            var oComponent = this.getOwnerComponent();
            oComponent.getRouter().navTo("ProductDetails", {
                productId: oCtx.getObject("id")
            });
        },
        /**
         * Formatter example for dates.
         *
         * @param {string} sDate formatter's input property
         *
         * @returns {string} formatted value.
         */
        dateFormatter: function (sDate) {
            if(sDate == null){
                return;
            }
            return sDate.substr(0,10);
        }
    });
});
