<%@ page pageEncoding="UTF-8"%>
<div ng-app="adduser_app" ng-controller="adduser_ctrl" class="container col-md-6 col-md-offset-3">
	<div class="row" style="padding: 10px 0px; text-align: right;">
		<input type="button" class="btn btn-default" ng-click="goback()" value="返回列表" />
	</div>
	<div class="row" id="frmUser">
		<div class="panel panel-default">
			<div class="panel-heading">用户信息维护</div>
			<div class="panel-body" style="padding: 15px 40px;">
				<div class="form-group">
					<label class="control-label">姓名：</label> <input type="text" class="form-control" placeholder="请输入名称"
						data-rule="required" ng-model="bean.user_name">
				</div>
				<div class="form-group">
					<label class="control-label">年龄：</label> <input class="form-control" placeholder="请输入年龄" type="text"
						data-rule="required,number" ng-model="bean.user_age" />
				</div>
				<div class="form-group">
					<label class="control-label">性别：</label> <select ng-model="bean.user_sex" class="form-control" data-rule="required">
						<option value="">--请选择--</option>
						<option value="男">男</option>
						<option value="女">女</option>
					</select>
				</div>
				<div class="form-group">
					<label class="control-label">生日：</label>
					<div class="input-group date datepicker" data-provide="datepicker">
						<input class="form-control date-picker" placeholder="请输入生日" type="text" readonly="readonly" data-rule="required"
							ng-model="bean.user_birthday" /> <span class="input-group-addon"> <span class="fa fa-calendar"></span>
						</span>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label">住址：</label>
					<textarea class="form-control" rows="2" style="resize: vertical;" placeholder="请输入住址" ng-model="bean.user_address"></textarea>
				</div>
				<div class="form-group" style="text-align: right">
					<input type="button" class="btn btn-success" ng-click="saveUser()" value="保存信息 (AJAX模式)" />
				</div>
			</div>
		</div>
	</div>
</div>