package com.dynatrace.se.bankjob.runner;

import static com.dynatrace.se.bankjob.util.Helper.getRandomElement;
import static com.dynatrace.se.bankjob.util.Helper.getRandomNumberInRange;

import com.dynatrace.se.bankjob.business.BankBusinessException;
import com.dynatrace.se.bankjob.business.BankUrlBusinessException;
import com.dynatrace.se.bankjob.data.BankData;
import com.dynatrace.se.bankjob.fibonacci.Fibonacci;
import com.dynatrace.se.bankjob.util.Helper;
import com.dynatrace.se.bankjob.util.Job;

import java.io.File;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

/**
 * BankTask. Sample application to show the importance of Custom Service and
 * proper Request Naming rules. How to leverage Dynatrace AI (DAVIS) with proper
 * naming and exposure of the transacions. Also a sample to demonstrate the
 * Thread Capabilities and CPU Analysis.
 * 
 * @author sergio.hinojosa@dynatrace.com
 * 
 *
 */
public class BankTask {

	private static Logger logger = Logger.getLogger(BankTask.class.getName());
	private static BankData data = BankData.getInstance();
	private static HttpClient client;

	/**
	 * Main method
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {

		// Create Thread Groups for each JobType
		HashMap<String, ThreadGroup> threadGroups = new HashMap<String, ThreadGroup>();
		ThreadGroup base = new ThreadGroup("BankServices");
		for (String job : data.jobs) {
			String groupName = job.replace(" job", "").toLowerCase();
			ThreadGroup g = new ThreadGroup(base, groupName);
			threadGroups.put(groupName, g);
		}

		// Initiate the amount of Threads
		logger.info("Amount of threads " + data.threads);
		for (int i = 0; i < data.threads; i++) {
			String bank = getRandomElement(data.banks);
			String job = getRandomElement(data.jobs);
			String jName = job.replace(" job", "").toLowerCase();
			ThreadGroup tg = threadGroups.get(jName);
			BankThread t = new BankThread(tg, bank, job, i);
			t.start();
		}
		logger.info("Done initializing threads with Main Thread");
		// TODO Do something to the main thread?
	}

	/**
	 * The Job will be executed forever. This represents a single Thread instance
	 */

	static void loopInJobsForever() {

		boolean loopForever = true;
		while (loopForever) {

			BankThread t = (BankThread) Thread.currentThread();

			try {
				int sleepTime = getRandomNumberInRange(0, data.sleepTime);
				logger.info("Execute job [" + t.job + "] - Bank[" + t.bank + "]" + " sleep [" + sleepTime
						+ "]s ThreadId[" + t.getId() + "]");

				executeJob(t.job, t.bank);

				TimeUnit.SECONDS.sleep(sleepTime);
			} catch (Exception e) {
				logger.severe(e.getMessage());
			}
		}
	}

	/**
	 * 
	 * @param bank
	 * @param jobname
	 * @throws Exception
	 * 
	 */
	private static void executeJob(String jobname, String bank) throws Exception {

		switch (Job.fromString(jobname)) {
		case RISKY_JOB:
			doRiskyJob();
			break;
		case HEAVY_CALCULATION:
			int numToCalculate = getRandomNumberInRange(data.minfibbonacci, data.maxfibbonacci);
			doHeavyCalculation(numToCalculate);
			break;
		case CHECK_URL:
			doCheckUrl(Helper.getRandomElement(data.urls));
			break;
		case WRITE_REPORT:
			doWriteReport();
			break;

		default:
			break;
		}
	}

	/**
	 * 
	 * 
	 * @throws Exception
	 */
	private static void doRiskyJob() throws Exception {
		// Get Failure Rate
		int shouldFail = getRandomNumberInRange(1, 100);
		int x = 0;
		try {
			if (shouldFail < data.failurerate) {
				// Divide by Zero
				x = 1 / 0;
			} else {
				x = shouldFail / data.failurerate;
			}
		} catch (Exception e) {
			throw new BankBusinessException("Risky job failed:" + e.getLocalizedMessage(), e);
		}
	}

	/**
	 * it will calculate the Fibonacci numbers in Range from data.minfibbonacci to
	 * data.maxfibbonacci.
	 */
	private static void doHeavyCalculation(int numToCalculate) {
		Fibonacci.fibonacci(numToCalculate);
	}

	/**
	 * Making a Synchronized Report Writer
	 * 
	 * @throws Exception
	 */
	synchronized private static void doWriteReport() throws Exception {

		// We in the report directory
		try {

			File report = BankData.getFileFrom("report.txt", "");
			BankThread t = (BankThread) Thread.currentThread();

			FileWriter writer = new FileWriter(report);
			writer.write("A report from Bank " + t.bank + " and Thread " + String.valueOf(t.getId()));
			writer.write(System.lineSeparator());
			writer.write("Write 100 lines report from Bank " + t.bank + " and Thread " + String.valueOf(t.getId()));
			writer.write(System.lineSeparator());

			for (int i = 0; i < 100; i++) {
				writer.write("Line " + i + " - " + t.bank + " and Thread " + String.valueOf(t.getId()));
				writer.write(System.lineSeparator());
			}
			writer.write("Report done for Bank " + t.bank + " and Thread " + String.valueOf(t.getId()));
			writer.write(System.lineSeparator());
			writer.close();
			logger.info("Report for Bank " + t.bank + " - Thread " + String.valueOf(t.getId()) + " with Size: "
					+ report.length());

		} catch (Exception e) {
			throw new BankBusinessException("Write Report failed:" + e.getLocalizedMessage(), e);
		}
	}

	/**
	 * 
	 * 
	 * @param urlString
	 * @throws Exception
	 */
	static void doCheckUrl(String urlString) throws Exception {
		client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(urlString);

		HttpResponse response = client.execute(request);
		int statusCode = response.getStatusLine().getStatusCode();
		if (statusCode < 500) {
			logger.info(urlString + " code:" + String.valueOf(statusCode));
		} else {
			throw new BankUrlBusinessException(
					"Ooppsala, there was an Error calling the Url:" + urlString + ", it returned HTTP " + statusCode);
		}
	}
}
