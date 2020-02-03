package com.dynatrace.se.bankjob.data;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.logging.LogManager;
import java.util.logging.Logger;

import com.dynatrace.se.bankjob.runner.BankTask;
import com.dynatrace.se.bankjob.util.Job;

public class BankData {
	public static List<String> urls;
	public static List<String> banks;
	public static List<String> jobs;
	private static final String CONF_DIR = "conf/";
	private static final String LOG_DIR = "log/";
	private static final String CONFIG_PROPERTIES = "bankjob.properties";
	private static final String LOGGER_PROPERTIES = "logger.properties";
	private Properties properties;
	private static Logger logger = Logger.getLogger(BankTask.class.getName());

	/**
	 * Singleton
	 */
	private static BankData instance;
	public int threads;
	public int failurerate;
	public int sleepTime;
	public int minfibbonacci;
	public int maxfibbonacci;

	public static BankData getInstance() {
		if (BankData.instance == null) {
			BankData.instance = new BankData();
		}
		return BankData.instance;
	}

	private BankData() {

		// Initiate
		urls = new ArrayList<String>();
		banks = new ArrayList<String>();

		initLoger();
		loadProperties();

		// Fill in Jobnames
		jobs = new ArrayList<String>();
		for (Job j : Job.values()) {
			jobs.add(j.getText());
		}

	}

	private void loadProperties() {
		try {
			FileInputStream input = new FileInputStream(getFileFromConf(CONFIG_PROPERTIES));
			properties = new Properties();
			properties.load(input);

			String url = properties.getProperty("urls");
			if (url != null) {
				urls.addAll(Arrays.asList(url.split("\\s*,\\s*")));
			}

			String bank = properties.getProperty("banks");
			if (bank != null) {
				banks.addAll(Arrays.asList(bank.split(",")));
			}

			String f = properties.getProperty("failurerate");
			if (f != null) {
				failurerate = Integer.valueOf(f);
			}
			String fmax = properties.getProperty("maxfibbonacci");
			if (fmax != null) {
				maxfibbonacci = Integer.valueOf(fmax);
			}
			String fmin = properties.getProperty("minfibbonacci");
			if (fmin != null) {
				minfibbonacci = Integer.valueOf(fmin);
			}
			String t = properties.getProperty("threads");
			if (t != null) {
				threads = Integer.valueOf(t);
			}
			String s = properties.getProperty("sleeptime");
			if (s != null) {
				sleepTime = Integer.valueOf(s);
			}

			logger.fine("Properties loaded:" + properties.toString());

		} catch (Exception e) {
			logger.severe("Properties could not be loaded: " + e.getMessage());
			e.printStackTrace();
		}

	}

	public static void initLoger() {
		try {
			FileInputStream inStream = new FileInputStream(getFileFromConf(LOGGER_PROPERTIES));
			createLogFolderIfNotExists();
			LogManager.getLogManager().readConfiguration(inStream);
			logger.info("Logger initialized");
		} catch (Exception e) {
			logger.severe("Problem initializing log" + e.getMessage());
		}
	}

	/**
	 * 
	 */
	public static void createLogFolderIfNotExists() {
		createFolderIfNotExists(LOG_DIR);
	}

	public static void createFolderIfNotExists(String logPath) {
		File file = null;
		String absolutePath = null;
		Class<?> referenceClass = BankData.class;
		URL url = referenceClass.getProtectionDomain().getCodeSource().getLocation();

		try {
			// Get the parent directory
			File CLASSPATH = new File(url.toURI()).getParentFile();
			// get the file from where the jar is located.
			absolutePath = CLASSPATH.getAbsolutePath() + "/" + logPath;
			file = new File(absolutePath);
			if (!file.exists()) {
				file.mkdirs();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Will look for a file in the conf directory next where this class/jar is being
	 * located. If not found as default solution the file will be looked in a conf
	 * directory relative to the Java execution.
	 * 
	 * @param file
	 * @return
	 * @throws FileNotFoundException
	 */
	public static File getFileFromConf(String filename) throws FileNotFoundException {
		return getFileFrom(filename, CONF_DIR);
	}

	/**
	 * Will look for a file in the conf directory next where this class/jar is being
	 * located. If not found as default solution the file will be looked in a conf
	 * directory relative to the Java execution.
	 * 
	 * @param file
	 * @return
	 * @throws FileNotFoundException
	 */
	public static File getFileFrom(String filename, String directory) {
		File file = null;
		String absolutePath = null;
		Class<?> referenceClass = BankData.class;
		URL url = referenceClass.getProtectionDomain().getCodeSource().getLocation();

		try {
			// Get the parent directory
			File CLASSPATH = new File(url.toURI()).getParentFile();
			// get the file from where the jar is located.
			String relativePath = directory + filename;
			absolutePath = CLASSPATH.getAbsolutePath() + "/" + relativePath;

			file = new File(absolutePath);

			if (!file.exists()) {
				file = new File(relativePath);
			}

			if (!file.exists()) {
				System.err.println("The file can't be found in " + absolutePath + " nor relative " + relativePath);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return file;
	}

}
