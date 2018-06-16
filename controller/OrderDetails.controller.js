sap.ui.define([
    "sasha/koroliova/app/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        onNavToProduct: function () {
            this.getRouter().navTo("ProductDetails");
        },
        onNavBack: function () {
            this.getRouter().navTo("OrdersOverview");
        }
    });
});
