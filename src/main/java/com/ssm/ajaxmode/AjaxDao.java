package com.ssm.ajaxmode;

import java.util.List;
import java.util.Map;

import com.ssm.utils.Pagination;

public interface AjaxDao {
	boolean checkUser(String userid);
	boolean insertUser(Map<String, Object> bean);
	boolean updateUser(Map<String, Object> bean);
	Map<String, Object> getUser(String user_id);
	List<Map<String, Object>> getUserList(Map<String, Object> params, Pagination pager);
}
