package cn.com.ssm.utils;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;

import org.springframework.util.StringUtils;

public class Convert {
	public static String toString(Object o) {
		return toString(o, "");
	}

	public static String toUtf8(Object o) {
		String str = toString(o);
		try {
			return new String(str.getBytes("ISO-8859-1"), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			return str;
		}
	}

	public static String toString(Object o, String defValue) {
		if (o == null)
			return defValue;
		return o.toString();
	}

	public static boolean isEmpty(Object o) {
		if (o == null)
			return true;
		if (Convert.toString(o).equalsIgnoreCase("null"))
			return true;
		if (Convert.toString(o).equalsIgnoreCase("undefined"))
			return true;
		return StringUtils.isEmpty(o);
	}

	public static int toInt(Object o) {
		return toInt(o, 0);
	}

	public static int toInt(Object o, int defValue) {
		if (o == null)
			return defValue;
		if (o instanceof Integer)
			return ((Integer) o).intValue();
		try {
			return (int) Float.parseFloat(o.toString());
		} catch (Exception e) {
			return defValue;
		}
	}

	public static long toLong(Object o) {
		if (o == null)
			return 0L;
		if (o instanceof Long)
			return ((Long) o).longValue();
		try {
			return Long.parseLong(o.toString());
		} catch (Exception e) {
			return 0L;
		}
	}

	public static float toFloat(Object o) {
		if (o == null)
			return 0F;
		if (o instanceof Float)
			return ((Float) o).floatValue();
		try {
			return Float.parseFloat(o.toString());
		} catch (Exception e) {
			return 0F;
		}
	}

	public static boolean toBool(Object o) {
		if (o == null)
			return false;
		if (o instanceof Boolean)
			return ((Boolean) o).booleanValue();
		try {
			return Boolean.parseBoolean(o.toString());
		} catch (Exception e) {
			return false;
		}
	}

	public static Date toDate(Object o) {
		return toDate(o, new Date(System.currentTimeMillis()));
	}

	public static Date toDate(Object o, Date defValue) {
		if (o == null)
			return defValue;
		if (o instanceof java.util.Date)
			return (Date) o;
		try {
			return Timestamp.valueOf(o.toString());
		} catch (Exception e) {
			return defValue;
		}
	}

	@SuppressWarnings("unchecked")
	public static Map<String, Object> toMap(HttpServletRequest request) {
		Map<?, ?> properties = request.getParameterMap();
		// ∑µªÿ÷µMap
		Map<String, Object> returnMap = new HashMap<String, Object>();
		Iterator<?> entries = properties.entrySet().iterator();
		Map.Entry<String, Object> entry;
		String name = "";
		String value = "";
		while (entries.hasNext()) {
			entry = (Entry<String, Object>) entries.next();
			name = entry.getKey();
			Object valueObj = entry.getValue();
			if (null == valueObj) {
				value = "";
			} else if (valueObj instanceof String[]) {
				String[] values = (String[]) valueObj;
				for (int i = 0; i < values.length; i++) {
					value = values[i] + ",";
				}
				value = value.substring(0, value.length() - 1);
			} else {
				value = valueObj.toString();
			}
			returnMap.put(name, value);
		}
		return returnMap;
	}
}
