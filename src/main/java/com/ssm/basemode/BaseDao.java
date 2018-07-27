package com.ssm.basemode;

import java.util.List;
import java.util.Map;

import com.ssm.utils.MybatisDao;

@MybatisDao
public interface BaseDao {
	public int insert(Map<String, Object> user);

	public int delete(int id);

	public int update(Map<String, Object> user);

	public Map<String, Object> getUser(int id);

	public List<Map<String, Object>> getUsers();
}
