<%@ page language="java" import="java.util.*"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path;
	String pageflag = Double.toString(Math.random());
	session.setAttribute("pageflag", pageflag);
%>
<c:set var="jsversion" value="0625" />
<c:set var="pageflag" value="<%=pageflag%>" />
<c:set var="base_url" value="<%=basePath%>" />

<link href="${base_url}/assets/global/css/components.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/global/css/components-rounded.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/global/css/plugins.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/layout/css/layout.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/layout/css/themes/grey.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/global/plugins/datepicker/skin/WdatePicker.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/global/plugins/bootstrap/css/bootstrap.min.css?version=${jsversion}" rel="stylesheet" type="text/css" />
<link href="${base_url}/assets/global/plugins/bootstrap-toastr/toastr.min.css" rel="stylesheet"  type="text/css">
<link href="${base_url}/assets/global/plugins/bootstrap-datepicker/css/datepicker.css" rel="stylesheet"  type="text/css">
<link href="${base_url}/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet"  type="text/css">

<script type="text/javascript" src="${base_url}/assets/global/plugins/jquery.min.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/jquery.form.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/bootstrap/js/bootstrap.min.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/jquery.blockui.min.js"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/bootstrap-toastr/toastr.min.js"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/datepicker/WdatePicker.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/angular/angular.min.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/plugins/angular/angular-ui-router.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/global/scripts/metronic.js"></script>
<script type="text/javascript" src="${base_url}/assets/scripts/jquery.utils.js?version=${jsversion}"></script>
<script type="text/javascript" src="${base_url}/assets/scripts/jquery.pager.js?version=${jsversion}"></script>



