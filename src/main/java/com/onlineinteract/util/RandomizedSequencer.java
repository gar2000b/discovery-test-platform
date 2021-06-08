package com.onlineinteract.util;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * RandomizedSequencer retrieves a randomized next value for various data types.
 * 
 */
public class RandomizedSequencer {

	private static int maxInt = Integer.MAX_VALUE;

	private static long maxLong = 999999999999999L; // maximum value is 9999999999999999L

	/**
	 * Get a random Integer value.
	 * 
	 * @return a primitive int
	 */
	public static int nextIntValue() {
		return ThreadLocalRandom.current().nextInt(1, maxInt);
	}

	/**
	 * Get a random Long value.
	 * 
	 * @return a primitive long
	 */
	public static long nextLongValue() {
		return ThreadLocalRandom.current().nextLong(1, maxLong);
	}

	/**
	 * Get a random String GUID .
	 * 
	 * @return a GUID less the '-'
	 */
	public static String nextStringValue() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
}
