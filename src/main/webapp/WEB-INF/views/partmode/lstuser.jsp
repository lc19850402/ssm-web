<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../utils/jspbase.jsp"%>
<script type="text/javascript" src="${base_url}/assets/global/plugins/requirejs/require.min.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/requirejs/base.js?version=${jsversion}"></script>
<title>用户查询列表</title>
</head>
<body>
	<div id="app" class="container col-md-8 col-md-offset-2">
		<div v-show="$store.state.mainshow">
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
							<template v-if="$store.state.rows">
							<tbody>
								<tr v-for="(row,$index) in $store.state.rows">
									<td>{{params.pager.pageSize*(params.pager.pageNum-1)+($index+1)}}</td>
									<td>{{row.user_name}}</td>
									<td>{{row.user_sex}}</td>
									<td><span :class="getclass(row)">{{row.user_age}}</span></td>
									<td>{{row.user_birthday | date('yyyy年MM月dd日')}}</td>
									<td style="text-align: left;"><p class="ellipsis" :title="row.user_address">{{row.user_address}}</p></td>
									<td><a herf="javascript:;" @click="gotoitem(row)">编辑</a> <a herf="javascript:;" @click="deleteitem(row)">删除</a></td>
								</tr>
								<tr v-if="$store.state.rows.length==0">
									<td style="background-color: #fff; text-align: left; padding-left: 10px;" colspan="7">无数据记录</td>
								</tr>
							</tbody>
							</template>
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
		<div v-if="!$store.state.mainshow">
			<router-view></router-view>
		</div>
	</div>
</body>
<script type="text/javascript" src="js/lstuser.js?version=${jsversion}"></script>
</html>