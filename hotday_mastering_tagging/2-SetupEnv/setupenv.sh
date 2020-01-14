#!/bin/bash


export API_TOKEN=$(cat ../1-Credentials/creds.json | jq -r '.dynatraceApiToken')
export PAAS_TOKEN=$(cat ../1-Credentials/creds.json | jq -r '.dynatracePaaSToken')
export TENANTID=$(cat ../1-Credentials/creds.json | jq -r '.dynatraceTenantID')
#export ENVIRONMENTID=$(cat ../1-Credentials/creds.json | jq -r '.dynatraceEnvironmentID')


echo "Creating Cluster with the following credentials: "
echo "API_TOKEN = $API_TOKEN"
echo "PAAS_TOKEN = $PAAS_TOKEN"
echo "TENANTID = $TENANTID"
#echo "ENVIRONMENTID = $ENVIRONMENTID"
#echo "Cloud Provider $CLOUD_PROVIDER"

echo ""
read -p "Is this all correct? (y/n) : " -n 1 -r
echo ""

usage()
{
    echo 'Usage : ./setupenv.sh API_TOKEN PAAS_TOKEN TENANTID ENVIRONMENTID (optional if a SaaS deployment)'
    exit
}

if [[ $REPLY =~ ^[Yy]$ ]]; then

	echo "Deploying OneAgent Operator"

	../utils/deploy-dt-operator.sh

	echo "Waiting for OneAgent to startup..."
	sleep 120

	echo "Deploying SockShop Application"
	../utils/deploy-sockshop.sh

	sleep 120

	echo "Deployment Complete"
else
	exit 1
fi
