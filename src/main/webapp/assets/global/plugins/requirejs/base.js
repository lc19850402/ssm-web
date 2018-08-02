(function() {
	requirejs.config({
		baseUrl : base_url + "/assets/global/plugins",
		paths : {
			"vue" : "vue/vue.min",
			"vuex" : "vue/vuex.min",
			"vue.router" : "vue/vue-router.min",
			"text" : "requirejs/text.min"
		},
		waitSeconds : 15,
		map : {},
		urlArgs : "version=" + Date.now(),
		shim : {
			"vue" : { exports : "Vue" },
			"vuex" : { exports : "Vuex" },
			"vue.router" : { exports : "VueRouter" }
		},
		callback : function() {},
		deps : [ "vue","vuex","vue.router" ]
	});
})();