package cn.com.ssm.utils.jdbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.ibatis.io.Resources;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

public class JdbcUtils {
	static Map<String, JdbcTemplate> hashMap = new HashMap<>();

	private JdbcUtils() {}

	static {
		String[] fileNames = { "jdbc.properties" };
		for (String fileName : fileNames) {
			try {
				Properties props = null;
				File file = new File("src/main/resources/" + fileName);
				if (file.exists()) {//如果能够找到配置文件，说明是本地代码测试
					InputStream in = new FileInputStream(file);
					props = new Properties();
					InputStreamReader inputStreamReader = new InputStreamReader(in, "utf-8");
					props.load(inputStreamReader);
				} else {//如果没有找到配置文件，说明是在服务器运行
					props = Resources.getResourceAsProperties(fileName);
				}
				String driver = props.getProperty("driver");
				String url = props.getProperty("url");
				String username = props.getProperty("username");
				String password = props.getProperty("password");
				DriverManagerDataSource dataSource = new DriverManagerDataSource();
				dataSource.setUrl(url);
				dataSource.setUsername(username);
				dataSource.setPassword(password);
				dataSource.setDriverClassName(driver);
				JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
				hashMap.put(fileName, jdbcTemplate);
			} catch (Exception e) {
				throw new ExceptionInInitializerError(e);
			}
		}
	}

	public static JdbcTemplate getJdbcTemplate(String props) {
		return hashMap.get(props);
	}
}
