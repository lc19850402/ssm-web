package com.ssm.basemode;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssm.utils.GuidUtils;

@Service
@Transactional
public class BaseServiceImpl implements BaseService {
	@Autowired
	public BaseDao userMapper;

	@Override
	public Map<String, Object> getUserinfoById(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean insertUser(Map<String, Object> userbean) {
		userbean.put("user_id", GuidUtils.generate());
		return userMapper.insert(userbean) > 0;
	}
}
