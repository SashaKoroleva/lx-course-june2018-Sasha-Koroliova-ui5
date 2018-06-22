sap.ui.define([
    "sasha/koroliova/app/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit : function () {
            var oData = {
                ordersCount: 0
            };
            var oAppViewModel = new JSONModel(oData);
            this.getView().setModel(oAppViewModel,"appView");
            this.oAppViewModel = oAppViewModel;
        },
        /**
         * Go to order page.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         */
        onOpenOrderPagePress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext("odata");
            var oComponent = this.getOwnerComponent();
            oComponent.getRouter().navTo("OrderDetails", {
                    orderId: oCtx.getObject("id")
            });
        },
        /**
         * "View" after rendering lifecycle method. (wait until bindings are established)
         */
        onAfterRendering: function () {
            var oOrdersTable = this.byId("OrdersTable");
            var oItemsBinding = oOrdersTable.getBinding("items");
            oItemsBinding.attachDataReceived(function (oEvent) {
                var mData = oEvent.getParameter("data");
                this.oAppViewModel.setProperty("/ordersCount", mData.results.length);
            }, this);
        },
        /**
         * Formatter example for dates.
         *
         * @param {string} sDate formatter's input property
         *
         * @returns {string} formatted value.
         */
        dateFormatter: function (sDate) {
            return sDate.substr(0,10);
        }
    });
});
