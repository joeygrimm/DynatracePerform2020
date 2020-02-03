# Welcome to Advanced Synthetics

Here you will find all the content you need for the class. Feel free to download it and follow along

## Getting Started

The content you will find here will be the actual synthetic config files (to be uploaded via script mode) and the API json files (to be uploaded via Dynatrace API)


## SCRIPTING GUIDE

### Planning the script

Before you record a script, identify the goals you want to accomplish. Here are some considerations:

....• What functionality needs to be tested?
 
.....• Is this functionality supported by the Chrome browser agent?
 
....• What should the script flow look like?
 
....• How do you make sure the script is going to function properly?
	
Before beginning the recording, walk through the business process in a native Chrome browser to make sure there are no performance problems that would prevent the recorder from successfully recording and playing the script.

### Scripting skills

 • Dynatrace has [video tutorials](https://university.dynatrace.com/ondemand/dynatrace) and [documentation](https://www.dynatrace.com/support/help/shortlink/synthetic-hub) for Browser Monitors and HTTP Monitors
 • Refining the monitor events requires a knowledge of [HTML, CSS, and JavaScript](http://www.w3schools.com/) 
 • It will be helpful to familiarize yourself with the [browser clickpath events](https://www.dynatrace.com/support/help/shortlink/id_brower-clickpath-events) for the Recorder and scripts.
	
### Setting up a script

When you create a monitor, don't try to squeeze in as many functionalities as possible. You can create multiple monitors, so that each monitor tests only one application function at a time, to keep each monitor as short and simple as possible. For example, for a shopping website, create separate scripts to log in, search for an item, add the item to the cart, provide shipping information, and pay for the item. Limiting the script to a single application function helps to isolate problem areas for troubleshooting.

When you have cleaned up the script, play back the script to ensure it plays back successfully before activating. 
Script configuration best practices 

....• **Clean up** - Remove unnecessary events. For example, you clicked anywhere in the web page where there isn’t an element on accident, remove these click events. 
.....• **Event naming** - Edit the default monitor and event names to provide unique and meaningful names. Using names that clearly identify the purpose of the monitor and each event makes maintaining the script easier.
 • **Validate everything** - Include a validation in each event. Sometimes the script will load a different page than expected but will return a success. To ensure that specific text or images are loaded and correctly displayed on a page, create a content validation rule to target specific text, CSS, or DOM elements. 
 • **Tag your monitor** – Tags are a flexible and powerful way to organize your environment. It is essential a good tagging strategy is in place. Tags are used throughout the portal in areas where defining a set of entities is necessary as a basis such as charts, alerting profiles, maintenance windows, management zones, and more. See [best practices and recommendations for tags](https://www.dynatrace.com/support/help/shortlink/tagging-best-practices).  
 • **QA for 24 Hours** – After the script has some time to run, verify it’s working as expected and adjust any events as needed (waits, locators, etc.) Once you have established a baseline of performance and the monitor is working as expected,  
 • **Baseline for 2 weeks** – After a baseline of performance has been established, adjust performance thresholds as needed. 


## SCRIPTING TOOLS AND RESOURCES

 • CSS Selector Tester extension -- https://chrome.google.com/webstore/detail/css-selector-tester/bbklnaodgoocmcdejoalmbjihhdkbfon
 • CSS Selector Reference and examples -- https://www.w3schools.com/cssref/css_selectors.asp

### Introduction

In order to take advantage of many of the various the Dynatrace Synthetic solutions it is necessary to have working scripts in order to replicate the various web transactions that you are looking to measure performance for.  While we have made major strides in our ability to record web application transactions out-of-the-box, there are still applications and transactions that will require some troubleshooting in order to playback properly.  There are some specific tools and resources that you can utilize in order script customize and troubleshoot your scripts more effectively.  

### Dynatrace University
Dynatrace University is the first and foremost resource for information, lessons, and tutorials on Dynatrace Synthetic Browser and HTTP Monitors.

 • Dynatrace University - https://university.dynatrace.com/ondemand/dynatrace
 • Dynatrace > Digital Experience Management > Synthetic 
	

### Dynatrace Community

 • Dynatrace Community - https://community.dynatrace.com
 • Synthetic Monitoring -  https://www.dynatrace.com/support/help/shortlink/synthetic-hub

## Web Technologies
One major advantage of the Dynatrace recorder is that we use standard web technologies to build scripts.  This means that if you already know basic HTML, CSS, and JavaScript then you already have 90% the skills necessary to script.  If you don’t, then there is a wealth of free resources available out on the web that you can use to learn.  The following are some excellent resources for learning and referencing the different technologies we use:
	
## HTML, CSS & JavaScript

 • W3schools.com - http://www.w3schools.com/
 • MDN web docs - https://developer.mozilla.org/en-US/
 • Codeacademy - https://www.codecademy.com/

## CSS Selectors

 • CSS Selector Tester - https://chrome.google.com/webstore/detail/css-selector-tester/bbklnaodgoocmcdejoalmbjihhdkbfon
 • CSS Selector Reference and examples - https://www.w3schools.com/cssref/css_selectors.asp

## Regular Expressions

 • Regular Expressions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 • Regex Pal - http://www.regexpal.com/ 
 • Regexr - https://regexr.com/

## Scripting Tools/Add-ons

In addition to your script recorder there are many excellent web development tools out there that are extremely helpful during the script creation process.  The following is a list of tools and browser plug-ins, many of which are Open Source (a.k.a. free), that we typically use when creating a script: 

### Web Development Tools

 • Chrome DevTools - https://developers.google.com/web/tools/chrome-devtools

### HTTP Monitor/Proxy

 • HttpWatch - http://www.httpwatch.com/
 • Charles Proxy - http://www.charlesproxy.com/
 • Fiddler - http://www.fiddler2.com/fiddler2/
 • Wireshark - http://www.wireshark.org/
 
### Text Editor

 • Notepad++ - http://notepad-plus-plus.org/
 • TextPad - http://www.textpad.com/
 • TextMate (Mac OS X) - http://macromates.com/ 


## Useful URLs for the Hand On portion

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

