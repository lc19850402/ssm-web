package cn.com.ssm.utils;

import javax.servlet.http.HttpServletRequest;

public class RequestUtils {
	public static boolean isPostback(HttpServletRequest request) {
		String f1 = Convert.toString(request.getParameter("pageflag"), "");
		String f2 = Convert.toString(request.getSession().getAttribute("pageflag"), "");
		request.getSession().removeAttribute("pageflag");
		return !f1.equals(f2);
	}
}
