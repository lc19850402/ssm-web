package com.ssm.utils;

public class Pagination {
	private int pageNum = 1;
	  private int pageSize = 10;
	  private long totalCount = 0L;
	  private int totalPages = 1;
	  
	  public Pagination() {}
	  
	  public Pagination(int pageSize)
	  {
	    this.pageSize = pageSize;
	  }
	  
	  public int getPageNum()
	  {
	    return this.pageNum;
	  }
	  
	  public void setPageNum(int pageNum)
	  {
	    this.pageNum = pageNum;
	  }
	  
	  public int getPageSize()
	  {
	    return this.pageSize;
	  }
	  
	  public void setPageSize(int pageSize)
	  {
	    this.pageSize = pageSize;
	  }
	  
	  public long getTotalCount()
	  {
	    return this.totalCount;
	  }
	  
	  public void setTotalCount(long totalCount)
	  {
	    this.totalCount = totalCount;
	  }
	  
	  public int getTotalPages()
	  {
	    return this.totalPages;
	  }
	  
	  public void setTotalPages(int totalPages)
	  {
	    this.totalPages = totalPages;
	  }
}
