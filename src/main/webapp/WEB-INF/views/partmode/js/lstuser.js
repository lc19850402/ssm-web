require([
		"vue","vuex","vue.router",base_url + "partmode/parts/adduser.js"
], function(Vue, Vuex, VueRouter, AddUser) {
	Vue.use(Vuex);
	Vue.use(VueRouter);
	var router = new VueRouter({
		routes : [
			{
				path : '/adduser',
				component : AddUser
			}
		]
	});
	var store = new Vuex.Store({
		state : {
			bean : {},
			rows : [],
			mainshow : true
		}
	})
	var vm = new Vue({
		el : '#app',
		data : {
			params : {
				pager : {
					pageNum : 1,
					pageSize : 10,
					totalCount : 0,
					totalPages : 1
				},
				user_sex : '',
				user_name : ''
			},
		},
		store : store,
		methods : {
			gotoitem : function(row) {
				this.$store.state.bean = row;
				this.$store.state.mainshow = false;
				this.$router.push({ path : 'adduser' });
			},
			query : function(first) {
				var _me = this;
				if (first) {
					_me.params.pager.pageNum = 1;
				}
				$$.ajax({
					method : base_url + 'routemode/getUserList',
					data : $$.json(_me.params),
					load : true,
					success : function(data, result) {
						// 通过$set方法监视rows变化，类似ng的$apply
						_me.$set(_me.$store.state, 'rows', result.data);
						if (first) {// 如果是查询逻辑，则重新初始化分页
							$("#page-nav").pager({
								size : _me.params.pager.pageSize,
								totle : result.other,
								onchange : function(index, size) {
									_me.params.pager.pageNum = index;
									_me.params.pager.pageSize = size;
									_me.query();// 翻页逻辑不需要重新初始化分页
								}
							});
						}
					}
				});
			},
			getclass : function(row) {
				if (row.user_age <= 20) {
					return 'label label-success';
				} else if (row.user_age > 20 && row.user_age <= 40) {
					return 'label label-primary';
				} else if (row.user_age > 40 && row.user_age <= 60) {
					return 'label label-warning';
				} else {
					return 'label label-danger';
				}
			}
		},
		created : function() {
			var _me = this;
			$$.when().then(function() {
				_me.query(true);
			});
		},
		filters : {
			date : function(value, type) {
				return new Date(value).format(type);
			}
		},
		router : router
	});
});
