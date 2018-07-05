var g_item;
var edit;
var rowValues;
var navData;
var View1tabledata;
var PlantValue;
var PressAdd;
var CompanyCode;
var newArray;
var Ekgrp;
var doctype;
var Lifnr;
var Process;
var oModel;
var rolloverData;
var selectedObject;
var BulbFrag;
var busyDialog;
var PODOCoDialog, reason, PODOCoDialog1;
sap.ui.define([
		"com/olam/prof/del/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"com/olam/prof/del/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/MessageToast",
		"sap/m/BusyIndicator",
		"sap/m/Dialog"
	], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageToast, BusyIndicator, Dialog)

	{
		"use strict";
		return BaseController.extend("com.olam.prof.del.controller.Worklist", {

			formatter: formatter,
			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */
			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit: function() {
				busyDialog = new sap.m.BusyDialog({
					text: '...please wait while the data is loading'
				});

				// BulbFrag = sap.ui.xmlfragment("com/olam/prof/del/frag/Bulb", this);
				this.getOwnerComponent().getModel().metadataLoaded().then(this.staticServiceCalls.bind(this));

			},


			// PO Document Number
			staticServiceCalls: function() {

				var self = this;

				/*	if (!this.BulbFrag) {
					this.BulbFrag = sap.ui.xmlfragment("com.olam.prof.del.frag.RollOver", this);
					this.getView().addDependent(this.BulbFrag);
				}*/
				busyDialog.open();
				var filters = [
					new Filter("Delivery", FilterOperator.EQ, "X")
				];
				this.getOwnerComponent().getModel().read("/F4Set", {
					filters: filters,
					urlParameters: {
						$expand: "F4DeliveryNav,F4ReturnNav"
					},
					success: function(data, response) {
						// debugger;

						busyDialog.close();
						var POJson = new JSONModel();
						POJson.setData(data);

						/*	if (!self.BulbFrag) {
					self.BulbFrag = sap.ui.xmlfragment("com.olam.prof.del.frag.RollOver", self);
					self.getView().addDependent(self.BulbFrag);
				}*/

						PODOCoDialog = sap.ui.xmlfragment(self.getView().getId(), "com.olam.prof.del.frag.PODoc", this);
						self.getView().addDependent(PODOCoDialog);
						self.getView().getDependents()[0]._dialog.setModel(POJson, "POJson");
						PODOCoDialog.open();
					}.bind(this),
					error: function(response) {
						busyDialog.close();
					}
				});

			},
			_handlePODOCValueHelpClose: function(e) {
				var self = this;
				var oSelectedItem = e.getParameter("selectedItem");
				if (oSelectedItem) {
					var PODOC = self.getView().byId("InvoicedQuantity1"),
						oText = PODOC,
						sTitle = oSelectedItem.getTitle();
					// var Desc = oSelectedItem.getDescription();
					// var PODEC = self.getView().byId("PODOCDESC");
					oText.setValue(sTitle);
					// PODEC.setValue(Desc);
					PODOCoDialog._dialog.close();
					self._HeaderItem();
					// self.onRollover();
					// self.ItemServiceCall();
				}
			},

			onPurchaseDocF4: function(e) {
				PODOCoDialog.open();
			},
			purchDOCSearch: function(e) {
				var sValue = e.getParameter("value");
				var oFilter = new Filter("Vbeln", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter1 = new Filter("Vstel", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1], false);
				var oBinding = e.getSource().getBinding("items");
				oBinding.filter([oFilter2]);
			},

			// var filter1 = [
			// 	new Filter("Reason",FilterOperator.EQ,"X")
			// 	];
			// 		this.getOwnerComponent().getModel().read("/F4Set", {
			// 	filters: filter1,
			// 	urlParameters: {
			// 		$expand: "F4ReasonNav,F4ReturnNav"
			// 	},
			// 	success: function(data, response) {
			// 	 reason = new JSONModel();
			// 		PODOCoDialog1 = sap.ui.xmlfragment(self.getView().getId(), "com.olam.prof.del.frag.RollOver", this);
			// 		self.getView().addDependent(PODOCoDialog1);
			// 		self.getView().getDependents()[0]._dialog.setModel(reason, "reasonJson");

			// 	},
			// 	error:function()
			// 	{
			// 		busyDialog.close();
			// 	}
			// 		});

			_HeaderItem: function(e) {

				busyDialog.open();
				var self = this;
				var DelivDoc = self.getView().byId("InvoicedQuantity1").getValue();
				// var PODEC = self.getView().byId("PODOCDESC").getValue();
				var filters = [
					new Filter("Item", FilterOperator.EQ, "X"),
					new Filter("Vbeln", FilterOperator.EQ, DelivDoc),
					new Filter("Reason", FilterOperator.EQ, "X")
					// new Filter("ImPodata", FilterOperator.EQ, "X")

				];
				this.getOwnerComponent().getModel().read("/F4Set", {
					filters: filters,
					urlParameters: {
						$expand: "F4DeliveryNav,F4ReasonNav,F4ItemNav,F4ReturnNav"
					},
					success: function(data, response) {
					//	console.log("Get");
					//	console.log(data);
						busyDialog.close();
						
						

						self.getView().byId("Tot_gds_mt_Stat").setValue(data.results[0].F4DeliveryNav.results[0].Wbstk);
						self.getView().byId("POD_Status").setValue(data.results[0].F4DeliveryNav.results[0].Pdstk);
						self.getView().byId("Act_gmov_dt").setValue(data.results[0].F4DeliveryNav.results[0].WadatIst);
						self.getView().byId("Act_PO_dt").setValue(data.results[0].F4DeliveryNav.results[0].Podat);
						self.getView().byId("InvoicedQuantity11").setValue(data.results[0].F4DeliveryNav.results[0].Bldat);
						self.getView().byId("shiptoparty").setValue(data.results[0].F4DeliveryNav.results[0].Kunnr);
						self.getView().byId("shiptopartyDesc").setText(data.results[0].F4DeliveryNav.results[0].NAME1);
						self.getView().byId("Act_PO_tim").setValue(data.results[0].F4DeliveryNav.results[0].Potim);
						self.getView().getModel("tablejson").setData(data);
					//	debugger;
						if(data.results[0].F4DeliveryNav.results[0].Potim === "000000" || data.results[0].F4DeliveryNav.results[0].Potim === ""){
					//	debugger;
							self.getView().byId("Act_PO_tim").setValue(new Date().toLocaleString().split(" ")[1]);
						}
						if(data.results[0].F4DeliveryNav.results[0].Podat === "00000000"){
							self.getView().byId("Act_PO_dt").setDateValue(new Date());
						}
						
						//Act_PO_dt
						if (data.results[0].F4DeliveryNav.results[0].Pdstk === "C") {
							self.getView().byId("savebtn").setEnabled(false);
							self.getView().byId("savebtn").setVisible(false);
							self.getView().byId("Act_PO_tim").setEnabled(false);
							self.getView().byId("Act_PO_dt").setEnabled(false);
							self.getView().byId("completionStatusId").setText("POD Status Confirmed");

						}
						if (data.results[0].F4DeliveryNav.results[0].Pdstk !== "C") {
								self.getView().byId("savebtn").setVisible(true);
							self.getView().byId("Act_PO_tim").setEnabled(true);
							self.getView().byId("Act_PO_dt").setEnabled(true);
							self.getView().byId("completionStatusId").setText("");
						}

						var itemNav = data.results[0].F4ItemNav.results;
debugger;
						for (var h = 0; h < itemNav.length; h++) {
							itemNav[h].Podmg = itemNav[h].Lfimg;
								self.getView().getModel("tablejson").refresh(true);
							var qty = parseFloat(itemNav[h].Lfimg);
						//	if(itemNav[h].Lfimg === "0.000"){
									if(qty === 0){
									self.getView().byId("table").getItems()[h].getCells()[4].setEnabled(false);
									self.getView().byId("table").getItems()[h].addStyleClass("itemClass");
							}
							
							if(itemNav[h].Gtext !== ""){
								self.getView().byId("table").getItems()[h].getCells()[4].setEnabled(false);
							}
							
						
						/*	if (itemNav[h].Posnr === itemNav[h].Vgpos) {
								self.getView().byId("table").getItems()[h].getCells()[4].setEnabled(false);
							}*/
						}
					}.bind(this),
					error: function(oError) {
						busyDialog.close();
					}
				});
			},
			//PODoc ENDS

			onRollover: function(e) {
				if (!this.BulbFrag) {
					this.BulbFrag = sap.ui.xmlfragment("com.olam.prof.del.frag.RollOver", this);
					this.getView().addDependent(this.BulbFrag);
				}
				//debugger;
				busyDialog.open();
				selectedObject = e.getSource().getBindingContext("tablejson").getObject();
				var postObj = {};
				postObj.Arktx = selectedObject.Arktx;
				postObj.Bwart = selectedObject.Bwart;
				postObj.Calcu = selectedObject.Calcu;
				postObj.Charg = selectedObject.Charg;
				postObj.Grund = selectedObject.Grund;
				postObj.Gtext = selectedObject.Gtext;
				postObj.HandleLips = selectedObject.HandleLips;
				postObj.Lfimg = selectedObject.Lfimg;
				postObj.LfimgDiff = selectedObject.LfimgDiff;
				postObj.LgmngDiff = selectedObject.LgmngDiff;
				postObj.Lgort = selectedObject.Lgort;
				postObj.Lichn = selectedObject.Lichn;
				postObj.Matkl = selectedObject.Matkl;
				postObj.Matnr = selectedObject.Matnr;
				postObj.Matwa = selectedObject.Matwa;
				postObj.MeinsPOD = selectedObject.MeinsPOD;
				postObj.Meins = selectedObject.Meins;
				postObj.Podat = selectedObject.Podat;
				postObj.Podmg = selectedObject.Podmg;

				postObj.Posnr = selectedObject.Posnr;
				postObj.Potim = selectedObject.Potim;
				postObj.Pstyv = selectedObject.Pstyv;
				postObj.Spart = selectedObject.Spart;
				postObj.Vbeln = selectedObject.Vbeln;
				postObj.Vgpos = selectedObject.Vgpos;
				postObj.Vkgrp = selectedObject.Vkgrp;
				postObj.Vrkme = selectedObject.Vrkme;
				postObj.VrkmePOD = selectedObject.VrkmePOD;
				postObj.Vtweg = selectedObject.Vtweg;
				postObj.Werks = selectedObject.Werks;

				/*	postObj.Vbeln = selectedObject.Vbeln;
				postObj.Vrkme = selectedObject.Vrkme;*/

				var selectedData = {
					"Mandt": "",
					"HandleLips": e.getSource().getBindingContext("tablejson").getObject().HandleLips,
					"Grund": e.getSource().getBindingContext("tablejson").getObject().Grund,
					"HandleLikp": "",
					"UeHandleLips": "",
					"Vbeln": e.getSource().getBindingContext("tablejson").getObject().Vbeln,
					"Posnr": e.getSource().getBindingContext("tablejson").getObject().Posnr,
					"LfimgDiff": e.getSource().getBindingContext("tablejson").getObject().LfimgDiff.trim(),
					"Vrkme": e.getSource().getBindingContext("tablejson").getObject().Vrkme,
					"LgmngDiff": e.getSource().getBindingContext("tablejson").getObject().LgmngDiff.trim(),
					"Meins": e.getSource().getBindingContext("tablejson").getObject().Meins,
					"Umvkz": "",
					"Umvkn": "",
					"Podmg": e.getSource().getBindingContext("tablejson").getObject().Podmg,//.trim(),
					"PodmgLme": "",
					"PodmgFlo": "",
					"LgmngDiffFlo": "",
					"Lfimg": e.getSource().getBindingContext("tablejson").getObject().Lfimg.trim(),
					"Lgmng": "",
					"KcmengVme": "",
					"Kcmeng": "",
					"Gtext": e.getSource().getBindingContext("tablejson").getObject().Gtext,
					// "Gtext": "",
					// "Calcu": "",
					"Calcu": e.getSource().getBindingContext("tablejson").getObject().Calcu,
					"Matnr": e.getSource().getBindingContext("tablejson").getObject().Matnr,
					"Arktx": e.getSource().getBindingContext("tablejson").getObject().Arktx,
					"Podat": e.getSource().getBindingContext("tablejson").getObject().Podat,
					"Potim": e.getSource().getBindingContext("tablejson").getObject().Potim,
					"Rudat": "",
					"Rutim": "",
					"Fobem": "",
					"Fobew": "",
					"Updkz": "",
					"Selkz": "",
					"Podmul": "",
					"Defgr": ""

				};
				var reasonF4 = e.getSource().getBindingContext("tablejson").oModel.oData.results["0"].F4ReasonNav.results;
			//	debugger;
				newArray = [];

				//	newArray.push(selectedData);

				newArray.push(postObj);
				// debugger;

				var BulbJson = new JSONModel(newArray);
				//	 var reasonF4Json = new JSONModel(reasonF4);
			//	console.log(reasonF4);
				// debugger;
				this.getView().getModel("oRolloverComboBoxModel").setData(reasonF4);

				this.BulbFrag.setModel(BulbJson, "BulbJson");
				//	this.BulbFrag.setModel(BulbJson);
				// this.BulbFrag.setModel(reasonF4Json);
				//	this.BulbFrag.getContent()[2].mAggregations.content[0].mAggregations.columns[0].setModel(reasonF4Json.oData);
				// this.BulbFrag.byId("reasonCombo").setModel(reasonF4Json);

				this.BulbFrag.open();
				busyDialog.close();

			},

			/*	onRolloverAdd: function() {

					// debugger;
					var rollData = this.BulbFrag.getModel("BulbJson").getData();
					//	var rollData = this.BulbFrag.getContent()[2].getContent()[0].getModel("tablejson").getData().results[0].F4ItemNav.results;
					var newRollObj = {
						"Mandt": "",
						"HandleLips": this.BulbFrag.getModel("BulbJson").getData()[0].HandleLips,
						"Grund": "",
						"HandleLikp": "",
						"UeHandleLips": "",
						"Vbeln": this.BulbFrag.getModel("BulbJson").getData()[0].Vbeln,
						"Posnr": this.BulbFrag.getModel("BulbJson").getData()[0].Posnr,
						"LfimgDiff": this.BulbFrag.getModel("BulbJson").getData()[0].LfimgDiff,
						"Vrkme": this.BulbFrag.getModel("BulbJson").getData()[0].Vrkme,
						"LgmngDiff": this.BulbFrag.getModel("BulbJson").getData()[0].LgmngDiff,
						"Meins": this.BulbFrag.getModel("BulbJson").getData()[0].Meins,
						"Umvkz": "",
						"Umvkn": "",
						"Podmg": this.BulbFrag.getModel("BulbJson").getData()[0].Podmg,
						"PodmgLme": "",
						"PodmgFlo": "",
						"LgmngDiffFlo": "",
						"Lfimg": this.BulbFrag.getModel("BulbJson").getData()[0].Lifmg,
						"Lgmng": "",
						"KcmengVme": "",
						"Kcmeng": "",
						"Calcu": "",
						"Gtext": "",
						"Matnr": this.BulbFrag.getModel("BulbJson").getData()[0].Matnr,
						"Arktx": this.BulbFrag.getModel("BulbJson").getData()[0].Arktx,
						"Podat": this.BulbFrag.getModel("BulbJson").getData()[0].Podat,
						"Potim": this.BulbFrag.getModel("BulbJson").getData()[0].Potim,
						"Rudat": "",
						"Rutim": "",
						"Fobem": "",
						"Fobew": "",
						"Updkz": "",
						"Selkz": "",
						"Podmul": "",
						"Defgr": ""
					};
					rollData.push(newRollObj);
					this.BulbFrag.getModel("BulbJson").refresh(true);
				},*/
			onBulbFragSelect: function() {
				this.BulbFrag.close();
				//	this.getView().byId("bulbIconId").setColor("Yellow");
			},
			onBulbFragOk: function() {
				this.BulbFrag.close();
				// debugger;
				// this.BulbFrag.getModel("BulbJson")

				selectedObject.Grund = this.BulbFrag.getModel("BulbJson").getData()[0].Grund;
				selectedObject.LfimgDiff = this.BulbFrag.getModel("BulbJson").getData()[0].LfimgDiff;
				selectedObject.LgmngDiff = this.BulbFrag.getModel("BulbJson").getData()[0].LgmngDiff;
				selectedObject.Gtext = this.BulbFrag.getModel("BulbJson").getData()[0].Gtext;
				selectedObject.Meins = this.BulbFrag.getModel("BulbJson").getData()[0].Meins;
				selectedObject.Vrkme = this.BulbFrag.getModel("BulbJson").getData()[0].Vrkme;
				this.getView().getModel("tablejson").refresh(true);
				//this.getView().byId("bulbIconId").setColor("Yellow");
			},

			onChange: function(oEvent) {

				var path = oEvent.mParameters.id.split("-")[2];
				var value = oEvent.mParameters.value;

				this.BulbFrag.getContent()[2].getContent()[0].getModel("BulbTableTJson").getData().results[0].F4RollOverNav.results[path].Trper =
					value;
			},
			/*	onExit: function() {
					location.reload();

					//this.getView().destroy();
				},*/
			onSubmit: function() {
				// 
			//	debugger;
				var podat, potim;
var validationFlag = true;
				if (this.getView().byId("Act_PO_dt").getValue().includes("-") === true) {
					podat = this.getView().byId("Act_PO_dt").getValue().split("-")[0] + this.getView().byId("Act_PO_dt").getValue().split("-")[1] +
						this.getView().byId("Act_PO_dt").getValue().split("-")[2];
				}
				if (this.getView().byId("Act_PO_dt").getValue().includes("-") !== true) {
					podat = this.getView().byId("Act_PO_dt").getValue(); //.split("-")[0] + this.getView().byId("Act_PO_dt").getValue().split("-")[1] +
					//	this.getView().byId("Act_PO_dt").getValue().split("-")[2];
				}
				if (this.getView().byId("Act_PO_tim").getValue().includes(":") === true) {
					potim = this.getView().byId("Act_PO_tim").getValue().split(":")[0] + this.getView().byId("Act_PO_tim").getValue().split(":")[1] +
						this.getView().byId("Act_PO_tim").getValue().split(":")[2].split(" ")[0];
				}
				if (this.getView().byId("Act_PO_tim").getValue().includes(":") !== true) {
					potim = this.getView().byId("Act_PO_tim").getValue(); //.split(":")[0] + this.getView().byId("Act_PO_tim").getValue().split(":")[1] +
					//	this.getView().byId("Act_PO_tim").getValue().split(":")[2];
				}

				//	potim = this.getView().byId("Act_PO_tim").getValue().split(":")[0] + this.getView().byId("Act_PO_tim").getValue().split(":")[1] + this.getView().byId("Act_PO_tim").getValue().split(":")[2].split(" ")[0];
			//	debugger;
				var saveBusyDialog = new sap.m.BusyDialog({
					text: '...please wait while the data is saving'
				});
				saveBusyDialog.open();
				var postItem = [];
				//	var postItemLen = this.BulbFrag.getModel("BulbJson").getData().length;
				var line;
		

				var postData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;
				for (var s = 0; s < postData.length; s++) {
//debugger;
var Lfimg = parseFloat(postData[s].Lfimg);
			
				if(this.getView().byId("table").getItems()[s].getCells()[4].getEnabled() === true){
			
			
			if(postData[s].Gtext !== ""){
						if (Lfimg !== 0){
							if(parseFloat(postData[s].LfimgDiff) === 0){
								
								validationFlag = false;
									saveBusyDialog.close();
								sap.m.MessageBox.alert("Please enter Reason and Sales Unit Quantity for Item No. : " + 	postData[s].Posnr);
								break;
						}
						var postObj = {};
						postObj.Mandt = "";//postData[s].Mandt;
						postObj.HandleLips = "";//postData[s].HandleLips;
						postObj.Grund = postData[s].Grund;
						postObj.HandleLikp = "";//postData[s].HandleLikp;
						postObj.UeHandleLips = "";//postData[s].UeHandleLips;
						postObj.Vbeln = postData[s].Vbeln;
						postObj.Posnr = postData[s].Posnr;
						postObj.LfimgDiff = postData[s].LfimgDiff;
						postObj.Vrkme = postData[s].Vrkme;
						postObj.LgmngDiff = postData[s].LgmngDiff;
						postObj.Meins = postData[s].Meins;
						postObj.Umvkz = "";//postData[s].Umvkz;
						postObj.Umvkn = "";//postData[s].Umvkn;
						postObj.Podmg = "";//postData[s].Podmg;
						postObj.PodmgLme ="";// postData[s].PodmgLme;
						postObj.PodmgFlo = "";//postData[s].PodmgFlo;
						postObj.LgmngDiffFlo = "";//postData[s].LgmngDiffFlo;
						postObj.Lfimg =""; //postData[s].Lfimg;
						postObj.Lgmng ="";// postData[s].Lgmng;
						postObj.KcmengVme = "";//postData[s].KcmengVme;
						postObj.Kcmeng ="";// postData[s].Kcmeng;
						postObj.Calcu =""; //postData[s].Calcu;
						postObj.Matnr =""; //postData[s].Matnr;
						postObj.Arktx =""; //postData[s].Arktx;
						postObj.Podat = podat; //postData[s].Rutim; podat, potim
						postObj.Potim = potim; // postData[s].Selkz;
						postObj.Rudat = "";//postData[s].Rudat;
						postObj.Rutim = "";//postData[s].Rutim;
						postObj.Fobem = "";//postData[s].Fobem;
						postObj.Updkz = "";//postData[s].Updkz;
						postObj.Selkz = "";//[s].Selkz;
						postObj.Podmul =""; //postData[s].Podmul;
						postObj.Defgr = "";//postData[s].Defgr;
						
							postItem.push(postObj);
					}
				
				}}
}
				/*for (var s = 0; s < postData.length; s++) {
					var postObj = {};
					postObj.Arktx = postData[s].Arktx;
					postObj.Defgr = postData[s].Defgr;
					postObj.Fobem = postData[s].Fobem;
					postObj.Fobew = postData[s].Fobew;
					postObj.Grund = postData[s].Grund;
					postObj.HandleLikp = postData[s].HandleLikp;
					postObj.HandleLips = postData[s].HandleLips;
					postObj.Kcmeng = postData[s].Kcmeng;
					postObj.KcmengVme = postData[s].KcmengVme;
					postObj.Lfimg = postData[s].Lfimg;
					postObj.LfimgDiff = postData[s].LfimgDiff;
					postObj.Lgmng = postData[s].Lgmng;
					postObj.LgmngDiff = postData[s].LgmngDiff;
					postObj.LgmngDiffFlo = postData[s].LgmngDiffFlo;
					postObj.Mandt = postData[s].Mandt;
					postObj.Matnr = postData[s].Matnr;
					postObj.Meins = postData[s].Meins;
					postObj.Podat = postData[s].Podat;
					postObj.Podmg = postData[s].Podmg;
					postObj.PodmgFlo = postData[s].PodmgFlo;
					postObj.PodmgLme = postData[s].PodmgLme;
					postObj.Podmul = postData[s].Podmul;
					postObj.Potim = postData[s].Potim;
					postObj.Rudat = postData[s].Rudat;
					postObj.Rutim = postData[s].Rutim;
					postObj.Selkz = postData[s].Selkz;
					postObj.UeHandleLips = postData[s].UeHandleLips;
					postObj.Umvkn = postData[s].Umvkn;
					postObj.Umvkz = postData[s].Umvkz;
					postObj.Updkz = postData[s].Updkz;
					postObj.Vbeln = postData[s].Vbeln;
					postObj.Vrkme = postData[s].Vrkme;

					postItem.push(postObj);
				}*/

				var postPayLoad = {
					"VbelnVl": this.getView().byId("InvoicedQuantity1").getValue(),
					"VbtypVl": "",
					"Vbeln": this.getView().byId("InvoicedQuantity1").getValue(),
					"Kzlfd": "",
					"Podat": podat, //this.getView().getModel("tablejson").getData().results[0].F4DeliveryNav.results[0].Podat,
					"Potim": potim,//this.getView().getModel("tablejson").getData().results[0].F4DeliveryNav.results[0].Potim,
					"Kzpod": "C",
					"PostMessageNav": [{
						"Vbeln": "",
						// "Vbeln": "",
						"Posnr": "",
						"Matnr": "",
						"Arktx": "",
						"Lfimg": "",
						"Vrkme": "",
						"Charg": "",
						"Msgno": "",
						"Msgty": "",
						"Msgid": "",
						"Msgv1": "",
						"Msgv2": "",
						"Msgv3": "",
						"Msgv4": ""
					}],
					// "PostItemNav": this.BulbFrag.getModel("BulbJson").getData()
					"PostItemNav": postItem
				};
			/*	debugger;
				console.log(postPayLoad);*/
				/*	debugger;
						console.log("Postpay Load");
						console.log(postPayLoad);
						debugger;*/
						
						// 	console.log("Postpay Load");
						// console.log(postPayLoad);
				 if(validationFlag === true) {
				//	debugger;
				this.getView().getModel().create("/PostSet", postPayLoad, {
					success: function(odata, Response) {
						saveBusyDialog.close();
					/*	debugger;
						console.log(odata);*/
						if (odata.PostMessageNav.results[0].Msgty === "S") {
							sap.m.MessageBox.success(odata.PostMessageNav.results[0].Msgv1, {
								title: "success",
								icon: sap.m.MessageBox.Icon.SUCCESS,
								actions: "Ok",
								onClose: function() {
									location.reload();
								}

							});

						}
					},
					error: function(Response) {
						saveBusyDialog.close();
						//	MessageToast.show(Response.message);
						sap.m.MessageBox.error(Response.message, {
							title: "Error",
							icon: sap.m.MessageBox.Icon.ERROR,
							actions: "CLOSE"

						});
					}
				});
				 }

			},
			NavtoNew: function() {

				// var addData = this.getVi	ew().getModel("tablejson").getData().results[0].F4ItemNav.results;
				var addData = this.getView().getModel("tablejson").getData().results;
				// var addData =[];
				var fixCount = addData.length + 1;
				var fixNum = "0" + fixCount;

				// var headerData = this.getView().getModel("tablejson").getData().results[0].F4HeaderNav.results[0];
				/*var addObj = {
					Selec: "",
					Exchg: headerData.Exchg,
					Byslr: headerData.Zzbyslr,
					Dfbas: "",
					Fxdat: "",
					Fxnum: fixNum,
					Fxprc: "",
					Fxqty: "",
					Lifnr: "",
					Fcrum: "",
					Lname: "",
					Trper: headerData.Trper,
					Zieme: headerData.Meins,
					Zmeng: "",
					Avgec: "",
					Ntprc: "",
					Ntval: "",
					Avgvl: "",
					Avgut: "",
					Avget: "",
					Waers: "",
					Fixed: "",
					//Invcd: "X",
					Invcd: "",
					Rollo: "",
					Openq: "",
					Apprv: "",
					Wkurs: ""
				};*/
			//	debugger;

				var addObj = {
					Apprv: "",
					Avgec: "",
					Avget: "",
					Avgut: "",
					Avgvl: "",
					Byslr: "",
					Dfbas: "",
					Exchg: "",
					Fcrum: "",
					Fixed: "",
					Fxdat: "",
					Fxnum: "",
					Fxprc: "",
					Fxqty: "",
					Invcd: "",
					Lifnr: "",
					Lname: "",
					Ntprc: "",
					Ntval: "",
					Openq: "",
					Rollo: "",
					Selec: "",
					Trper: "",
					Waers: "",
					Wkurs: "",
					Zieme: "",
					Zmeng: ""

				};
				addData.push(addObj);
				//	addData.setData(addObj);
				this.getView().getModel("tablejson").refresh(true);
				/*	PressAdd = true;
					var firstScreenValues = {};
					var itemLength = this.getView().byId("table").getModel("ItemJson").getData().results[0].F4ItemNav.results.length;
					var itemNo = itemLength + 1;
					this.getOwnerComponent().getRouter().navTo("object", {
						line_no: itemNo,
						values: "Add"
					});*/

			},
			onFixLotChange: function(oEvent) {
				//var FixLot = parseInt(oEvent.getSource().getValue());

				var initialLot = this.getView().getModel("tablejson").getData().results[0].F4HeaderNav.results[0].Zzlotno;
				var count = 0;

				var aData = this.getView().getModel("tablejson").getData().results[0].F4ItemNav.results;
				for (var d = 0; d < aData.length; d++) {
					count = count + parseInt(aData[d].Fxqty);
				}
				var msg = "Total Number of Lots should be less than or equal to " + initialLot;

				if (initialLot < count) {
					sap.m.MessageBox.alert(msg, {
						title: 'Alert'
					});
				}
			},
			buttonChange: function(oEvent) {
				// debugger;
				var state = oEvent.getParameters().state;
				if (state === true) {
					if (this.getView().byId("POD_Status").getValue() === "C") {
						sap.m.MessageBox.alert("POD Status already confirmed");
						self.getView().byId("savebtn").setEnabled(false);
						// this.getView().byId("btnswitch").setEnabled(false);
					}
					if (this.getView().byId("POD_Status").getValue() !== "C") {
						this.getView().byId("savebtn").setEnabled(true);
					}

				} else {
					if (this.getView().byId("POD_Status").getValue() === "C") {
						sap.m.MessageBox.alert("POD Status already confirmed");
					}
					if (this.getView().byId("POD_Status").getValue() !== "C") {
						// this.getView().byId("savebtn").setEnabled(true);
						sap.m.MessageBox.alert("Please Confirm POD Status");
						this.getView().byId("savebtn").setEnabled(false);
					}
					// sap.m.MessageBox.alert("Please Confirm POD Status");
					// this.getView().byId("savebtn").setEnabled(false);
				}
			},
			onitemPress: function(e) {
				PressAdd = false;
				var line_no = e.getSource().getBindingContext("tablejson").getPath().split("/")[5];
				this.getOwnerComponent().getRouter().navTo("object", {
					line_no: line_no,
					values: "Edit",
					path: encodeURIComponent(e.getSource().getBindingContext("tablejson").getPath())
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			Delete: function(e) {
				var oModel = this.getView().byId("table").getModel("tablejson");
				//.getModel("tablejson");
				var data = oModel.getData().results[0].F4ItemNav.results;

				var oTable = this.byId("table");
				var sItems = oTable.getSelectedItems();
				if (sItems.length === 0) {
					sap.m.MessageBox.alert("Please select atleast one item to delete.", {
						title: 'Delete'
					});

				} else {
					var dialog = new sap.m.Dialog({
						title: 'Delete',
						type: 'Message',
						content: new sap.m.Text({
							text: 'Are you sure you want to delete the selected item ?'
						}),
						beginButton: new sap.m.Button({
							text: 'Ok',
							press: function() {
								for (var i = sItems.length - 1; i >= 0; i--) {

									/*  var path = sItems[i].getBindingContext("tablejson").getPath();
									var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
									data.results.splice(idx, 1);*/
									var aPath = sItems[i].getBindingContextPath();
									var path = aPath.split("/")[5];
									var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
									//data
									data.splice(idx, 1);
								}
								//oModel.setData(data);

								/*for (var i = 0; i < data.length; i++) {
								data[i].Fxnum = i + 1;
								}
								oModel.setData(data);*/
								//  var data = data.results[0].F4ItemNav.results;
								//var i = 0;
								/*  for (var i = 0; i < data.length; i++) {
								data[i].Fxnum = i + 1;
								}
								oModel.setData(data);*/
								oModel.refresh(true);
								dialog.close();
							}
						}),
						endButton: new sap.m.Button({
							text: 'Cancel',
							press: function() {
								dialog.close();
							}
						}),
						afterClose: function() {
							dialog.destroy();
						}
					});
					dialog.open();
				}
				oTable.removeSelections();
			},

			onRefresh: function() {
				this._oTable.getBinding("items").refresh();
			},

			_showObject: function(oItem) {
				this.getRouter().navTo("object", {
					objectId: ""
				});
			},

			onSelectItemTab: function() {
				var selectedTab = this.getView().byId("idIconTabBarMulti").getSelectedKey();
				if (selectedTab === "Icon2") {
					//var BulbFrag = sap.ui.xmlfragment("createpo/frag/Bulb", this);
					BulbFrag.open();
					this.getView().byId("bulbID").setType("Accept");
					this.getView().byId("bulbIconId").setColor("Yellow");
				} else {
					this.getView().byId("bulbID").setType("Default");
					this.getView().byId("bulbIconId").setColor("Red");

				}
				//oEvent;
			},

			onBack: function() {
				window.history.go(-1);
			},

			onComboBoxChange: function(oEvent) {
			//	debugger;
			
				this.BulbFrag.getModel("BulbJson").refresh(true);
				var sPath = oEvent.getSource().getParent().oBindingContexts.BulbJson.sPath;
				sPath = sPath.split("/")[1];
				//oEvent.getSource().getParent().oBindingContexts.BulbJson.getModel().getData()[sPath].Gtext = oEvent.getSource().getSelectedItem().getAdditionalText();
			//	oEvent.getSource().getParent().oBindingContexts.BulbJson.getModel().getData()[sPath].Calcu = oEvent.getSource().getSelectedKey();
			
			this.BulbFrag.getModel("BulbJson").getData()[sPath].Gtext = oEvent.getSource().getSelectedItem().getAdditionalText();
			this.BulbFrag.getModel("BulbJson").getData()[sPath].Calcu = oEvent.getSource().getSelectedKey();
				this.BulbFrag.getModel("BulbJson").refresh(true);
				// this.getView().getModel("tablejson").getData().results[0];
				//this.BulbFrag.getModel("BulbJson").getData()[0].Gtext;
			},

			onLfingChange: function(eve) {
				var simulateBusyDialog = new sap.m.BusyDialog({
					text: '...please wait while the data is simulating'
				});
				 debugger;
				simulateBusyDialog.open();
				this.sPath = eve.getSource().getParent().oBindingContexts.BulbJson.sPath;
				this.sPath = this.sPath.split("/")[1];
				this.k = eve.getSource().getParent().oBindingContexts.BulbJson.getModel().getData()[this.sPath];
				var filters = [
					new Filter("Matnr", FilterOperator.EQ, this.k.Matnr),
					new Filter("InMeins", FilterOperator.EQ, this.k.Vrkme),
					new Filter("OutMeins", FilterOperator.EQ, this.k.Meins),
					new Filter("Inmenge", FilterOperator.EQ, this.k.LfimgDiff)

				];
				this.getOwnerComponent().getModel().read("/F4Set", {
					filters: filters,
					urlParameters: {
						$expand: "F4QtyNav,F4ReturnNav"
					},
					success: function(data, response) {
						 debugger;

						simulateBusyDialog.close();
						this.k.LgmngDiff = data.results[0].F4QtyNav.results[0].OUTMENGE.trim();
							this.BulbFrag.getModel("BulbJson").refresh(true);
						var calcData = this.BulbFrag.getModel("BulbJson").getData()[0];
						
						if(calcData.Calcu === "+"){
					//	selectedObject.Podmg =	parseFloat(calcData.Podmg) +  parseFloat(calcData.LfimgDiff);
					
						selectedObject.Podmg =	parseFloat(calcData.Lfimg) +  parseFloat(calcData.LfimgDiff);
						}
						if(calcData.Calcu === "-"){
					//	selectedObject.Podmg =	parseFloat(calcData.Podmg) -  parseFloat(calcData.LfimgDiff);
					
					selectedObject.Podmg =	parseFloat(calcData.Lfimg) -  parseFloat(calcData.LfimgDiff);
						}
					
				//	calcData 
				
				this.getModel("tablejson").refresh(true);
				calcData.Podmg = selectedObject.Podmg;
				this.BulbFrag.getModel("BulbJson").refresh(true);
					
debugger;
//selectedObject.Podmg = "";
					}.bind(this),
					error: function(response) {
						simulateBusyDialog.close();
					}
				});
			}
		});
	});