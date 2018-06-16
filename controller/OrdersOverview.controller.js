sap.ui.define([
    "sasha/koroliova/app/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        onNavToOrder: function () {
            this.getRouter().navTo("OrderDetails");
        }
    });
});
