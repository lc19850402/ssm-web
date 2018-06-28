package cn.com.ssm.basemode;

import java.util.Map;

public interface BaseService {
	public boolean insertUser(Map<String, Object> userbean);

	public Map<String, Object> getUserinfoById(int id);
}
