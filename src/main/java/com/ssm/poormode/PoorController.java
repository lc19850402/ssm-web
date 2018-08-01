package com.ssm.poormode;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("poormode")
public class PoorController {
	@RequestMapping("lstuser")
	public String lstuser_view() {
		return "poormode/lstuser";
	}
}
