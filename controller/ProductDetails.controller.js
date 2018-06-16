sap.ui.define([
    "sasha/koroliova/app/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        onNavBack: function () {
            this.getRouter().navTo("OrderDetails");
        }
    });
});
