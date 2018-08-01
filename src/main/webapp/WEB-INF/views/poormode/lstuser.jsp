<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../utils/jspbase.jsp"%>
<title>用户查询列表</title>
</head>
<body>
	<div id="app" class="container col-md-8 col-md-offset-2">
		<div v-show="mainshow">
			<div class="panel panel-default">
				<div class="panel-heading">用户查询列表</div>
				<div class="panel-body">
					<div class="row query-group" style="margin-top: 5px; margin-bottom: 15px;">
						<dl>
							<dd>
								<label class="control-label">姓名：</label>
								<div class="input-group">
									<input type="text" class="form-control" placeholder="请输入名称" data-rule="required" v-model="params.user_name">
								</div>
							</dd>
							<dd>
								<label class="control-label">性别：</label>
								<div class="input-group">
									<select v-model="params.user_sex" class="form-control" data-rule="required">
										<option value="">--请选择--</option>
										<option value="男">男</option>
										<option value="女">女</option>
									</select>
								</div>
							</dd>
							<dd>
								<input type="button" class="btn btn-info" @click="query(true)" value="查询" /> <a href="javascript:;"
									class="btn btn-success" @click="gotoitem()">新增用户</a>
							</dd>
						</dl>
					</div>
					<div class="table-responsive">
						<table style="table-layout: fixed;" class="table table-bordered table-hover tabstyle">
							<thead>
								<tr class="heading">
									<th width="50px">序号</th>
									<th width="90px">姓名</th>
									<th width="50px">性別</th>
									<th width="50px">年齡</th>
									<th width="140px">生日</th>
									<th style="text-align: left;">地址</th>
									<th width="80px">操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row,$index) in rows" >
									<td>{{params.pager.pageSize*(params.pager.pageNum-1)+($index+1)}}</td>
									<td>{{row.user_name}}</td>
									<td>{{row.user_sex}}</td>
									<td><span :class="getclass(row)">{{row.user_age}}</span></td>
									<td>{{row.user_birthday | date('yyyy年MM月dd日')}}</td>
									<td style="text-align: left;"><p class="ellipsis" :title="row.user_address">{{row.user_address}}</p></td>
									<td><a herf="javascript:;" @click="gotoitem(row)">编辑</a> <a herf="javascript:;" @click="deleteitem(row)">删除</a></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="row" style="text-align: right">
						<div class="col-md-12">
							<div id="page-nav" style="text-align: right"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!mainshow"><router-view></router-view></div>
	</div>
</body>
<template id="adduser_app">
<div class="container col-md-6 col-md-offset-3">
	<div class="row" style="padding: 10px 0px; text-align: right;">
		<a href="javascript:;" class="btn btn-default" @click="goback()">返回列表</a>
	</div>
	<div class="row" id="frmUser">
		<div class="panel panel-default">
			<div class="panel-heading">用户信息维护</div>
			<div class="panel-body" style="padding: 15px 40px;">
				<div class="form-group">
					<label class="control-label">姓名：</label> <input type="text" class="form-control" placeholder="请输入名称"
						data-rule="required" v-model="bean.user_name">
				</div>
				<div class="form-group">
					<label class="control-label">年龄：</label> <input class="form-control" placeholder="请输入年龄" type="text"
						data-rule="required,number" v-model="bean.user_age" />
				</div>
				<div class="form-group">
					<label class="control-label">性别：</label> <select v-model="bean.user_sex" class="form-control" data-rule="required">
						<option value="">--请选择--</option>
						<option value="男">男</option>
						<option value="女">女</option>
					</select>
				</div>
				<div class="form-group">
					<label class="control-label">生日：</label>
					<div class="input-group date datepicker" data-provide="datepicker">
						<input class="form-control date-picker" placeholder="请输入生日" type="text" readonly="readonly" data-rule="required"
							v-model="bean.user_birthday" /> <span class="input-group-addon"> <span class="fa fa-calendar"></span>
						</span>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label">住址：</label>
					<textarea class="form-control" rows="2" style="resize: vertical;" placeholder="请输入住址" v-model="bean.user_address"></textarea>
				</div>
				<div class="form-group" style="text-align: right">
					<input type="button" class="btn btn-success" @click="saveUser()" value="保存信息 (AJAX模式)" />
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script type="text/javascript" src="js/lstuser.js?version=${jsversion}"></script>
</html>