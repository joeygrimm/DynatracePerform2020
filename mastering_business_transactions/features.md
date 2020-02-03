Perform 2020

Mastering Business Transactions

[Hands-on 1](#hands-on-1)

[Hands-on 2](#hands-on-2)

[Hands-on 3](#hands-on-3)

[Hands-on 4](#hands-on-4)


# Hands-on 1

* User action naming
  * Add a placeholder called “XHR_URL_no_parameters” with input “Xhr Url” and extract after the trailing “?”
  * Add a placeholder called “Remove_amount” with input “Element identifier” and extract after the trailing “$”
  * Add an XHR naming rule: {userInteraction} on "{Remove_amount}“
  * Add an XHR naming rule: {XHR_URL_no_parameters}
  * Add an XHR naming rule: {userInteraction} on "{elementIdentifier}"
  * Deactivate “Case insensitive naming”
* Define two key user actions
  * click on “Sign In”
  * click on “Book journey for”
* Define a conversion goal
  * User action name contains “book journey”
* Create a dashboard including the key user actions and conversion goal

## Feature: user action naming
* Access the Applications page and click on one of the applications
* Click on the three dots button at the top-right and click on Edit
* In the internal menu, click on "User actions"
* You may add placeholders for later use on rules
* You will choose which type of action you want to rename: load or XHR
* Click on "Add naming rule" and define the pattern
* Check the Preview to see if it’s what you intended

Validation
* Go to a user session
* Check the names of the actions

## Feature: key user action
* Access the Applications page and click on one of the applications
* Look for the "Top 3 actions" section and click on "View full details"
* The page that opens up is called "User action analysis"
* Click on the name of the action
* Click on "Mark as key user action" at the top-right

Validation
* Go to the "User action analysis" page
* Check the "Key user actions" section

## Feature: conversion goal
* Access the Applications page and click on one of the applications
* Click on the three dots button at the top-right and click on Edit
* In the internal menu, click on "Conversion goals"
* Click on "Add goal"
* Use the form to create the goal

Validation
* Make sure to set a name to preview the percentage
* Go to the User session page
* Set the timeframe for more than 30 minutes (conversion goals are calculated for completed sessions only)
* In the filter bar, use the value "Conversional goal" to see if your goal is being reached


# Hands-on 2

* From the user session screen, create a funnel query
* Take a look at each action and get to know the services they rely on
* Check the “Book journey“ action
* Define a key request: storeBooking
* Add the key request to the dashboard
* Understand dynamic requests and resource requests
  * Is it a business problem if the image of a big marketing campaign is not loading?
* Define a request naming for image requests
  * URL path contains “dt-map”


## Feature: user session queries (also called USQL)
* Access the User sessions page
* Click on the "User session query" button
* Type the query you wish, the auto-completion will help you

Validation
* Run the query and check the results
* Optionally save the results to a dashboard

## Feature: key request
* Access the "Transactions & services" page and click on one of the services
* In the "Understand dependencies" section, click on "View web requests"
* Click on the name of one of the requests
* At the top-right of the page, click on the three dots button
* Click on "Mark as key request"

Validation
* In the Service details page, the section Key Requests will show your new key request

## Feature: request naming
* Access the "Transactions & services" page and click on one of the services
* Click on the three dots button and click on Edit
* In the internal menu, click on "Request naming rules"
* Find the heading "Request naming rules" and click "Add rule"
* Specify the new naming pattern and then the conditions 

Validation
* Access the "Transactions & services" page and click on one of the services
* In the "Understand dependencies" section, click on "View web requests"
* Check the names of the requests

# Hands-on 3

* Define a request attribute based on the Java method parameter
  * Class: com.dynatrace.easytravel.business.webservice.BookingService
  * Method: private void checkLoyaltyStatus
  * Argument: 2: java.lang.String
* Define a request attribute based on the Java method parameter
  * Class: com.dynatrace.easytravel.business.webservice.BookingService
  * Method: public java.lang.String storeBooking
  * Argument: 4: java.lang.Double
* Create a multi-dimensional analysis chart, save the view
  * Booking amount by loyalty status

## Feature: request attributes
* Access the Settings page
* Click on the group "Server-side service monitoring" and then click on "Request attributes"
* Click on "Define a new request attribute" to define a new one
* You will first define the properties of the value
* You will then define the source (where you want to capture it)
* Optionally define post-processing rules to further customize it

Validation
* In the "Transactions & services" page, use the filter bar to filter by Request atribute
* Open one of the service’s details page and scroll to the bottom
* You will see a Request Attributes tab in the Top Contributors section

## Feature: multi-dimensional analysis view
* Acess the service details page of a Service
* In the "Multidimensional analysis views" section, click on "Create chart"
* Choose metrics, filters and dimensions

Validation
* The page will load the chart immediately
* Optionally pin the chart to a services page
* Optionally create a Calculated Service Metric 


# Hands-on 4

* Use the previously created multi-dimensional analysis view to create a new metric
  * Request attribute “booking amount” by request attribute “loyalty status”
* Click on advanced options too see the full configuration screen
* Create custom chart and pin it to a dashboard
* Create a new alerting rule based on the Calculated Service Metric"

## Feature: calculated service metrics
* Access the Settings page
* Click on the group "Server-side service monitoring" and then click on "Calculated Service Metrics"
* Click on "Create new metric" to define a new one
* You will first define the properties of the source
* You will then define the filters to restrict calculation
* You will then define dimension properties

Validation
* Create a Custom Chart and search for the name of the new metric


## Feature: custom events for alerting
* Access the Settings page
* Click on the group "Anomaly detection" and then click on "Custom events for alerting"
* Click on "Create custom event for alerting"
* You will define the Severity
* You will then define the metric, choosing the aggregation and dimensions
* Play with the thresholds and the preview
* You will finish it by defining the description

Validation
* Use the preview
* Wait for the event to appear
