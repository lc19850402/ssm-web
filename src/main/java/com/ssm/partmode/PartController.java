package com.ssm.partmode;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("partmode")
public class PartController {
	@RequestMapping("lstuser")
	public String lstuser_view() {
		return "partmode/lstuser";
	}
	@RequestMapping("adduser")
	public String adduser_view() {
		return "partmode/parts/adduser";
	}
}
