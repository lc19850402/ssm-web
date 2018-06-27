/**
 * ajax pager create by liuchen
 */
jQuery.fn.pager = function(options) {
	var opts = $.extend({}, {
		$render : this,
		size : 0,
		totle : 0,
		index : 1,
		onchange : function() {},
	}, options);
	var min_num = 1, max_len = 5, page_count = 1, change_len = 0;
	var $parent = null, $current = null, $pre = null, $next = null, $head = null, $last = null, $input = null;
	_initPager();
	function _initPager() {
		page_count = parseInt(opts.totle / opts.size);
		if (opts.totle % opts.size != 0) {
			page_count += 1;
		}
		if (page_count <= 0) {
			page_count = 1;
		}
		if (opts.index < 1) {
			opts.index = 1;
		} else if (opts.index > page_count) {
			opts.index = page_count;
		}
		// 普通页码的最大个数，起始页算法限制，不能小于3
		if (max_len < 3) {
			max_len = 3;
		}
		// 跳转页响应长度，用于计算起始页码
		if (max_len >= 8) {
			change_len = 3;
		} else if (max_len >= 5) {
			change_len = 2;
		} else {
			change_len = 1;
		}
		builder();
	}
	function builder() {
		opts.$render.hide();
		var htmlArr = [];
		htmlArr.push('<nav><ul class="pagination" style="display: inline-flex;">');
		htmlArr.push('<li style="float: left\9;">\
	                        <select class="form-control" id="sel_page_size" style="padding-top:3px;height:32px;">\
		                        <option value=10 selected>10条</option>\
		                        <option value=20>20条</option>\
		                        <option value=50>50条</option>\
		                        <option value=100>100条</option>\
	                        </select>\
                        </li>\
                        <li class="disabled">\
	                        <a class="text-center" style="min-width: 80px;">'
						+ opts.index + '/' + page_count + '&nbsp;共' + opts.totle + '条</a></li>');
		htmlArr.push('<li class="first-page" pindex="1"><span>首</span></li>');
		htmlArr.push('<li class="pre-page"  pindex="' + (opts.index - 1) + '"><span><</span></li>');
		htmlArr.push('<li class="next-page" pindex="' + (opts.index + 1) + '"><span>></span></li>');
		htmlArr.push('<li class="last-page" pindex="' + page_count + '"><span>末</span></li>');
		htmlArr
				.push('<li><div class="input-group input-mini margin-left-10" style="margin-left:-1px">\
                          <input type="text" class="form-control" value="' + opts.index + '" style="width:60px;height:32px;"/>\
                          <span class="input-group-btn">\
                          	<button type="button" onfocus="this.blur();" class="btn blue btn-goto" style="height:32px;">跳转</button>\
                          </span></div></li>');
		htmlArr.push('</ul></nav>');
		opts.$render.html(htmlArr.join(''));
		// 初始化变量
		$parent = opts.$render.children().children();
		$head = $parent.children("li.first-page").css('cursor', 'pointer');
		$pre = $parent.children("li.pre-page").css('cursor', 'pointer');
		$next = $parent.children("li.next-page").css('cursor', 'pointer');
		$last = $parent.children("li.last-page").css('cursor', 'pointer');
		$input = $parent.find("div.input-group>input");
		$parent.find("div.input-group button:first").click(function() {
			goto_pager($input.val());
		});
		// 初始化功能按钮
		button_toggle(opts.index);
		// 生成普通页码
		numpage_builder(get_startnum(opts.index), opts.index);
		// 绑定点击事件
		$parent.on("click", "li", function() {
			var $this = $(this);
			if ($this.is("li") && $this.attr("pindex")) {
				if (!$this.hasClass("disabled") && !$this.hasClass("active")) {
					goto_pager($this.attr("pindex"));
				}
			}
		});
		opts.$render.find('#sel_page_size').val(opts.size).change(function() {
			opts.index = 1;
			opts.size = $(this).val();
			_initPager();
			opts.onchange(opts.index, opts.size);
		});
		opts.$render.show();
	}
	// 跳转到页码
	function goto_pager(page_index) {
		page_index = format_num(page_index);
		if (page_index == 0 || page_index == opts.index) return false;
		// 修改值
		opts.index = page_index;
		$input.val(page_index);
		$pre.attr("pindex", page_index - 1);
		$next.attr("pindex", page_index + 1);
		// 修改功能按钮的状态
		button_toggle(page_index);
		// 计算起始页码
		var starNum = get_startnum(page_index);
		if (starNum == min_num) {// 要显示的页码是相同的
			$current.removeClass("active");
			$current = $parent.children("li.commonpage").eq(page_index - min_num).addClass("active blue");
		} else {// 需要刷新页码
			numpage_builder(starNum, page_index);
		}
		opts.onchange(page_index, opts.size);
	}
	// 整理目标页码的值
	function format_num(num) {
		num = Number(num);
		if (isNaN(num)) num = 0;
		else if (num <= 0) num = 1;
		else if (num > page_count) num = page_count;
		return num;
	}
	// 功能按钮的开启与关闭
	function button_toggle(current) {
		if (current == 1) {
			$head.addClass("disabled");
			$pre.addClass("disabled");
		} else {
			$head.removeClass("disabled");
			$pre.removeClass("disabled");
		}
		if (current == page_count) {
			$next.addClass("disabled");
			$last.addClass("disabled");
		} else {
			$next.removeClass("disabled");
			$last.removeClass("disabled");
		}
	}
	// 计算当前显示的起始页码
	function get_startnum(page_index) {
		var start_num;
		if (page_count <= max_len) start_num = 1;
		else {
			if ((page_index - min_num) >= (max_len - change_len)) {// 跳转到靠后的页码
				start_num = page_index - change_len;
				if ((start_num + max_len - 1) > page_count) start_num = page_count - (max_len - 1);// 边界修正
			} else if ((page_index - min_num) <= (change_len - 1)) {// 跳转到靠前的页码
				start_num = page_index - (max_len - change_len - 1);
				if (start_num <= 0) start_num = 1;// 边界修正
			} else {// 不用改变页码
				start_num = min_num;
			}
		}
		return start_num;
	}
	// 生成普通页码
	function numpage_builder(start_num, active_num) {
		var htmlArr = [];
		for (var i = 1, page_num = start_num; i <= page_count && i <= max_len; i++, page_num++) {
			htmlArr.push('<li class="commonpage" pindex="' + page_num + '"><a onfocus="this.blur();">' + page_num + '</a></li>');
		}
		$parent.hide();
		$parent.children("li.commonpage").remove();
		if (true) $pre.after(htmlArr.join(""));
		else if (true) $head.after(htmlArr.join(""));
		else $parent.prepend(htmlArr.join(""));
		min_num = start_num;
		$current = $parent.children("li.commonpage").eq(active_num - start_num).addClass("active");
		$parent.show();
	}
};