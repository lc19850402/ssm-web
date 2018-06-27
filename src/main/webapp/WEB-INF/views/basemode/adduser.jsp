<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="../utils/jspbase.jsp"%>
<title>用户信息维护</title>
<script type="text/javascript">
	$(function() {
		$('#user_birthday').parent().datepicker({
			"autoclose" : true,
			"format" : "yyyy-mm-dd",
			"language" : "zh-CN"
		});
		$("#btnSave").click(function(event) {
			if (!$$.validate.checkInputs($('#frmUser'))) return false;
			$$.ui.confirm('是否提交用户信息?', function() {
				$$.ui.loader();
				$("#frmUser").ajaxSubmit({
					success : function(data) {
						$$.ui.message({
							type : 'success',
							content : '用户添加完毕.'
						});
					},
					complete : function() {
						$$.ui.removeloader();
					}
				});
			});
			return false;
		});
	});
</script>
</head>
<body>
	<form id="frmUser" role="form" action="${base_url}/basemode/insertUser" method="post" style="margin-top: 15px;">
		<input type="hidden" name="pageflag" value="${pageflag}">
		<div class="container col-md-6 col-md-offset-3">
			<div class="row">
				<c:if test="${status==false&&error_info!=null}">
					<div class="alert alert-warning">
						<a href="#" class="close" data-dismiss="alert"> &times; </a> <strong>错误：</strong>${error_info}
					</div>
				</c:if>
				<c:if test="${status==true}">
					<div id="myAlert" class="alert alert-success">
						<a href="#" class="close" data-dismiss="alert">&times;</a> 姓名： ${userBean.get("user_name")}
						年龄：${userBean.get("user_age")} 性别：${userBean.get("user_sex")} 生日：${userBean.get("user_birthday")}
						住址：${userBean.get("user_address")}
					</div>
				</c:if>
			</div>
			<div class="row">
				<div class="panel panel-default">
					<div class="panel-heading">用户信息维护</div>
					<div class="panel-body" style="padding: 15px 40px;">
						<div class="form-group">
							<label for="user_name" class="control-label">姓名：</label> <input type="text" class="form-control" name="user_name"
								placeholder="请输入名称" value="${userBean.get("user_name")}" data-rule="required">
						</div>
						<div class="form-group">
							<label for="user_age" class="control-label">年龄：</label> <input id="user_age" class="form-control" name="user_age"
								placeholder="请输入年龄" type="text" value="${userBean.get("user_age")}" data-rule="required,number" />
						</div>
						<div class="form-group">
							<label for="user_name" class="control-label">性别：</label> <select id="user_sex" class="form-control"
								name="user_sex" value="${userBean.get(" user_sex")}" data-rule="required">
								<option value="">--请选择--</option>
								<option ${userBean.get("user_sex") eq '男'?'selected':''} value="男">男</option>
								<option ${userBean.get("user_sex") eq '女'?'selected':''} value="女">女</option>
							</select>
						</div>
						<div class="form-group">
							<label for="user_birthday" class="control-label">生日：</label>
							<div class="input-group date" data-provide="datepicker">
								<input id="user_birthday" name="user_birthday" class="form-control date-picker" placeholder="请输入生日" type="text"
									value="${userBean.get("user_birthday")}" readonly="readonly" data-rule="required" /> <span
									class="input-group-addon"> <span class="fa fa-calendar"></span>
								</span>
							</div>
						</div>
						<div class="form-group">
							<label for="user_name" class="control-label">住址：</label> <input id="user_address" name="user_address"
								class="form-control" placeholder="请输入住址" type="text" value="${userBean.get("user_address")}"/>
						</div>
						<div class="form-group" style="text-align: right">
							<button id="btnSave" class="btn btn-success">保存信息 (表单模式)</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</body>
</html>