define(["text!parts/adduser"], function(template) {
    return {
    	template : template,
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
    					_me.$store.state.bean = $.extend(true, _me.$store.state.bean || {}, _me.bean);
    				}
    			});
    		}
    	},
    	beforeRouteLeave(to, from, next) {
    	    next();
    	    this.$store.state.mainshow = true;
    		if (this.addMode && this.$store.state.bean) {
    			this.$store.state.rows.insert(0, this.bean);
    		}
    		this.goback();
    		
    	},
    	mounted : function() {
    		var _me = this;
    		_me.addMode = this.$store.state.bean == null;
    		if (this.$store.state.bean) {
    			// 保证修改this.bean不会影响this.$store.state.bean
    			_me.bean = $.extend({}, this.$store.state.bean, {});
    			_me.bean.user_birthday = new Date(_me.bean.user_birthday).format('yyyy-MM-dd');
    		}
    		// 类似jquery的$(function(){})
    		this.$nextTick(function() {
    			$('.datepicker').datepicker({
    				"autoclose" : true,
    				"format" : "yyyy-mm-dd",
    				"language" : "zh-CN"
    			}).on('changeDate', function(ev) {
    				_me.bean.user_birthday = $('.datepicker input:first').val();
    			});
    		})
    	}
    }
});