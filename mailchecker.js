/**
 * Created by galego on 29/09/15.
 */
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var ses = new AWS.SES();
var dynamodb = new AWS.DynamoDB();

exports.handler = function (event, context) {
    //console.log('KDW Email Checker');
    var sesNotification = event.Records[0].ses;

    //console.log("SES Notification:\n", JSON.stringify(sesNotification, null, 2));
    var bodyText = "";
    var fromAddress = "";
    var countToday = 0;

    fromAddress = sesNotification.mail.source;
    var datetime = new Date().toISOString();
    var dateStr = datetime.substr(0, 10);

    var params = {};
    params.TableName = "mailchecker";
    params.ConditionalOperator = "AND";
    params.ScanFilter = {
        email: {
            ComparisonOperator: "EQ",
            AttributeValueList: [{S: fromAddress}]
        },
        data: {
            ComparisonOperator: "EQ",
            AttributeValueList: [{S: dateStr}]
        }
    };
    params.Select = "COUNT";

    dynamodb.scan(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            countToday = data.Count;
            //context.succeed(data.Count);

            if (countToday === 0) {
                //new email - Insert email & date info in DynamoDB table and send the result

                //insert in DynamoDB
                var params2 = {};
                params2.TableName = "mailchecker";
                params2.Item = {
                    "email": {"S": fromAddress},
                    "data": {"S": dateStr}
                };
                dynamodb.putItem(params2, function (err, data) {
                    if (err) {
                        //context.done('error','putting item into dynamodb failed: '+err);
                        console.log('e-mail inserted failed: ' + err);
                    }
                    else {
                        console.log('e-mail inserted: ' + JSON.stringify(data, null, '  '));
                    }
                });

                //build the body text of the e-mail with results
                bodyText = bodyText + "SPF:   " + sesNotification.receipt.spfVerdict.status + "\n";
                bodyText = bodyText + "DKIM:  " + sesNotification.receipt.dkimVerdict.status + "\n";
                bodyText = bodyText + "SPAM:  " + sesNotification.receipt.spamVerdict.status + "\n";
                bodyText = bodyText + "VIRUS: " + sesNotification.receipt.virusVerdict.status + "\n";
                bodyText = bodyText + "\n\n KDW Email Checker - A Serverless solution powered by AWS SES + AWS Lambda\n";
                bodyText = bodyText + "kdw.cloud"

            }
            else {
                //build the body for blocked e-mails
                bodyText = bodyText + "This e-mail address has already been tested today\n";
                bodyText = bodyText + "\n\n KDW Email Checker - A Serverless solution powered by AWS SES + AWS Lambda\n";
                bodyText = bodyText + "www.kdw.com.br"
            }

            var eParams = {
                Destination: {
                    ToAddresses: [fromAddress]
                },
                Message: {
                    Body: {
                        Text: {
                            Data: bodyText
                        }
                    },
                    Subject: {
                        Data: "KDW Check Email - Results"
                    }
                },
                Source: "info@iaas.com.br"
            };


            var email = ses.sendEmail(eParams, function (err, data) {
                if (err) {
                    //console.log(err);
                    context.succeed();
                }
                else {
                    console.log("===E-mail sent===");
                    //console.log(data);
                    context.succeed();
                }
            });

        }
    });
};
