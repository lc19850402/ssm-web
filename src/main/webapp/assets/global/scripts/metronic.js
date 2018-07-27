/**
 * Core script to handle the entire theme and core functions
 */
var Metronic = function() {
	var resizeHandlers = [];
	var assetsPath = '../assets/global';
	var globalImgPath = 'img/';
	var globalCssPath = 'css/';
	// theme layout color set
	var brandColors = {'blue' : '#89C4F4','red' : '#F3565D','green' : '#1bbc9b','purple' : '#9b59b6','grey' : '#95a5a6', 'yellow' : '#F8CB00'};
	// * END:CORE HANDLERS *//
	return {
		// wrMetronicer function to block element(indicate loading)
		blockUI : function(options) {
			options = $.extend(true, {}, options);
			var html = '';
			if (options.animate) {
				html = '<div class="loading-message '
						+ (options.boxed ? 'loading-message-boxed' : '')
						+ '">'
						+ '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
						+ '</div>';
			} else if (options.iconOnly) {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="'
						+ this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
			} else if (options.textOnly) {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;'
						+ (options.message ? options.message : 'LOADING...') + '</span></div>';
			} else {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="'
						+ this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;'
						+ (options.message ? options.message : 'LOADING...') + '</span></div>';
			}
			if (options.target) { // element blocking
				var el = $(options.target);
				if (el.height() <= ($(window).height())) {
					options.cenrerY = true;
				}
				el.block({
					message : html,
					baseZ : options.zIndex ? options.zIndex : 1000,
					centerY : options.cenrerY !== undefined ? options.cenrerY : false,
					css : {top : '10%',border : '0',padding : '0',backgroundColor : 'none'},
					overlayCSS : {backgroundColor : options.overlayColor ? options.overlayColor : '#555',
						opacity : options.boxed ? 0.05 : 0.1,cursor : 'wait'}});
			} else { // page blocking
				$.blockUI({
					message : html,
					baseZ : options.zIndex ? options.zIndex : 1000,
					css : {border : '0',padding : '0',backgroundColor : 'none'},
					overlayCSS : {backgroundColor : options.overlayColor ? options.overlayColor : '#555',
						opacity : options.boxed ? 0.05 : 0.1,cursor : 'wait'}});
			}
		},
		// wrMetronicer function to un-block element(finish loading)
		unblockUI : function(target) {
			if (target) {
				$(target).unblock({onUnblock : function() {
					$(target).css('position', '');
					$(target).css('zoom', '');
				}});
			} else {
				$.unblockUI();
			}
		},
		
		getAssetsPath : function() {
			return assetsPath;
		},getGlobalImgPath : function() {
			return assetsPath + globalImgPath;
		},getGlobalCssPath : function() {
			return assetsPath + globalCssPath;
		},
		// get layout color code by color name
		getBrandColor : function(name) {
			if (brandColors[name]) {
				return brandColors[name];
			} else {
				return '';
			}
		}};
}();