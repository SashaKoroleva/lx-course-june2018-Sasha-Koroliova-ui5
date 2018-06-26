sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("sasha.koroliova.app.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         *
         * @returns {sap.ui.core.routing.Router} the router for this component
         *
         * @public
         */
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        /**
         * Convenience method for returning back.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         *  @public
         */
        onNavBack: function (oEvent) {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("appHome", {}, true);
            }
        },
        /**
         * Clears inputs in the dialog
         *
         * @param {object[]} aInputs array of inputs
         *
         * @public
         */
        clearDialog: function (aInputs) {
            aInputs.forEach(function (oInput) {
                oInput.setValue("");
            })
        },
        /**
         * Verifies inputs in the dialog
         *
         * @param {object[]} aInputs array of inputs
         *
         * @returns {boolean} bValidationError takes true value if there is an error, false if not.
         *
         * @public
         */
        validateDialog: function (aInputs) {
            var bValidationError = false;
            aInputs.forEach(function (oInput) {
                if(oInput.getValue() === ""){
                    bValidationError = true;
                }
                if(oInput.getValueState() === "Error"){
                    bValidationError = true;
                }
            });

            return bValidationError;
        },
        /**
         * Formatter example for dates.
         *
         * @param {string} sDate formatter's input property
         *
         * @returns {string} formatted value.
         *
         * @public
         */
        dateFormatter: function (sDate) {
            return new Date().getDate(sDate)+"." + (new Date().getMonth()+1)+"."+ new Date().getFullYear();
        }
    });
});
