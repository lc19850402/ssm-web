package com.ssm.utils;

import java.util.UUID;

public class GuidUtils {
	/**
	 * ²úÉúËæ»ú×Ö·û´®
	 * 
	 * @return
	 */
	public static String generate() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString().replaceAll("-", "");
	}
}
