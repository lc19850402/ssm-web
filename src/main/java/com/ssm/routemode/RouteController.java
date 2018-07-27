package com.ssm.routemode;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.ssm.ajaxmode.AjaxService;
import com.ssm.utils.Convert;
import com.ssm.utils.MVCParams;
import com.ssm.utils.MVCResult;
import com.ssm.utils.Pagination;

@Controller
@RequestMapping("routemode")
public class RouteController {
	@Autowired
	private AjaxService ajaxServiceImpl;

	@RequestMapping("lstuser")
	public String lstuser_view() {
		return "routemode/lstuser";
	}
	@RequestMapping("adduser")
	public String adduser_view() {
		return "routemode/adduser";
	}
	@RequestMapping(value = "saveUser", method = { RequestMethod.POST })
	public @ResponseBody MVCResult<Map<String, Object>> saveUser(@RequestBody MVCParams bean) {
		Map<String, Object> result = ajaxServiceImpl.saveUser(bean);
		return new MVCResult<>(result, result != null);
	}
	@RequestMapping(value = "getUser", method = { RequestMethod.GET })
	public @ResponseBody MVCResult<Map<String, Object>> getUser(String user_id) {
		Map<String, Object> bean = ajaxServiceImpl.getUser(user_id);
		return new MVCResult<>(bean, bean != null);
	}
	@RequestMapping(value = "getUserList", method = { RequestMethod.POST })
	public @ResponseBody MVCResult<List<Map<String, Object>>> getUserList(@RequestBody MVCParams params) {
		Pagination pager = null;
		if (!Convert.isEmpty(params.get("pager")))
			pager = JSON.parseObject(JSON.toJSONString(params.get("pager")), Pagination.class);
		List<Map<String, Object>> list = ajaxServiceImpl.getUserList(params, pager);
		return new MVCResult<>(list, list != null, "", pager != null ? pager.getTotalCount() : null);
	}
}
