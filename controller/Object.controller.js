var rowValues;
var newJsonItems;
var status;
sap.ui.define([
	"com/olam/prof/del/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/olam/prof/del/model/formatter",
	"sap/m/Dialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Dialog, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("com.olam.prof.del.controller.Object", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			this._router = sap.ui.core.UIComponent.getRouterFor(this);
			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
		},
		defaultSetting: function() {},
		onRouteMatched: function(oEvent) {
			var self = this;
			this.Path = oEvent.getParameter("arguments").line_no;
			status = oEvent.getParameter("arguments").values;
			debugger;
			this.values = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results[this.Path];
			
			self.getView().byId("objectViewPONoId").setText(this.getView().getModel("tablejson").getData().results[0].ImDocno);
			self.getView().byId("objectViewVendorNoId").setText(this.getView().getModel("tablejson").getData().results[0].F4HeaderNav.results[0].Name1);
			
			if (status === "Edit") {
				self.getView().byId("FixationNumber").setValue(this.values.Fxnum.trim());
				self.getView().byId("Terminal").setValue(this.values.Trper.trim());
				self.getView().byId("Fix.Date").setValue(this.values.Fxdat.trim());
				self.getView().byId("Fix.Lot").setValue(this.values.Fxqty);
				self.getView().byId("Fix.Price").setValue(this.values.Fxprc.trim());
				self.getView().byId("FixCur").setValue(this.values.Fcrum.trim());
				self.getView().byId("Broker").setValue(this.values.Lifnr.trim());
				self.getView().byId("BrokerName").setValue(this.values.Lname.trim());
				self.getView().byId("Buyer").setValue(this.values.Byslr.trim());
				self.getView().byId("Label10").setValue(this.values.Zmeng.trim());
				self.getView().byId("FixQty").setValue(this.values.Zieme.trim());
				self.getView().byId("DiffBas").setValue(this.values.Dfbas.trim());
				self.getView().byId("netPriceId").setValue(this.values.Ntprc.trim());
			} else {
				self.getView().byId("FixationNumber").setValue("0" + this.Path);
				self.getView().byId("Terminal").setValue("");
				self.getView().byId("Fix.Date").setValue("");
				self.getView().byId("Fix.Lot").setValue("");
				self.getView().byId("Fix.Price").setValue("");
				self.getView().byId("netPriceId").setValue("");
				self.getView().byId("FixCur").setValue("");
				self.getView().byId("Broker").setValue("");
				self.getView().byId("BrokerName").setValue("");
				self.getView().byId("Buyer").setValue("");
				self.getView().byId("Buyer").setDescription("");
				self.getView().byId("Label10").setValue("");
				self.getView().byId("FixQty").setValue("");
				self.getView().byId("DiffBas").setValue("");
			}

		},
		back: function() {
			this.getModel("table2Model").setData({
							results: []
						});
						// _self._Empty();
						window.history.go(-1);
		/*
			var _self = this;
			var dialog = new Dialog({
				title: 'Unsaved Changes',
				type: 'Message',
				content: new sap.m.Text({
					text: 'Any unsaved data will be discarded. Are you sure you want to proceed?'
				}),
				beginButton: new sap.m.Button({
					text: 'Ok',
					type: "Accept",
					press: function(e) {
						_self.getModel("table2Model").setData({
							results: []
						});
						// _self._Empty();
						window.history.go(-1);
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					type: "Reject",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();

		*/},
		onbuyerf4: function(oEvent) {
			this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "zpocreate.frag.buyer", this);
			this.getView().addDependent(this.oDialog);
			var filters = [
				new Filter("ImByslr", FilterOperator.EQ, "X")
			];
			this.getModel().read("/F4Set", {
				filters: filters,
				urlParameters: {
					$expand: "F4BySlrNav"
				},
				success: function(data, response) {
					var buyerJson = new JSONModel();
					buyerJson.setData(data);
					this.oDialog.setModel(buyerJson, "buyerJson");
				}.bind(this),
				error: function(response) {

				}
			});
			this.oDialog.open();

		},
		handleshippartyclose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var buyerip = this.getView().byId("Buyer"),
					oText = buyerip;
				oText.setValue(oSelectedItem.getBindingContext("buyerJson").getProperty("Valpos"));
				oText.setDescription(oSelectedItem.getBindingContext("buyerJson").getProperty("Ddtext"));
			}

		},
		BuyserSearch: function(e) {
			var sValue = e.getParameter("value");
			var oFilter = new Filter("Valpos", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter1 = new Filter("Ddtext", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1], false);
			var oBinding = e.getSource().getBinding("items");
			oBinding.filter([oFilter2]);
		},
		/*saveChanges: function(e) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "YYYY-MM-dd"
					});
					var FixationNumber = this.getView().byId("FixationNumber").getValue();
					var Terminal = this.getView().byId("Terminal").getValue();
					var FixDate1 = this.getView().byId("Fix.Date").getDateValue();
					var FixDate2 = oDateFormat.format(new Date(FixDate1));
					var FixDate = FixDate2.split("-")[0] + FixDate2.split("-")[1] + FixDate2.split("-")[2];
					var FixLot = this.getView().byId("Fix.Lot").getValue();
					var FixPrice = this.getView().byId("Fix.Price").getValue();
					var FixCur = this.getView().byId("FixCur").getValue();
					var Broker = this.getView().byId("Broker").getValue();
					var BrokerName = this.getView().byId("BrokerName").getValue();
					var Buyer = this.getView().byId("Buyer").getValue();
					var Zmeng = this.getView().byId("Label10").getValue();
					var FixQty = this.getView().byId("FixQty").getValue();
					var DiffBas = this.getView().byId("DiffBas").getValue();
					var NetPrice = this.getView().byId("netPriceId").getValue();
					if (status === "Add") {
						var addData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;
						var addObj = {
							Selec: "",
							Exchg: "CSEC",
							Byslr: Buyer,
							Dfbas: DiffBas,
							Fxdat: FixDate,
							Fxnum: FixationNumber,
							Fxprc: FixPrice,
							Fxqty: FixLot,
							Lifnr: Broker,
							Fcrum: FixCur,
							Lname: BrokerName,
							Trper: Terminal,
							Zieme: FixQty,
							Zmeng: Zmeng,
							Avgec: NetPrice,
							Ntprc: NetPrice,
							Ntval: "5059602.90",
							Avgvl: "297623.70",
							Avgut: "MT",
							Avget: "LB",
							Waers: "",
							Fixed: "",
							Invcd: "X",
							Rollo: "",
							Openq: "",
							Apprv: "",
							Wkurs: ""
						};
						
						addData.push(addObj);
					} else {
						this.values.Byslr = Buyer;
						this.values.Dfbas = DiffBas;
						this.values.Fxdat = FixDate;
						this.values.Fxnum = FixationNumber;
						this.values.Fxprc = FixPrice;
						this.values.Fxqty = FixLot;
						this.values.Lifnr = Broker;
						this.values.Fcrum = FixCur;
						this.values.Lname = BrokerName;
						this.values.Trper = Terminal;
						this.values.Zieme = FixQty;
						this.values.Zmeng = Zmeng;
						this.values.Avgec = NetPrice;

					}
					this.getRouter().navTo("worklist");

					this.getView().getModel("tablejson").refresh(true);

				

					//}
				}*/
		// saveChanges: function(e) {
		// 			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
		// 				pattern: "YYYY-MM-dd"
		// 			});
		// 			var FixationNumber = this.getView().byId("FixationNumber").getValue();
		// 			var Terminal = this.getView().byId("Terminal").getValue();
		// 			var FixDate1 = this.getView().byId("Fix.Date").getDateValue();
		// 			var FixDate2 = oDateFormat.format(new Date(FixDate1));
		// 			var FixDate = FixDate2.split("-")[0] + FixDate2.split("-")[1] + FixDate2.split("-")[2];
		// 			var FixLot = this.getView().byId("Fix.Lot").getValue();
		// 			var FixPrice = this.getView().byId("Fix.Price").getValue();
		// 			var FixCur = this.getView().byId("FixCur").getValue();
		// 			var Broker = this.getView().byId("Broker").getValue();
		// 			var BrokerName = this.getView().byId("BrokerName").getValue();
		// 			var Buyer = this.getView().byId("Buyer").getValue();
		// 			var Zmeng = this.getView().byId("Label10").getValue();
		// 			var FixQty = this.getView().byId("FixQty").getValue();
		// 			var DiffBas = this.getView().byId("DiffBas").getValue();
		// 			var NetPrice = this.getView().byId("netPriceId").getValue();
		// 			if (status === "Add") {
		// 				var addData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;
		// 				var addObj = {
		// 					Selec: "",
		// 					Exchg: "CSEC",
		// 					Byslr: Buyer,
		// 					Dfbas: DiffBas,
		// 					Fxdat: FixDate,
		// 					Fxnum: FixationNumber,
		// 					Fxprc: FixPrice,
		// 					Fxqty: FixLot,
		// 					Lifnr: Broker,
		// 					Fcrum: FixCur,
		// 					Lname: BrokerName,
		// 					Trper: Terminal,
		// 					Zieme: FixQty,
		// 					Zmeng: Zmeng,
		// 					Avgec: NetPrice,
		// 					Ntprc: NetPrice,
		// 					Ntval: "5059602.90",
		// 					Avgvl: "297623.70",
		// 					Avgut: "MT",
		// 					Avget: "LB",
		// 					Waers: "",
		// 					Fixed: "",
		// 					Invcd: "X",
		// 					Rollo: "",
		// 					Openq: "",
		// 					Apprv: "",
		// 					Wkurs: ""
		// 				};

		// 				addData.push(addObj);
		// 			} else {
		// 				this.values.Byslr = Buyer;
		// 				this.values.Dfbas = DiffBas;
		// 				this.values.Fxdat = FixDate;
		// 				this.values.Fxnum = FixationNumber;
		// 				this.values.Fxprc = FixPrice;
		// 				this.values.Fxqty = FixLot;
		// 				this.values.Lifnr = Broker;
		// 				this.values.Fcrum = FixCur;
		// 				this.values.Lname = BrokerName;
		// 				this.values.Trper = Terminal;
		// 				this.values.Zieme = FixQty;
		// 				this.values.Zmeng = Zmeng;
		// 				this.values.Avgec = NetPrice;

		// 			}
		// 			this.getRouter().navTo("worklist");

		// 			this.getView().getModel("tablejson").refresh(true);

		// 			//}
		// 		}
		/*saveChanges: function(e) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "YYYY-MM-dd"
			});
			var FixationNumber = this.getView().byId("FixationNumber").getValue();
			var Terminal = this.getView().byId("Terminal").getValue();
			var FixDate1 = this.getView().byId("Fix.Date").getDateValue();
			var FixDate2 = oDateFormat.format(new Date(FixDate1));
			var FixDate = FixDate2.split("-")[0] + FixDate2.split("-")[1] + FixDate2.split("-")[2];
			var FixLot = this.getView().byId("Fix.Lot").getValue();
			var FixPrice = this.getView().byId("Fix.Price").getValue();
			var FixCur = this.getView().byId("FixCur").getValue();
			var Broker = this.getView().byId("Broker").getValue();
			var BrokerName = this.getView().byId("BrokerName").getValue();
			var Buyer = this.getView().byId("Buyer").getValue();
			var Zmeng = this.getView().byId("Label10").getValue();
			var FixQty = this.getView().byId("FixQty").getValue();
			var DiffBas = this.getView().byId("DiffBas").getValue();
			var NetPrice = this.getView().byId("netPriceId").getValue();
			if (status === "Add") {
				var addData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;
				var addObj = {
					Selec: "",
					Exchg: "CSEC",
					Byslr: Buyer,
					Dfbas: DiffBas,
					Fxdat: FixDate,
					Fxnum: FixationNumber,
					Fxprc: FixPrice,
					Fxqty: FixLot,
					Lifnr: Broker,
					Fcrum: FixCur,
					Lname: BrokerName,
					Trper: Terminal,
					Zieme: FixQty,
					Zmeng: Zmeng,
					Avgec: NetPrice,
					Ntprc: NetPrice,
					Ntval: "5059602.90",
					Avgvl: "297623.70",
					Avgut: "MT",
					Avget: "LB",
					Waers: "",
					Fixed: "",
					Invcd: "X",
					Rollo: "",
					Openq: "",
					Apprv: "",
					Wkurs: ""
				};
				
				addData.push(addObj);
			} else {
				this.values.Byslr = Buyer;
				this.values.Dfbas = DiffBas;
				this.values.Fxdat = FixDate;
				this.values.Fxnum = FixationNumber;
				this.values.Fxprc = FixPrice;
				this.values.Fxqty = FixLot;
				this.values.Lifnr = Broker;
				this.values.Fcrum = FixCur;
				this.values.Lname = BrokerName;
				this.values.Trper = Terminal;
				this.values.Zieme = FixQty;
				this.values.Zmeng = Zmeng;
				this.values.Avgec = NetPrice;

			}
			this.getRouter().navTo("worklist");

			this.getView().getModel("tablejson").refresh(true);

		

			//}
		}*/
		saveChanges: function() {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "YYYY-MM-dd"
			});

			var FixationNumber = this.getView().byId("FixationNumber").getValue();
			var Terminal = this.getView().byId("Terminal").getValue();
			var FixDate1 = this.getView().byId("Fix.Date").getDateValue();

			var FixDate2 = oDateFormat.format(new Date(FixDate1));

			var FixDate = FixDate2.split("-")[0] + FixDate2.split("-")[1] + FixDate2.split("-")[2];

			var FixLot = parseInt(this.getView().byId("Fix.Lot").getValue());
			var FixPrice = this.getView().byId("Fix.Price").getValue();
			var FixCur = this.getView().byId("FixCur").getValue();
			var Broker = this.getView().byId("Broker").getValue();
			var BrokerName = this.getView().byId("BrokerName").getValue();
			var Buyer = this.getView().byId("Buyer").getValue();
			var Zmeng = this.getView().byId("Label10").getValue();
			var FixQty = this.getView().byId("FixQty").getValue();
			var DiffBas = this.getView().byId("DiffBas").getValue();
			var NetPrice = this.getView().byId("netPriceId").getValue();

			var initialLot = this.getView().getModel("tablejson").getData().results[0].F4HeaderNav.results[0].Zzlotno;
			var count = 0;

			var aData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;
			/*for (var d = 0; d < aData.length; d++) {
				count = count + parseInt(aData[d].Fxqty);

			}

			var fixLots = FixLot + count; 
			var msg = "Number of Lots should be less than " + initialLot;

			if (initialLot < fixLots) {
				sap.m.MessageBox.alert(msg, {
					title: 'Alert'
				});
			} else {*/

				if (status === "Add") {

					var addData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;

					var addObj = {
						Selec: "",
						Exchg: "CSEC",
						Byslr: Buyer,
						Dfbas: DiffBas,
						Fxdat: FixDate,
						Fxnum: FixationNumber,
						Fxprc: FixPrice,
						Fxqty: FixLot,
						Lifnr: Broker,
						Fcrum: FixCur,
						Lname: BrokerName,
						Trper: Terminal,
						Zieme: FixQty,
						Zmeng: Zmeng,
						Avgec: NetPrice,
						Ntprc: NetPrice,
						Ntval: "5059602.90",
						Avgvl: "297623.70",
						Avgut: "MT",
						Avget: "LB",
						Waers: "",
						Fixed: "",
						Invcd: "X",
						Rollo: "",
						Openq: "",
						Apprv: "",
						Wkurs: ""
					};

					addData.push(addObj);
				}
				else if (status === "Edit") {
					this.values.Byslr = Buyer;
					this.values.Dfbas = DiffBas;
					this.values.Fxdat = FixDate;
					this.values.Fxnum = FixationNumber;
					this.values.Fxprc = FixPrice;
					this.values.Fxqty = FixLot;
					this.values.Lifnr = Broker;
					this.values.Fcrum = FixCur;
					this.values.Lname = BrokerName;
					this.values.Trper = Terminal;
					this.values.Zieme = FixQty;
					this.values.Zmeng = Zmeng;
					this.values.Avgec = NetPrice;
				}

				this.getView().getModel("tablejson").refresh(true);
				this.getRouter().navTo("worklist");
			//}
		}

	});

});