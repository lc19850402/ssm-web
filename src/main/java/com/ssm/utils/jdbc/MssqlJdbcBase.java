package com.ssm.utils.jdbc;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;

import com.ssm.utils.Convert;
import com.ssm.utils.Pagination;

public abstract class MssqlJdbcBase {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	//protected abstract String getProps();
	private String getProps() {
		return "jdbc.properties";
	}
	/**
	 * �ж��ַ�����sql����Ǵ洢����
	 */
	static Pattern r_callpro = Pattern.compile("\\{\\s*call[^{}]+\\}");
	/**
	 * ��ȡ��ѯ��������order by ����
	 */
	static Pattern r_orderby = Pattern.compile("(?is)(?<!\\()\\s+order\\s+by\\s+[^)]*$");	
	/**
	 * ��ȡ��ѯ��������select from����
	 */
	static Pattern r_selectfrom = Pattern.compile("(?is)\\b(?:select|from)\\b");
	/**
	 * ��ȡ������Ϣ��sql���
	 */
	static Pattern r_sqlgrammar = Pattern.compile("(?is)(?<=^.{0,100}\\[).+(?=\\])");
	public MssqlJdbcBase() {
		if (jdbcTemplate == null) {
			jdbcTemplate = JdbcUtils.getJdbcTemplate(getProps());
		}
	}
	/**
	 * @param ����SQL���
	 *            or ���ô洢�������
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @return ����Ӱ������
	 */
	public int update(String callString, Map<String, Object> sqlParams) {
		int result = 0;
		try {
			final Object[] sqlArgs = getObjectParams(callString, sqlParams);
			callString = getSqlcommand(callString);
			if (!isCallString(callString)) {
				result = jdbcTemplate.update(callString, sqlArgs);
			}
			else {
				result = jdbcTemplate.execute(callString, new CallableStatementCallback<Integer>() {
					@Override
					public Integer doInCallableStatement(CallableStatement call)
							throws SQLException, DataAccessException {
						for (int i = 0; i < sqlArgs.length; i++) {
							call.setObject(i + 1, sqlArgs[i]);
						}
						return call.executeUpdate();
					}
				});
			}
		} catch (Exception ex) {
			logger(ex.getMessage(), sqlParams);
			throw ex;
		}
		return result;
	}
	/**
	 * @param ��ѯSQL���
	 *            or ���ô洢�������
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @return Map���
	 */
	public Map<String, Object> queryForMap(String callString, Map<String, Object> sqlParams) {
		List<Map<String, Object>> list = this.queryForList(callString, sqlParams);
		if (list != null && list.size() != 0) {
			return list.get(0);
		} else {
			return null;
		}
	}
	/**
	 * @param ��ѯSQL���
	 *            or ���ô洢�������
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @return Map����
	 */
	public List<Map<String, Object>> queryForList(String callString, Map<String, Object> sqlParams) {
		List<Map<String, Object>> result = null;
		try {
			final Object[] sqlArgs = getObjectParams(callString, sqlParams);
			callString = getSqlcommand(callString);
			if (!isCallString(callString)) {
				callString = getSqlcommandRownumber(callString);
				result = jdbcTemplate.queryForList(callString, sqlArgs);
			} else {
				result = jdbcTemplate.execute(callString, new CallableStatementCallback<List<Map<String, Object>>>() {
					@Override
					public List<Map<String, Object>> doInCallableStatement(CallableStatement call)
							throws SQLException, DataAccessException {
						for (int i = 0; i < sqlArgs.length; i++) {
							call.setObject(i + 1, sqlArgs[i]);
						}
						ResultSet result = call.executeQuery();
						return loopResultset(result);
					}
				});
			}
		} catch (Exception ex) {
			logger(ex.getMessage(), sqlParams);
			throw ex;
		}
		return result;
	}
	/**
	 * @param ��ѯSQL���
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @param ��ҳ��Ϣ
	 * @return ��ҳMap����
	 */
	public List<Map<String, Object>> queryForList(String sqlCommand, Map<String, Object> sqlParams, Pagination pager) {
		List<Map<String, Object>> result = null;
		String sqlCount = "", sqlPager = "";
		try {
			Object[] sqlArgs = getObjectParams(sqlCommand, sqlParams);
			sqlCommand = getSqlcommand(sqlCommand);
			sqlCount = getCountSqlcommand(sqlCommand);
			sqlPager = getPageSqlCommand(sqlCommand, pager);
			int count = jdbcTemplate.queryForObject(sqlCount, sqlArgs, Integer.class);
			pager.setTotalCount(count);
			pager.setTotalPages(count / pager.getPageSize() + count % pager.getPageSize() == 0 ? 0 : 1);
			result = jdbcTemplate.queryForList(sqlPager, sqlArgs);
		} catch (Exception ex) {
			logger(ex.getMessage(), sqlParams);
			throw ex;
		}
		return result;
	}
	/**
	 * @param ��ѯSQL���
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @param ����List�����������
	 * @return
	 */
	public <T> List<T> query(String sqlCommand, Map<String, Object> sqlParams, Class<T> tClass) {
		List<T> result = null;
		try {
			Object[] sqlArgs = getObjectParams(sqlCommand, sqlParams);
			sqlCommand = getSqlcommand(sqlCommand);
			sqlCommand = getSqlcommandRownumber(sqlCommand);
			result = jdbcTemplate.query(sqlCommand, sqlArgs, new BeanPropertyRowMapper<T>(tClass));
		} catch (Exception ex) {
			logger(ex.getMessage(), sqlParams);
			throw ex;
		}
		return result;
	}
	/**
	 * @param ��ѯSQL���
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @param ��ҳ��Ϣ
	 * @param ����List�����������
	 * @return ��ҳ�����
	 */
	public <T> List<T> query(String sqlCommand, Map<String, Object> sqlParams, Pagination pager, Class<T> tClass) {
		List<T> result = null;
		try {
			Object[] sqlArgs = getObjectParams(sqlCommand, sqlParams);
			sqlCommand = getSqlcommand(sqlCommand);
			String sqlCount = getCountSqlcommand(sqlCommand);
			String sqlPager = getPageSqlCommand(sqlCommand, pager);
			int count = jdbcTemplate.queryForObject(sqlCount, sqlArgs, Integer.class);
			pager.setTotalCount(count);
			pager.setTotalPages(count / pager.getPageSize() + count % pager.getPageSize() == 0 ? 0 : 1);
			result = jdbcTemplate.query(sqlPager, sqlArgs, new BeanPropertyRowMapper<T>(tClass));
		} catch (Exception ex) {
			logger(ex.getMessage(), sqlParams);
			throw ex;
		}
		return result;
	}
	/**
	 * @param ��ѯSQL���
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @param ���ض��������
	 * @return ʵ�����
	 */
	public <T> T queryForObject(String sqlCommand, Map<String, Object> sqlParams, Class<T> tClass) {
		List<T> list = this.query(sqlCommand, sqlParams, tClass);
		if (list != null && !list.isEmpty()) {
			return list.get(0);
		} else {
			return null;
		}
	}
	/**
	 * @param ��ѯSQL���
	 * @param �����Ĳ�������
	 *            Map��keyֵ�Ͳ�ѯ���ı�������Ӧ
	 * @param ����ֵ������
	 * @return ��ֵ
	 */
	public <T> T queryForValue(String sqlCommand, Map<String, Object> sqlParams, Class<T> tClass) {
		T result = null;
		try {
			Object[] sqlArgs = getObjectParams(sqlCommand, sqlParams);
			sqlCommand = getSqlcommand(sqlCommand);
			result = jdbcTemplate.queryForObject(sqlCommand, sqlArgs, tClass);
		} catch (EmptyResultDataAccessException ex) {
			return result;
		} catch (Exception ex) {
			logger(ex.getMessage(), sqlParams);
			throw ex;
		}
		return result;
	}
	private boolean isCallString(String sqlCommand) {
		return r_callpro.matcher(sqlCommand).find();
	}
	private List<Map<String, Object>> loopResultset(ResultSet rs) throws SQLException {
		List<Map<String, Object>> list = new ArrayList<>();
		try {
			ResultSetMetaData rsmd = rs.getMetaData();
			while (rs.next()) {
				Map<String, Object> hashMap = new HashMap<>();
				int columnCount = rsmd.getColumnCount();
				for (int i = 0; i < columnCount; i++) {
					hashMap.put(rsmd.getColumnName(i + 1), rs.getObject(i + 1));
				}
				list.add(hashMap);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	private String getSqlcommandRownumber(String sqlCommand) {
		String s_orderby = "order by (select 0)";
		Matcher m_orderby = r_orderby.matcher(sqlCommand);
		if (m_orderby.find()) {// ��ȡorderby ���֣�����ԭ��ѯ���orderby�Ƴ�
			s_orderby = m_orderby.group();
			s_orderby = s_orderby.replaceAll("\\w+(\\.\\w+)", "myjdbc$1");
			sqlCommand = m_orderby.replaceFirst("");
		}
		return String.format("select myjdbc.*,row_number() over (%s) row_num from (%s) myjdbc", s_orderby, sqlCommand);
	}
	private String getSqlcommand(String sqlCommand) {
		if (sqlCommand.isEmpty())
			return sqlCommand;
		return sqlCommand.replaceAll(":\\w+", "?");
	}
	private String getPageSqlCommand(String sqlCommand, Pagination pager) {
		String s_orderby = "order by (select 0)";
		Matcher m_orderby = r_orderby.matcher(sqlCommand);
		if (m_orderby.find()) {// ��ȡorderby ���֣�����ԭ��ѯ���orderby�Ƴ�
			s_orderby = m_orderby.group();
			s_orderby = s_orderby.replaceAll("\\w+(\\.\\w+)", "myjdbc$1");
			sqlCommand = m_orderby.replaceFirst("");
		}
		return MessageFormat.format(";with myjdbc as ({0}) "
				+ " select * from (select *, row_number() over({1}) row_num from myjdbc) t  "
				+ " where t.row_num > ({2} - 1) * {3} and t.row_num <= {2} * {3} "
				, sqlCommand, s_orderby, Convert.toString(pager.getPageNum()), Convert.toString(pager.getPageSize()));
	}
	private String getCountSqlcommand(String sqlCommand) {	
		Matcher matcher = r_selectfrom.matcher(sqlCommand);
		int count = 0;
		int index = 0;
		/* select���ִ���Ƕ��select�����
		 * ����select��from�ɶԳ���
		 * ��¼select��from�ĸ���
		 * ����select +1 ����from -1
		 * ����ǡ��Ϊ0ʱ  ����Ҫ��ȡ��from*/
		while (matcher.find()) {
			String str = matcher.group();
			if (str.equalsIgnoreCase("select")) {
				count++;
			} else {
				count--;
			}
			if (count == 0) {
				index = matcher.start();
				break;
			}
		}
		sqlCommand = sqlCommand.substring(index);
		Matcher m_orderby = r_orderby.matcher(sqlCommand);
		sqlCommand = m_orderby.find() ? m_orderby.replaceFirst("") : sqlCommand;
		return "select count(1) from (select 1 as cnt " + sqlCommand + ") myjdbc";
	}
	private void logger(String sql, Map<String, Object> params) {
		Matcher regexMatcher = r_sqlgrammar.matcher(sql);
		if (regexMatcher.find()) {
			sql = regexMatcher.group();
		}
		logger.error("\r\nbad SQL grammar: \r\n{}\r\nparams: {}",
				sql.replaceAll("(?<!\t)\t", "\r\n"), params.toString());
	}
	private Object[] getObjectParams(String sqlCommand, Map<String, Object> sqlParams) {
		List<String> matchList = new ArrayList<String>();
		try {
			Pattern regex = Pattern.compile("(?<=:)\\w+");
			Matcher regexMatcher = regex.matcher(sqlCommand);
			while (regexMatcher.find()) {
				matchList.add(regexMatcher.group());
			}
			Object[] objectParams = new Object[matchList.size()];
			int index = 0;
			for (String match : matchList) {
				if (sqlParams.containsKey(match)) {
					objectParams[index++] = sqlParams.get(match);
				} else {
					objectParams[index++] = null;
					// throw new Exception("����������δ�ҵ�[" + match + "]�Ĳ���ֵ");
				}
			}
			return objectParams;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new Object[0];
	}
}
