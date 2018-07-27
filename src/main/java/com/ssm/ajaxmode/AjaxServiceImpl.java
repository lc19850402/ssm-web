package com.ssm.ajaxmode;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssm.utils.Convert;
import com.ssm.utils.GuidUtils;
import com.ssm.utils.Pagination;

@Service
public class AjaxServiceImpl implements AjaxService {
	@Autowired
	private AjaxDao ajaxDaoImpl;

	@Override
	public Map<String, Object> saveUser(Map<String, Object> bean) {
		if (ajaxDaoImpl.checkUser(Convert.toString(bean.get("user_id")))) {
			if (Convert.isEmpty(bean.get("user_id")))
				bean.put("user_id", GuidUtils.generate());
			if (ajaxDaoImpl.insertUser(bean)) {
				return bean;
			}
		} else {
			if (ajaxDaoImpl.updateUser(bean)) {
				return bean;
			}
		}
		return null;
	}

	@Override
	public Map<String, Object> getUser(String user_id) {
		return ajaxDaoImpl.getUser(user_id);
	}

	@Override
	public List<Map<String, Object>> getUserList(Map<String, Object> params, Pagination pager) {
		return ajaxDaoImpl.getUserList(params, pager);
	}
}
