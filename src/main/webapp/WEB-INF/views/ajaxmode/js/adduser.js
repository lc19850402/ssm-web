angular.module('app', []).controller('ctrl', function ($scope) {
	var user_id = $$.request('id');
	$scope.saveUser = function () {
		if (!$$.validate.checkInputs($('#frmUser'))) return false;
		$$.ajax({
			method: 'saveUser',
			confirm: '提示：是否添加用户信息?',
			message: '用户添加完毕!',
			data: $$.json($scope.params),
			success: function (data) {
				$scope.params.user_id = data.user_id;
			}
		});
	};
	$scope.goback = function () {
		location.href = "lstuser";
	};
	$$.when(function () {
		if (!user_id) return;
		$$.ajax({
			type: 'get',
			method: 'getUser?user_id=' + user_id,
			success: function (data) {
				data.user_birthday = new Date(data.user_birthday).format('yyyy-MM-dd');
				$scope.params = data;
				$scope.$apply();
			}
		});
	}).then(function () {
		$('.datepicker').datepicker({
			"autoclose": true,
			"format": "yyyy-mm-dd",
			"language": "zh-CN"
		});
	});
});