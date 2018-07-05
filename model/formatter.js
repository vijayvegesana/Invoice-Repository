sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		NetValue: function(Quantity, NetPrice) {
			if (Quantity !== undefined && Quantity !== null && Quantity !== null || NetPrice !== undefined && NetPrice !== null && NetPrice !==
				null) {
				var Product = Quantity * NetPrice;
				var ProdFloat = parseFloat(Math.round(Product * 100) / 100).toFixed(3);
				return ProdFloat;
			} else {
				return;
			}

		},

		/*	DateConversion: function(date1) {
				return date1.slice(0, 4) + "-" + date1.slice(4, 6) + "-" + date1.slice(6, 8);

			},*/

		DateConversion: function(date1) {
			if (date1 !== "") {
				return date1.slice(6, 8) + "-" + date1.slice(4, 6) + "-" + date1.slice(0, 4); //date1.slice(6, 8);
			}

		},
		Quan: function(a) {
			return a;
		},

		AmountConverter: function(a) {
			if (a) {
				return parseFloat(a).toFixed(2);
			}
		}

	};

});