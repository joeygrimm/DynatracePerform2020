package com.dynatrace.se.bankjob.business;

import java.lang.Exception;

/**
 * A custom Exception sample
 */
public class BankBusinessException extends Exception {
    private static final long serialVersionUID = 1L;

    public BankBusinessException() {
        super();
    }

    public BankBusinessException(final String s) {
        super(s);
    }
    
    public BankBusinessException(java.lang.String arg0, java.lang.Throwable arg1) {
        super(arg0, arg1);
    }
    
    public BankBusinessException(java.lang.Throwable arg0) {
        super(arg0);
    }
}