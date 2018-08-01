var AddUser = Vue.extend({
	template : '#adduser_app',
	data : function() {
		return {
			bean : {
				user_id : '',
				user_name : '',
				user_age : '',
				user_sex : '',
				user_birthday : '',
				user_address : ''
			}
		}
	},
	methods : {
		goback : function() {
			this.$router.push({ path : '/' });
		},
		saveUser : function() {
			var _me = this;
			if (!$$.validate.checkInputs($('#frmUser'))) return false;
			$$.ajax({
				method : base_url + 'routemode/saveUser',
				confirm : '提示：是否保存用户信息?',
				message : '用户保存完毕!',
				data : $$.json(_me.bean),
				success : function(data) {
					_me.bean.user_id = data.user_id;
					// 通过jquery的深度拷贝 触发更新视图
					vm.bean = $.extend(true, vm.bean || {}, _me.bean);
				}
			});
		}
	},
	beforeRouteLeave(to, from, next) {
	    next();
	    vm.mainshow = true;
		if (this.addMode && vm.bean) {
			vm.rows.insert(0, this.bean);
		}
		this.goback();
		
	},
	mounted : function() {
		var _me = this;
		_me.addMode = vm.bean == null;
		if (vm.bean) {
			// 保证修改this.bean不会影响vm.bean
			_me.bean = $.extend({}, vm.bean, {});
			_me.bean.user_birthday = new Date(_me.bean.user_birthday).format('yyyy-MM-dd');
		}
		// 类似jquery的$(function(){ })
		this.$nextTick(function() {
			$('.datepicker').datepicker({
				"autoclose" : true,
				"format" : "yyyy-mm-dd",
				"language" : "zh-CN"
			}).on('changeDate', function(ev) {
				_me.bean.user_birthday = $('.datepicker input:first').val();
			});;
		})
	}
});

var vm = new Vue({
	el : '#app',
	data : {
		rows : [],
		mainshow : true,
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
		bean : {}
	},
	methods : {
		gotoitem : function(row) {
			this.mainshow = false;
			this.bean = row;
			this.$router.push({
				path : 'adduser'
			});
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
					_me.$set(_me, 'rows', result.data);
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
	router : new VueRouter({
		routes : [
			{
				path : '/adduser',
				component : AddUser
			}
		]
	})
});
