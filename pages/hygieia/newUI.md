---
title: New UI Setup Instructions
tags:
keywords:
summary: Instructions to install all components of the new Hygieia UI
sidebar: hygieia_sidebar
permalink: newUI.html
folder: hygieia

---
# Hygieia UI
[![Build Status](https://travis-ci.com/Hygieia/hygieia.svg?branch=master)](https://travis-ci.com/Hygieia/hygieia?branch=master)
[![Maven Central](https://img.shields.io/maven-central/v/com.capitalone.dashboard/UI.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22com.capitalone.dashboard%22%20AND%20a:%22UI%22)
[![Total alerts](https://img.shields.io/lgtm/alerts/github/Hygieia/hygieia.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Hygieia/hygieia/alerts/)

As a part of making Hygieia more modular, this repo will host Hygieia UI code.

This project requires Angular CLI version 8.0.3.
This project requires java version : openjdk version "1.8.0_265"

# Table of Contents
- [Hygieia UI](#hygieia-ui)
- [Table of Contents](#table-of-contents)
  - [Setup:](#setup)
  - [Build and run the executable file for the api](#build-and-run-the-executable-file-for-the-api)
    - [Sample API Properties](#sample-api-properties)
  - [Build the Project](#build-the-project)
  - [Building  the Project and launching the dashboard in Ubuntu (20.04) : Refer here for Ubuntu 20.04](#building--the-project-and-launching-the-dashboard-in-ubuntu-2004--refer-here-for-ubuntu-2004)
  - [Development server](#development-server)
  - [Running unit tests](#running-unit-tests)
  - [Debugging with IntelliJ](#debugging-with-intellij)
  - [Code scaffolding](#code-scaffolding)
  - [Running tests](#running-tests)
  - [Further help](#further-help)

## Setup:
For the new Hygieia UI, you'll need to build the UI and API. Hygieia core is NOT required for this new UI.  

1. Fork and clone the UI folder
2. Navigate to your UI folder and install the package dependencies by running `npm install`
3. Download Angular CLI by running `npm install -g @angular/cli@8.0.3`
4. You can run `ng version` to check your Angular CLI version and related package dependency versions (make sure the package versions are v8)

## Build and run the executable file for the api 

Before you start, you must run the api on the side.  After you fork/clone the Hygieia [api](https://github.com/Hygieia/api), navigate to the `\api` directory and run the following command: 

`mvn clean install` 

This will create an output `api.jar` file in the `\target` folder.  

Tip: Before you continue, make sure you set the configurable parameters in the api.properties file to connect to the dashboard MongoDB database instance, including properties required by the API module.  See the example below: 

### Sample API Properties
The sample `api.properties` lists parameters with sample values to configure the API layer. Set the parameters based on your environment setup.

```properties
# api.properties
dbname=dashboarddb
dbusername=dashboarduser[MogoDB Database Username, defaults to empty]
dbpassword=dbpassword[MongoDB Database Password, defaults to empty]
dbhost=[Host on which MongoDB is running, defaults to localhost]
dbport=[Port on which MongoDB is listening, defaults to 27017]
dbreplicaset=[false if you are not using MongoDB replicaset]
dbhostport=[host1:port1,host2:port2,host3:port3]
server.contextPath=[Web Context path, if any]
server.port=[Web server port - default is 8080]
logRequest=false
logSplunkRequest=false
corsEnabled=false
corsWhitelist=http://domain1.com:port,http://domain2.com:port
version.number=@application.version.number@

auth.expirationTime=[JWT expiration time in milliseconds]
auth.secret=[Secret Key used to validate the JWT tokens]
auth.authenticationProviders=[Authentication types you would like to enable, defaults to STANDARD, ex: STANDARD,LDAP]
auth.ldapServerUrl=[LDAP Server URL, including port of your LDAP server]
auth.ldapUserDnPattern=[LDAP User Dn Pattern, where the username is replaced with '{0}']

# LDAP Server URL, including port of your LDAP server
auth.ldapServerUrl=[ldap://company.com:389]

# If using standard LDAP
# LDAP User Dn Pattern, where the username is replaced with '{0}'
auth.ldapUserDnPattern=[uid={0},OU=Users,dc=your,dc=company,dc=com]

# If using ActiveDirectory
# This will be the domain part of your userPrincipalName
auth.adDomain=[company.com]
# This will be your root dn
auth.adRootDn=[dc=your,dc=company,dc=com]
# This will be your active directory URL (required for AD)
auth.adUrl=[Need an example]

monitor.proxy.host=[hostname of proxy server]
monitor.proxy.type=[http|socks|direct]
monitor.proxy.port=[port enabled on proxy server]
monitor.proxy.username=[proxy username]
monitor.proxy.password=[proxy password]

# This will be the page size for pagination on Hygieia landing page. If this property is not set, the default value is set to 10.
pageSize=[Integer value]

# API token generated for basic authentication to secure APIs.
key=[api token]

# SSO properties with header values from UI layer
auth.userEid=[name of the header containing EID]
auth.userEmail=[name of the header containing user's email]
auth.userFirstName=[name of the header containing user's first name]
auth.userLastName=[name of the header containing user's last name]
auth.userMiddelInitials=[name of the header containing user's middle name]
auth.userDisplayName=[name of the header containing user's display name]

# Github sync api settings 

# List of not built commits
githubSyncSettings.notBuiltCommits;

# Maximum history of days to sync from current time. Default to 60 days
githubSyncSettings.firstRunHistoryDays;

# Offset time from last updated // 10 mins default
githubSyncSettings.offsetMinutes;

# Total fetch count // Default to 100
githubSyncSettings.fetchCount;

# Commits and pull sync time // Default to 86400000ms - 1 day in milliseconds
githubSyncSettings.commitPullSyncTime;

```
In addition to these properties, add in any additional parameters that your environment may need.  We used Github sync api settings as an example, but you will customize based on your setup.  

All values in the `api.properties` file are optional. For instance, if you have MongoDB installed with no authorization, you must be able to run the API even without the properties file.

For more information, please visit the [Hygieia api guide](https://hygieia.github.io/Hygieia/api.html). 

Navigate to `api\target,` and execute the following command in the command prompt: 

`java -jar api.jar --spring.config.location=C:\[path to api.properties file] -Djasypt.encryptor.password=hygieiasecret`

## Build the Project
With the api running, open a different terminal and run `ng build` in your \UI folder. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. 

## Building  the Project and launching the dashboard in Ubuntu (20.04) : Refer here for Ubuntu 20.04 
Versions of node and npm used => node version v12.18.3 , npm version  6.14.6 

In the UI/ folder :

Install gulp using command : npm install -g gulp 

To check the version : gulp -v 

You then have to install gulp locally on a per-project basis :  npm install gulp --save-dev

*If gulp is listed in the package.json (Under the UI folder) under 'dependencies' , then replace '--save-dev' with just '--save' 

With the api running, open a different terminal and run `gulp build` in your \UI folder. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. 

To launch the dashboard : In the same UI/ folder run the command : gulp serve 


## Development server

In the \UI folder, run `ng serve` for a dev server. Navigate to `http://localhost:4200/` in a incognito browser. The app will automatically reload if you change any of the source files.
 
## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).  You can also debug using Karma.

An alternative method to run unit tests is to run `npm run test-headless` in your UI folder in a terminal.  This will also test your code coverage. 

## Debugging with IntelliJ

If you are using IntelliJ, you can debug with JavaScript Debug.  Navigate to the `Edit Configurations` tab, hit the + sign to `Add New Configuration,` and add `JavaScript Debug.`

Inside the `Run/Debug Configurations` popup, you can edit the name to your preference and change the URL to `http://localhost:4200.`  This will allow you to navigate the UI on localhost to hit the debug breakpoints you set.

Use the Default Chrome browser and apply your changes.

Note: When you start the debug property, it will open a new browser popup for debugging specifically (also in localhost:4200).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).