package com.ssm.utils;

import java.util.HashMap;

public class MVCParams extends HashMap<String, Object> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@SuppressWarnings("unchecked")
	public <T> T getValue(String key, T defaultVal) {
		if (this.containsKey(key)) {
			return (T) this.get(key);
		}
		return defaultVal;
	}

	public MVCParams setValue(String key, Object value) {
		if (this.containsKey(key)) {
			this.put(key, value);
		}
		return this;
	}

	public MVCParams append(String key, Object value) {
		this.remove(key);
		this.put(key, value);
		return this;
	}
}
