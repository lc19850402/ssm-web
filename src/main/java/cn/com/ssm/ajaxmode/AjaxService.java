package cn.com.ssm.ajaxmode;

import java.util.List;
import java.util.Map;

import cn.com.ssm.utils.Pagination;

public interface AjaxService {
	Map<String, Object> getUser(String user_id);
	Map<String, Object> saveUser(Map<String, Object> bean);
	List<Map<String, Object>> getUserList(Map<String, Object> params, Pagination pager);
}
