# Welcome to Advanced Synthetics

Here you will find all the content you need for the class. Feel free to download it and follow along

## Getting Started

The content you will find here will be the actual synthetic config files (to be uploaded via script mode) and the API json files (to be uploaded via Dynatrace API)

### SCRIPTING TOOLS AND RESOURCES

	+ CSS Selector Tester extension -- https://chrome.google.com/webstore/detail/css-selector-tester/bbklnaodgoocmcdejoalmbjihhdkbfon
	+ CSS Selector Reference and examples -- https://www.w3schools.com/cssref/css_selectors.asp

## Introduction

In order to take advantage of many of the various the Dynatrace Synthetic solutions it is necessary to have working scripts in order to replicate the various web transactions that you are looking to measure performance for.  While we have made major strides in our ability to record web application transactions out-of-the-box, there are still applications and transactions that will require some troubleshooting in order to playback properly.  There are some specific tools and resources that you can utilize in order script customize and troubleshoot your scripts more effectively.  

# Dynatrace University
Dynatrace University is the first and foremost resource for information, lessons, and tutorials on Dynatrace Synthetic Browser and HTTP Monitors.
	 + Dynatrace University - https://university.dynatrace.com/ondemand/dynatrace
	 + Dynatrace > Digital Experience Management > Synthetic 

# Dynatrace Community
	 + Dynatrace Community - https://community.dynatrace.com
	 + Synthetic Monitoring -  https://www.dynatrace.com/support/help/shortlink/synthetic-hub

# Web Technologies
One major advantage of the Dynatrace recorder is that we use standard web technologies to build scripts.  This means that if you already know basic HTML, CSS, and JavaScript then you already have 90% the skills necessary to script.  If you don’t, then there is a wealth of free resources available out on the web that you can use to learn.  The following are some excellent resources for learning and referencing the different technologies we use:
	
	# HTML, CSS & JavaScript
		+ W3schools.com - http://www.w3schools.com/
•	MDN web docs - https://developer.mozilla.org/en-US/
•	Codeacademy - https://www.codecademy.com/
CSS Selectors
•	CSS Selector Tester - https://chrome.google.com/webstore/detail/css-selector-tester/bbklnaodgoocmcdejoalmbjihhdkbfon
•	CSS Selector Reference and examples - https://www.w3schools.com/cssref/css_selectors.asp
Regular Expressions
•	Regular Expressions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
•	Regex Pal - http://www.regexpal.com/ 
•	Regexr - https://regexr.com/
Scripting Tools/Add-ons
In addition to your script recorder there are many excellent web development tools out there that are extremely helpful during the script creation process.  The following is a list of tools and browser plug-ins, many of which are Open Source (a.k.a. free), that we typically use when creating a script: 
Web Development Tools
•	Chrome DevTools - https://developers.google.com/web/tools/chrome-devtools
HTTP Monitor/Proxy
•	HttpWatch - http://www.httpwatch.com/
•	Charles Proxy - http://www.charlesproxy.com/
•	Fiddler - http://www.fiddler2.com/fiddler2/
•	Wireshark - http://www.wireshark.org/
Text Editor
•	Notepad++ - http://notepad-plus-plus.org/
•	TextPad - http://www.textpad.com/
•	TextMate (Mac OS X) - http://macromates.com/ 


### Useful URLs for the Hand On portion

NBA API url: https://free-nba.p.rapidapi.com/games

For the first HO session: 

| Description | Input data |
| --- | --- |
| Credit card type | Visa |
| Credit card number | 4750112593552391309 |
| Name | Maria O'Donnel |
| Exp Date | December 2022 |
| Verification Number | 1303 |


## Advanced exercises included

We will have 7 browser clickpaths and one HTTP monitor with some advance synthetic concepts:

* Modifying Locators

* Global Variable Example (Create at Date)
	
* Global Variable Example #2 (Post Save Variable)

* Modify locator instead of using JavaScript Event

* Fetch()/XHR mid Clickpath

* Conditional Event

* HTTP monitor with pre and post execution scripts


## Acknowledgments

* Hat tip to all the Insights team that created all the advanced use cases scripts. I you need help please reach out to insightssupport@dynatrace.com

