package com.dynatrace.se.bankjob.util;

import java.util.List;
import java.util.Random;

public class Helper {

	public Helper() {
	}
	
	/**
	 * It will get a random element depending the size of the list.
	 * 
	 * @param list
	 * @return
	 */
	public static String getRandomElement(List<String> list) {
		return list.get(getRandomNumberInRange(0, list.size() - 1));
	}

	/**
	 * Generate Random Number
	 * 
	 * @param min
	 * @param max
	 * @return
	 */
	public static int getRandomNumberInRange(int min, int max) {
		Random r = new Random();
		return r.nextInt((max - min) + 1) + min;
	}

}
