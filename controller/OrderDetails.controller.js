sap.ui.define([
    "sasha/koroliova/app/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {

        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
            this.oAppViewModel = new JSONModel({
                editShipInfo: false,
                editClientInfo: false,
                orderId: 0
            });
            this.getView().setModel(this.oAppViewModel, "appView");

            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            oRouter.getRoute("OrderDetails").attachPatternMatched(this._onPatternMatched, this);
        },
        /**
         * "OrderDetails" route pattern matched event handler.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @private
         */
        _onPatternMatched: function (oEvent) {
            var that = this;
            var mRouteArguments = oEvent.getParameter("arguments");
            var sOrderID = mRouteArguments.orderId;
            this.oAppViewModel.orderId = sOrderID;
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
         * @public
         */
        onNavBack: function () {
            this.getRouter().navTo("OrdersOverview");
        },
        /**
         * Go to product page.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @public
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
         * "Open product creation dialog" button press event handler.
         *
         * @public
         */
        onCreateProductPress: function () {
            var oView = this.getView();
            var oODataModel = oView.getModel("odata");
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment(oView.getId(), "sasha.koroliova.app.view.fragments.ProductDialog", this);
                oView.addDependent(this.oDialog);
            }
            var oEntryCtx = oODataModel.createEntry("/OrderProducts", {
                properties: {
                    ID: parseInt((new Date).getTime() / 1000000),
                    orderId: this.oAppViewModel.orderId
                }
            });
            this.oDialog.setBindingContext(oEntryCtx);
            this.oDialog.setModel(oODataModel);
            this.oDialog.open();
        },
        /**
         * Product creation dialog "Create" button press event handler.
         *
         * @public
         */
        onDialogCreatePress: function () {
            if (!this._validateDialog()) {
                var oODataModel = this.getView().getModel("odata");
                oODataModel.submitChanges();
                this.oDialog.close();
            } else {
                var oResourceModel = this.getView().getModel("i18n");
                MessageBox.error(oResourceModel.getResourceBundle().getText("WarningAfterValidation"));
            }
        },
        /**
         * "Cancel" button press event handler (in the product creation dialog).
         *
         * @public
         */
        onDialogCancelPress: function () {
            var oODataModel = this.getView().getModel("odata");
            var oCtx = this.oDialog.getBindingContext("odata");
            oODataModel.deleteCreatedEntry(oCtx);
            this.oDialog.close();
            this._clearDialog();
        },
        /**
         * Verifies inputs in the dialog
         *
         * @returns {boolean} takes true value if there is an error, false if not.
         *
         * @private
         */
        _validateDialog: function () {
            var aInputs = [
                this.byId("nameInput"),
                this.byId("priceInput"),
                this.byId("qtyInput"),
                this.byId("totalPriceInput"),
                this.byId("currencyInput")
            ];
            return BaseController.prototype.validateDialog.call(this, aInputs);
        },
        /**
         * Clears inputs in the dialog
         *
         * @private
         */
        _clearDialog: function () {
            var aInputs = [
                this.byId("nameInput"),
                this.byId("priceInput"),
                this.byId("qtyInput"),
                this.byId("totalPriceInput"),
                this.byId("currencyInput")
            ];
            BaseController.prototype.clearDialog.call(this, aInputs);
        },
        /**
         * Edit button press event handler.
         *
         * @public
         */
        onEditClientInfoPress: function () {
            this.oAppViewModel.setProperty("/editClientInfo", true);
        },
        /**
         * Edit button press event handler.
         *
         * @public
         */
        onEditShipInfoPress: function () {
            this.oAppViewModel.setProperty("/editShipInfo", true);
        },
        /**
         * Save button press event handler.
         *
         * @public
         */
        onSaveInfoPress: function () {
            this.oAppViewModel.setProperty("/editClientInfo", false);
            this.oAppViewModel.setProperty("/editShipInfo", false);
            var oODataModel = this.getView().getModel("odata");
            oODataModel.submitChanges();
        },
        /**
         * Cancel button press event handler.
         *
         * @public
         */
        onCancelChangesPress: function () {
            this.oAppViewModel.setProperty("/editClientInfo", false);
            this.oAppViewModel.setProperty("/editShipInfo", false);
            var oODataModel = this.getView().getModel("odata");
            oODataModel.resetChanges();
        },
        /**
         * Deletes a product.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @public
         */
        onDeleteProductPress: function (oEvent) {
            var oCtx = oEvent.getParameter("listItem").getBindingContext("odata");
            var oODataModel = oCtx.getModel();
            var sKey = oODataModel.createKey("/OrderProducts", oCtx.getObject());
            var oResourceModel = this.getView().getModel("i18n");
            oODataModel.remove(sKey, {
                success: function () {

                    MessageToast.show(oResourceModel.getResourceBundle().getText("SuccessfulDeletionOfProduct"), {width: "20em"});
                },
                error: function () {
                    MessageBox.error(oResourceModel.getResourceBundle().getText("UnsuccessfulDeletionOfProduct"), {width: "20em"});
                }
            });
        }

    });
});
