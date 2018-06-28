package junit4;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

import cn.com.ssm.utils.jdbc.MssqlJdbcBase;

public class MssqlJdbcBaseTest extends MssqlJdbcBase {
	@Before
	public void setUp() throws Exception {}

	@Test
	public void testQueryForListStringMapOfStringObject() {
		String sql = "select * from t_userinfo order by user_birthday";
		Map<String, Object> sqlParams = new HashMap<>();
		List<Map<String, Object>> list = super.queryForList(sql, sqlParams);
		assertTrue(list.size() != 0);
	}
}
