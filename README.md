# Weather App

A modern weather application that displays current weather conditions.

## Setup

1. Copy the example config file:
   ```
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your API key.

## AWS Amplify Deployment

When deploying with AWS Amplify:

1. Make sure to include your `config.js` file with your API key in the deployment.
2. The `config.js` file should be excluded from version control but included in your deployment.

## Local Development

For local development, use your local `config.js` file (which is ignored by git).