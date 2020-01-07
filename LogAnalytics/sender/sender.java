package Perform2020.LogAnalytics.sender;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Random;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.logging.LogRecord;
import java.net.HttpURLConnection; 
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStream; 
import java.io.InputStreamReader; 
     
         
public class sender extends TimerTask {

    public static FileHandler handler;
    public static Logger logger;
    public static final String node_url = "http://127.0.0.1:8081/";
    public static final String[] stuff = {"bacon", "beer", "coffee", "fruit"};
    public static Random gen = new Random();

    @Override
    public void run() {
      int i = gen.nextInt(stuff.length);
      int status = orderSomething(stuff[i]);
    }

    private int orderSomething(String something) {
      int status = 0;
      BufferedReader in;
      StringBuffer content;
      String inputLine;
      try {
          URL url = new URL(node_url + something);
          HttpURLConnection con = (HttpURLConnection) url.openConnection();
          con.setRequestMethod("GET");

          status = con.getResponseCode();
          switch(status) {
            case 200:
              in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
              content = new StringBuffer();
              while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
              }
              in.close();
              logSuccess(content.toString());
            break;
            case 400:
            case 404:
              in = new BufferedReader(
                new InputStreamReader(con.getErrorStream()));
              content = new StringBuffer();
              while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
              }
              in.close();
              logFail(content.toString());
            break;
            default:
              in = new BufferedReader(
                new InputStreamReader(con.getErrorStream()));
              content = new StringBuffer();
              while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
              }
              in.close();
              logFail(content.toString());
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
      return status;
    }

    private void logSuccess(String content) {
  	  sender.logger.info(content);
    }

    private void logFail(String content) {
  	  sender.logger.warning(content);
    }

    public static void main(String args[]) throws Exception{
        TimerTask timerTask = new sender();
        Timer timer = new Timer(true);

        boolean append = true;
        sender.handler = new FileHandler("Perform2020/LogAnalytics/logs/sender.log", append);
	    sender.handler.setFormatter(new SimpleFormatter() {
	      private static final String format = "%1$tF %1$tT %1$tZ [%2$s] %4$s: %5$s %n";

	      @Override
          public synchronized String format(LogRecord lr) {
              return String.format(format,
                      new Date(lr.getMillis()),
		      lr.getSourceMethodName(),
		      lr.getLoggerName(),
                      lr.getLevel().getLocalizedName(),
                      lr.getMessage(),
		      lr.getThrown()
              );
          }
	    });
        sender.logger = Logger.getLogger("Perform2020.sender");
	    sender.logger.setUseParentHandlers(false);
        sender.logger.addHandler(handler);
         
        timer.scheduleAtFixedRate(timerTask, 0, 5*1000);
	
	    Thread.sleep(900000);
    }

}
