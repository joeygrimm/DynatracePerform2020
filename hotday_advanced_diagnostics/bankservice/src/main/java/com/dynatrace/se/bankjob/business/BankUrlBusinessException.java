package com.dynatrace.se.bankjob.business;

import java.lang.Exception;

/**
 * A custom Exception sample
 */
public class BankUrlBusinessException extends Exception {
    private static final long serialVersionUID = 1L;

    public BankUrlBusinessException() {
        super();
    }

    public BankUrlBusinessException(String s) {
        super(s);
    }
    public BankUrlBusinessException(java.lang.String arg0, java.lang.Throwable arg1) {
        super(arg0, arg1);
    }
    
    public BankUrlBusinessException(java.lang.Throwable arg0) {
        super(arg0);
    }
}