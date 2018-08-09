(function() {
	requirejs.config({
		baseUrl : '',//base_url,默认使用引用requirejs的路径
		paths : {
			"vue" : base_url + "assets/global/plugins/vue/vue.min",
			"vuex" : base_url + "assets/global/plugins/vue/vuex.min",
			"vue.router" : base_url + "assets/global/plugins/vue/vue-router.min",
			"text" : base_url + "assets/global/plugins/requirejs/text.min"
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