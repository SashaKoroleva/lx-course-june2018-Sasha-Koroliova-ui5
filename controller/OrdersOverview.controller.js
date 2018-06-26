sap.ui.define([
    "sasha/koroliova/app/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, Filter, FilterOperator,MessageToast,MessageBox) {
    "use strict";

    return BaseController.extend("sasha.koroliova.app.controller.OrdersOverview", {

        /**
         * Controller's "init" lifecycle method.
         */
        onInit : function () {
            sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
            this.oAppViewModel = new JSONModel({
                ordersCount: 0,
                pendingOrdersCount: 0,
                acceptedOrdersCount: 0
            });
            this.getView().setModel(this.oAppViewModel,"appView");
        },
        /**
         * "View" after rendering lifecycle method. (wait until bindings are established)
         *
         * @private
         */
        onAfterRendering: function () {
            var oItemsBinding =  this.byId("OrdersTable").getBinding("items"),
                sPendingKey = "pending",
                sAcceptedKey = "accepted",
                oPendingFilter = new Filter("summary/status", FilterOperator.EQ, "\'" + sPendingKey + "\'"),
                oAcceptedFilter = new Filter("summary/status", FilterOperator.EQ, "\'" + sAcceptedKey + "\'"),
                oViewModel = this.getView().getModel("appView"),
                oODataModel = this.getView().getModel("odata");

            oItemsBinding.attachDataReceived(function (oEvent) {
                oODataModel.read("/Orders/$count", {
                    success: function (oData) {
                        oViewModel.setProperty("/ordersCount", oData);
                    }
                });
                oODataModel.read("/Orders/$count", {
                    filters: [oPendingFilter],
                    success: function (oData) {
                        oViewModel.setProperty("/pendingOrdersCount", oData);
                    }
                });
                oODataModel.read("/Orders/$count", {
                    filters: [oAcceptedFilter],
                    success: function (oData) {
                        oViewModel.setProperty("/acceptedOrdersCount", oData);
                    }
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
        onOpenOrderPagePress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext("odata");
            var oComponent = this.getOwnerComponent();
            oComponent.getRouter().navTo("OrderDetails", {
                orderId: oCtx.getObject("id")
            });
        },
        /**
         * "Open order cration dialog" button press event handler.
         *
         * @public
         */
        onCreateOrderPress: function () {
            var oView = this.getView();
            var oODataModel = oView.getModel("odata");
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment(oView.getId(), "sasha.koroliova.app.view.fragments.OrderDialog", this);
                oView.addDependent(this.oDialog);
            }
            var oEntryCtx = oODataModel.createEntry("/Orders", {
                properties: {
                    ID: parseInt((new Date).getTime() / 1000000),
                    summary: {
                        createdAt: Date.now().toLocaleString(),
                        shippedAt: Date.now().toLocaleString(),
                        status: "pending",
                        totalPrice: 0
                    }
                }
            });
            this.oDialog.setBindingContext(oEntryCtx);
            this.oDialog.setModel(oODataModel);
            this.oDialog.open();
        },
        /**
         * "Cancel" button press event handler (in the order creation dialog).
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
         * Order creation dialog "Create" button press event handler.
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
         * Verifies inputs in the dialog.
         *
         * @returns {boolean} takes true value if there is an error, false if not.
         *
         * @private
         */
        _validateDialog: function () {
            var aInputs = [
                this.byId("customerInput"),
                this.byId("phoneInput"),
                this.byId("regionInput"),
                this.byId("countryInput"),
                this.byId("addressInput"),
                this.byId("currencyInput")
            ];
            return BaseController.prototype.validateDialog.call(this, aInputs);
        },
        /**
         * Clears inputs in the dialog.
         *
         * @private
         */
        _clearDialog: function () {
            var aInputs = [
                this.byId("customerInput"),
                this.byId("phoneInput"),
                this.byId("regionInput"),
                this.byId("countryInput"),
                this.byId("addressInput"),
                this.byId("currencyInput")
            ];

            BaseController.prototype.clearDialog.call(this, aInputs);
        },
        /**
         * Does the filter request based on the selected tab.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @public
         */
        handleIconTabBarSelect: function (oEvent) {
            var oItemsBinding = this.byId("OrdersTable").getBinding("items"),
                sKey = oEvent.getParameter("key"),
                sPendingKey = "pending",
                sAcceptedKey = "accepted",
                oFilter;

            if (sKey === sPendingKey) {
                oFilter = new Filter("summary/status", FilterOperator.EQ,"\'" + sPendingKey + "\'");
                oItemsBinding.filter(oFilter);
            } else if (sKey === sAcceptedKey ) {
                oFilter = new Filter("summary/status", FilterOperator.EQ,"\'" + sAcceptedKey + "\'");
                oItemsBinding.filter(oFilter);
            } else {
                oItemsBinding.filter([]);

            }
        },
        /**
         * Deletes an order.
         *
         * @param {sap.ui.base.Event} oEvent event object.
         *
         * @public
         */
        onDeleteOrderPress: function (oEvent) {

            var oCtx = oEvent.getParameter("listItem").getBindingContext("odata");
            var oODataModel = oCtx.getModel();
            var sKey = oODataModel.createKey("/Orders", oCtx.getObject());
            var oResourceModel = this.getView().getModel("i18n");

            oODataModel.remove(sKey, {
                success: function () {
                    MessageToast.show(oResourceModel.getResourceBundle().getText("SuccessfulDeletionOfOrder"),{width: "20em"});
                },
                error: function () {
                    MessageBox.error(oResourceModel.getResourceBundle().getText("UnsuccessfulDeletionOfOrder"),{width: "20em"});
                }
            });
        },

    });
});
