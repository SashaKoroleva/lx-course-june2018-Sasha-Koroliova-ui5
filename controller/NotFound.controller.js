sap.ui.define([
    "sasha/koroliova/app/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.NotFound", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            var oRouter, oTarget;
            oRouter = this.getRouter();
            oTarget = oRouter.getTarget("notFound");
            oTarget.attachDisplay(function (oEvent) {
                this._oData = oEvent.getParameter("data");
            }, this);
        },
        /**
         * Returns to the previous page.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @public
         */
        onNavBack: function (oEvent) {
            var oHistory, sPreviousHash, oRouter;

            if (this._oData && this._oData.fromTarget) {
                this.getRouter().getTargets().display(this._oData.fromTarget);
                delete this._oData.fromTarget;
                return;
            }

            BaseController.prototype.onNavBack.apply(this, arguments);
        }
    });

});
