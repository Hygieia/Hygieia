#!/bin/bash

# mongo container provides the HOST/PORT
# api container provided DB Name, ID & PWD

if [ "$TEST_SCRIPT" != "" ]
then
        #for testing locally
        DEFAULT_PROP_FILE=application.properties
else 
	DEFAULT_PROP_FILE=hygieia-subversion-collector.properties
fi
  
if [ "$MONGO_PORT" != "" ]; then
	# Sample: MONGO_PORT=tcp://172.17.0.20:27017
	MONGODB_HOST=`echo $MONGO_PORT|sed 's;.*://\([^:]*\):\(.*\);\1;'`
	MONGODB_PORT=`echo $MONGO_PORT|sed 's;.*://\([^:]*\):\(.*\);\2;'`
fi


cat > $DEFAULT_PROP_FILE <<EOF
#Database Name
database=${HYGIEIA_API_ENV_SPRING_DATA_MONGODB_DATABASE:-dashboard}

#Database HostName - default is localhost
dbhost=${MONGODB_HOST:-10.0.1.1}

#Database Port - default is 27017
dbport=${MONGODB_PORT:-27017}

#Database Username - default is blank
dbusername=${HYGIEIA_API_ENV_SPRING_DATA_MONGODB_USERNAME:-db}

#Database Password - default is blank
dbpassword=${HYGIEIA_API_ENV_SPRING_DATA_MONGODB_PASSWORD:-dbpass}

#Collector schedule (required)
subversion.cron=${SUBVERSION_CRON:-0 0/5 * * * *}

#Shared subversion username and password
subversion.username=${SUBVERSION_USERNAME:-foo}
subversion.password=${SUBVERSION_PASSWORD:-bar}

#Maximum number of days to go back in time when fetching commits
subversion.commitThresholdDays=${SUBVERSION_COMMIT_THRESHOLD_DAYS:-15}

EOF

echo "

===========================================
Properties file created `date`:  $SPRING_CONFIG_LOCATION
Note: passwords hidden
===========================================
$(egrep -vi 'password' "$SPRING_CONFIG_LOCATION")
 "

exit 0
