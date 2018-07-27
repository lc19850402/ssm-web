package com.ssm.utils;

public class MVCResult<T> {
	/// <summary>
	/// 执行结果主体
	/// </summary>
	public T data;
	/// <summary>
	/// 反馈消息内容
	/// </summary>
	public String message;
	/// <summary>
	/// 执行结果状态
	/// </summary>
	public Boolean status;
	/// <summary>
	/// 其他附加内容
	/// </summary>
	public Object other;

	public MVCResult() {
	}

	public MVCResult(T data) {
		this.data = data;
		this.status = true;
		this.message = null;
		this.other = null;
	}

	public MVCResult(T data, Boolean status) {
		this.data = data;
		this.status = status;
		this.message = null;
		this.other = null;
	}

	public MVCResult(T data, Boolean status, String msg) {
		this.data = data;
		this.status = status;
		this.message = msg;
		this.other = null;
	}
	
	public MVCResult(T data, Boolean status, String msg,Object other) {
		this.data = data;
		this.status = status;
		this.message = msg;
		this.other = other;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public Object getOther() {
		return other;
	}

	public void setOther(Object other) {
		this.other = other;
	}

}

