package com.dynatrace.se.bankjob.fibonacci;

import java.util.logging.Logger;

/******************************************************************************
 * Compilation: javac Fibonacci.java Execution: java Fibonacci n
 *
 * Computes and prints the first n Fibonacci numbers.
 *
 * WARNING: this program is spectacularly inefficient and is meant to illustrate
 * a performance bug, e.g., set n = 45.
 *
 *
 * % java Fibonacci 7 1: 1 2: 1 3: 2 4: 3 5: 5 6: 8 7: 13
 *
 * Remarks ------- - The 93rd Fibonacci number would overflow a long, but this
 * will take so long to compute with this function that we don't bother to check
 * for overflow. Copyright 2000-2017, Robert Sedgewick and Kevin Wayne. Last
 * updated: Fri Oct 20 14:12:12 EDT 2017.
 ******************************************************************************/

public class Fibonacci {
	private static Logger logger = Logger.getLogger(Fibonacci.class.getName());

	public static long fibonacci(int n) {
		if (n <= 1)
			return n;
		else
			return fibonacci(n - 1) + fibonacci(n - 2);
	}

	
	/**
	 * Main just for testing the Fibonnaci
	 * @param args
	 */
	public static void main(String[] args) {
		int n = 45;
		for (int i = 1; i <= n; i++)
			System.out.println(i + ": " + fibonacci(i));
	}

}
