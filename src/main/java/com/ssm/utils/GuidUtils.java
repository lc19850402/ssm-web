package com.ssm.utils;

import java.util.UUID;

public class GuidUtils {
	/**
	 * ��������ַ���
	 * 
	 * @return
	 */
	public static String generate() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString().replaceAll("-", "");
	}
}
