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

            var oResourceModel = new sap.ui.model.resource.ResourceModel({
                bundleName: "sasha.koroliova.app.i18n.i18n"
            });
            this.setModel(oResourceModel, "i18n");

            this.getRouter().initialize();
        }
    });
});