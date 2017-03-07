# Hygieia℠ UI Tests

This contains a Serenity based project for testing the Hygieia UI. It is important to ensure that changes made in the development process will not break existing functionality, and having a UI test suite can accomplish that. The foundation Serenity provides is a BDD mentality allowing the easy addition of use cases and meaningful reporting. It can also be easily integrated into the development pipeline.

The acceptance test suite included is based upon a Docker platform, completed by:
* Starting up containers needed for testing
* Inserting dummy data
* Running test suite
* Cleaning up containers

## Selenium Hub

The tests incorporate a set of images produced by Selenium, known as the Selenium Hub and Nodes. By using the Hub, one can use a Chrome node, Firefox node, etc to ensure that the application is tested fully. See this github page [here](https://github.com/SeleniumHQ/docker-selenium) for more quality information.

**NOTE:** Data does not need to be removed since database container has no volumes. *The test data is deleted with the container.*

## Running the UI Tests

Included in the UI-test folder is a uitests.sh script. By changing the exported fields in this file, the script can be run on a nix based machine to run the UI tests in a dockerized manner. The included docker-compose file will create all the dependent images, run your set of acceptance tests, and finally the script will clean up all of the artifacts created during your suite. The only files that will be persisted in the process will be those that reside in your parent project - the test results will be modified in place in the UI-Test folder.

**NOTE:** The UI-test image must be created before the uitests.sh script is run. See the included docker/Dockerfile.


## Personalizing the uitests.sh file

In the case where your organization is using different images to test/deploy your instance of Hygieia, you may put your specific image tag in its correspoding spot in the uitests.sh script. This is helpful if you have an internal private registry, are working off of a local built image, etc. The image tags should be entered in the form below:

```bash
export MONGO_IMAGE=[ mongo image (mongo:latest)]
export API_IMAGE=[ api image (capitalone/hygieia-api:2.0.5) ]
export UI_IMAGE=[ ui image (my.internal.registry:5000/devteam/hygieia-ui) ]
export HUB_IMAGE=[ hub image** ]
export NODE1_IMAGE=[ browser node image** ]
export NODE1_DRIVER=[ browser driver name (chrome, firefox, phantomjs, etc) ]
export TEST_IMAGE=[ ui test image ]
```
**NOTE:** The Hub image used in the development of this suite was selenium/hub:3.1.0

**NOTE:** The Node iamge used in the development of this suite was selenium/node-chrome:3.1.0

If you are running the Hygieia UI on an SSL enabled server, ensure that the following export is set to true. This will point the hub/node combo to use https://host:443 instead of http://host.

```bash
export SSL_UI=[ true | false ]
```

## A note on passwords...

Since this is all test data, passwords are not encrypted. The included database setup file (mongo_setup.js) has a hashed password 'password' to allow easy insertion.
