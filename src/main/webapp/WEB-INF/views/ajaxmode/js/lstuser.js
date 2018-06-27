angular.module('app', []).controller('ctrl', function ($scope) {
	$scope.params = {
		pager: {
			pageNum: 1,
			pageSize: 10,
			totalCount: 0,
			totalPages: 1
		}
	};
	$scope.gotoitem = function (row) {
		location.href = 'adduser?id=' + row.user_id;
	};
	$scope.getclass = function (row) {
		if (row.user_age <= 20) {
			return 'label label-success';
		} else if (row.user_age > 20 && row.user_age <= 40) {
			return 'label label-primary';
		} else if (row.user_age > 40 && row.user_age <= 60) {
			return 'label label-warning';
		} else {
			return 'label label-danger';
		}
	};
	$scope.query = function (first) {
		if (first) {
			$scope.params.pager.pageNum = 1;
		}
		$$.ajax({
			method: 'getUserList',
			data: $$.json($scope.params),
			load: true,
			success: function (data, result) {
				$scope.rows = result.data;
				if (first) {// 如果是查询逻辑，则重新初始化分页
					$("#page-nav").pager({
						size: $scope.params.pager.pageSize,
						totle: result.other,
						onchange: function (index, size) {
							$scope.params.pager.pageNum = index;
							$scope.params.pager.pageSize = size;
							$scope.query();// 翻页逻辑不需要重新初始化分页
						}
					});
				}
				$scope.$apply();
			}
		});
	};
	$$.when().then(function () {
		$scope.query(true);
	});
});