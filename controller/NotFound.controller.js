sap.ui.define([
		"com/olam/prof/del/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.olam.prof.del.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);