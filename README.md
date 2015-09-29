# KDWMailChecker

A sample [AWS Lambda](https://aws.amazon.com/lambda/) function to handle [Amazon SES](https://aws.amazon.com/ses/) inbound messages, after processing it will gave you a simple test of your email address for SPAM, Virus, SPF and DKIM (they are processed by SES).

You can test sending a simple e-mail to info@iaas.com.br (You can send only one email per day):

#If it is you first test on the day you get this:

SPF:   PASS
DKIM:  GRAY
SPAM:  PASS
VIRUS: PASS


KDW Email Checker - A Serverless solution powered by AWS SES + AWS Lambda
www.kdw.com.br

#After that, you get this:

This e-mail address has already been tested today


KDW Email Checker - A Serverless solution powered by AWS SES + AWS Lambda
www.kdw.com.br

## License

Copyright (c) 2015 Jose Galego, http://www.twitter.com/bygalego

This code is licensed under the The MIT License (MIT). Please see the LICENSE file that accompanies this project for the terms of use.

## Installation

It is much easy if you already have SES and at least one domain verified.

### AWS

1. Setup you AWS SES service
2. Validate your domain & address
3. Create a new AWS Lambda function, like 'mailchecker'
  1. Use Node.js as runtime
  2. Paste the code inline from the mailchecker.js'file
  3. Leave the default handler
  4. Use a basic execution role
  5. Leave the default memory (128MB) and timeout (3s)
4. Setup the SES inbound e-mail
  1. Choose and e-mail address to filter or leave blank to process all e-mails
  2. Choose the AWS Lambda function you create in 3
  3. Give the permission if asked


## Feedback

Feedback [here](https://twitter.com/bygalego).
