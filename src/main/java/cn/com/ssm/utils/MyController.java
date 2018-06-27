package cn.com.ssm.utils;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "utils")
public class MyController {
	@RequestMapping(value = "empty", method = { RequestMethod.POST })
	public @ResponseBody MVCResult<Boolean> empty() {
		return new MVCResult<Boolean>(true, true);
	}
}
