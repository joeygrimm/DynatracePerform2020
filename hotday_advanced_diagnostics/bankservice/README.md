# BankService

This is a simple java application running in a container that executes different task in the background. The idea of this application is for educational purposes for creating a custom service and rename the transactions.  This way Dynatrace can automatically keep track of the different type of transactions being exposed via custom service.

## Running it

```bash
docker run -d shinojosa/bankjob:perform2020
```

> This command will pull the image from docker hub. You only need docker and an internet connection. 

#### Excurs

#### *Enhancing and customizing the service detection via API* 
This exercise was not handled in the sessions since we did not have time left. But it is just a POST request via our API. If you notice the BankService, there is a jobtype that calls URLs. All are from dynatrace and from different subdomains. Here is how you can split the different subdomains in different services so Dynatrace keeps track of the different services.


save the following json as `myapirule.json` file
 ```json
 {
     "name": "Dynatrace.com",
     "type": "OPAQUE_AND_EXTERNAL_WEB_REQUEST",
     "description": "",
     "enabled": true,
     "conditions": [
         {
             "attributeType": "TOP_LEVEL_DOMAIN",
             "compareOperations": [
                 {
                     "type": "ENDS_WITH",
                     "negate": false,
                     "ignoreCase": "true",
                     "values": [
                         "dynatrace.com"
                     ]
                 }
             ]
         }
     ],
     "publicDomainName": {
         "copyFromHostName": true
     },
     "port": {
         "doNotUseForServiceId": true
     }
 }
 ```
Now go to the GIT Terminal (since you have curl there installed) and export the following variables (Replace the values with your tenant and api-token)
```
export TENANT=https://ABC.managed.dynatrace.com/e/tenant-id/
export TOKEN=XXXXX
```
Do a curl post request with the JSON payload.
`curl -X POST -H "Content-Type: application/json" -H "Authorization: Api-Token $TOKEN" -d @myapirule.json $TENANT/api/config/v1/service/detectionRules/OPAQUE_AND_EXTERNAL_WEB_REQUEST`

## Prerequisites

- Docker
- A Dynatrace tenant

## Developing and playing around with the application

This application was created with Eclipse and Maven. There is a `conf` directory. In there there you can play around with the properties of the application. 

### Import in Eclipse

The project can be imported with pretty much any version of [Eclipse](https://www.eclipse.org/). 

### Compiling

You can compile the application directly with eclipse or with the following maven command:

`mvn clean install`


the version of the JAR is defined in the `pom.xml` definition file. If you change the version, change also the Dockerfile to point ot the right version.

Create the Docker Image

`docker build `

## Author 

sergio.hinojosa@dynatrace.com
