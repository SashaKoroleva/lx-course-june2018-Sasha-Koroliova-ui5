sap.ui.define([
    "sasha/koroliova/app/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            oRouter.getRoute("ProductDetails").attachPatternMatched(this._onPatternMatched, this);

            this.oAppViewModel = new JSONModel({
                productId: 0
            });
            this.getView().setModel(this.oAppViewModel, "appView");
        },
        /**
         * "ProductDetails" route pattern matched event handler.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @private
         */
        _onPatternMatched: function (oEvent) {
            var that = this;
            var mRouteArguments = oEvent.getParameter("arguments");
            var sProductID = mRouteArguments.productId;
            this.oAppViewModel.productId = sProductID;
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
         *
         * @public
         */
        onNavBack : function (oEvent){
            var oHistory, sPreviousHash, oRouter;

            if (this._oData && this._oData.fromTarget) {
                this.getRouter().getTargets().display(this._oData.fromTarget);
                delete this._oData.fromTarget;
                return;
            }

            BaseController.prototype.onNavBack.apply(this, arguments);
        },
        /**
         * Creates comment button press event handler.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @public
         */
        onCreateCommentPress: function (oEvent) {
            var oView = this.getView();
            var oODataModel = oView.getModel("odata");
            oODataModel.createEntry("/ProductComments", {
                properties: {
                    ID: parseInt((new Date).getTime() / 1000000),
                    productId: this.oAppViewModel.productId,
                    createdDate: new Date(),
                    comment: oEvent.getParameter("value"),
                    author: this.byId("author").getProperty("value")||"anonym",
                    rating: this.byId("rating").getProperty("value")
                }
            });
            oODataModel.submitChanges();

        }

    });
});
