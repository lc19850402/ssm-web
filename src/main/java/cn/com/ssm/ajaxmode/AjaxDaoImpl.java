package cn.com.ssm.ajaxmode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import cn.com.ssm.utils.Convert;
import cn.com.ssm.utils.Pagination;
import cn.com.ssm.utils.jdbc.MssqlJdbcBase;

@Repository
public class AjaxDaoImpl extends MssqlJdbcBase implements AjaxDao {
	@Override
	public boolean insertUser(Map<String, Object> bean) {
		String sql = "insert into t_userinfo "
				+ "	(user_id,user_name,user_age,user_sex,user_birthday,user_address)"
				+ "	values (:user_id,:user_name,:user_age,:user_sex,:user_birthday,:user_address)";
		return super.update(sql, bean) > 0;
	}
	@Override
	public List<Map<String, Object>> getUserList(Map<String, Object> params, Pagination pager) {
		String sql = "select * from t_userinfo where 1=1";
		if (!Convert.isEmpty(params.get("user_name")))
			sql += " and user_name like concat('%',:user_name,'%')";
		if (!Convert.isEmpty(params.get("user_sex")))
			sql += " and user_sex=:user_sex";
		return super.queryForList(sql, params, pager);
	}
	@Override
	public boolean checkUser(String userid) {
		if (Convert.isEmpty(userid))
			return true;
		String sql = "select count(1) from t_userinfo where user_id='" + userid + "'";
		int result = super.queryForValue(sql, null, Integer.class);
		return result == 0;
	}
	@Override
	public boolean updateUser(Map<String, Object> bean) {
		String sql = "update t_userinfo set "
				+ "	user_name=:user_name,"
				+ "	user_age=:user_age,"
				+ "	user_sex=:user_sex,"
				+ "	user_birthday=:user_birthday,"
				+ "	user_address=:user_address where user_id=:user_id";
		return super.update(sql, bean) > 0;
	}
	@Override
	public Map<String, Object> getUser(String user_id) {
		Map<String, Object> sqlParams = new HashMap<>();
		sqlParams.put("user_id", user_id);
		String sql = "select * from t_userinfo where user_id=:user_id";
		return super.queryForMap(sql, sqlParams);
	}
}
