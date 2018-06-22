sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sasha.koroliova.app.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            var oODataModel = new sap.ui.model.odata.v2.ODataModel("http://localhost:3000/odata/", {
                useBatch: false,
                defaultBindingMode: "TwoWay"
            });
            this.setModel(oODataModel, "odata");

            this.getRouter().initialize();
        }
    });
});