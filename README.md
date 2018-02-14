# Dollar Cost Average purchases of Crypto currencies (GDAX)
The goal of this project is to provide a simple script to purchase various cryptocurrencies from GDAX that can be deployed 
easily into AWS Lambda.

## Requirements
In order to configure and deploy this script into AWS you will need to sign up for AWS and create account credentials with
appropriate credentials.

1. Follow the instructions at https://docs.aws.amazon.com/lambda/latest/dg/setup.html to sign up for AWS and 
create an admin account in IAM service (IAM is their authentication service)
2. In IAM, select the admin account you just created and go into the Security Credentials tab and gerenate a new access key
and secret key.  Save those for step 4.
3. Install the serverless framework
   `npm install -g serverless`
4. Configure the serverless credentials you created in the previous step.
   `serverless config credentials --provider aws --key <access key> --secret <secret key>`
   
## Deploying
1. Copy serverless.yml.example to serverless.yml
2. Fill in the environment variables in serverless.yml to fit your needs.
3. `serverless deploy` to deploy
