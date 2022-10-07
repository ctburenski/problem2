# Problem 2 Solution

Node version - 18.7.0

- install dependencies with `npm install`
- run with `npm run start`

The server will listen over port 7777.

Since the test uses fetch within nodejs, it will display a warning explaining the fetch API is experimental. No flags need to be turned on to run the test.

This test populates the server with balloons of a random volumes with an incrementing tag, and then make requests with random container sizes, and about half of the time with a random mass passed in. If a second run is done will perform updates on all the previous tags and it seems to perform identically.

- test in separate terminal with `node test.js`

# Assumptions

1. This implemenation assumes that the balloons are not filled with the different types of gas (such as a gas heavier or lighter than air), so we can expect two balloons of the same volume will share the same mass.
2. It does not assume that the request constraints will be explicitly followed by the clients making requests, so it does check to ensure all of the request data is compliant.
3. This assumes that the server will not have to execute a GET request while processing a PUT request in between, which would result in the list of balloons possibly being out of date. Currently that is OK since the server does not need to use asynchronous code.
