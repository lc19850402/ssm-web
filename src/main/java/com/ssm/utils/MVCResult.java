package com.ssm.utils;

public class MVCResult<T> {
	/// <summary>
	/// ִ�н������
	/// </summary>
	public T data;
	/// <summary>
	/// ������Ϣ����
	/// </summary>
	public String message;
	/// <summary>
	/// ִ�н��״̬
	/// </summary>
	public Boolean status;
	/// <summary>
	/// ������������
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

