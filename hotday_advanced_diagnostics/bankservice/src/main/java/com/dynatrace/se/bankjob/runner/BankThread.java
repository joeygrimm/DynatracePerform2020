package com.dynatrace.se.bankjob.runner;

public class BankThread extends Thread {
	String bank;
	String job;

	public BankThread(ThreadGroup g, String bank, String job, int i) {
		super(g, job.replace(" job", "ThreadGroup") + "- [" + i + "]");
		this.bank = bank;
		this.job = job;
	}

	public void run() {
		BankTask.loopInJobsForever();
	}
}
