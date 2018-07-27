package com.ssm.basemode;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssm.utils.Convert;
import com.ssm.utils.RequestUtils;

@Controller
@RequestMapping("basemode")
public class BaseController {
	@Autowired
	private BaseService userService;

	@RequestMapping("adduser")
	public String adduser_view() {
		return "basemode/adduser";
	}

	@RequestMapping(value = "insertUser")
	public String insertUser(HttpServletRequest request, Model model) {
		//判断是否是回传事件（浏览器后退、前进、刷新等操作）
		if (!RequestUtils.isPostback(request)) {
			Map<String, Object> userBean = Convert.toMap(request);
			if (!Convert.isEmpty(userBean.get("user_name")) && userService.insertUser(userBean)) {
				model.addAttribute("userBean", userBean);
				model.addAttribute("status", true);
			} else {
				System.out.println("保存失败");
				model.addAttribute("error_info", "信息：姓名不能为空");
				model.addAttribute("status", false);
			}
		}
		return "basemode/adduser";
	}
}
