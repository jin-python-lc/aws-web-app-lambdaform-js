var AWS = require('aws-sdk');
var ses = new AWS.SES();

//宛先のメールアドレス
var RECEIVER = "***********";

//送信先のメールアドレス
//送信先のメールはAWSに認証登録する必要あり
var SENDER = "***********";

//クライアントへのレスポンスヘッダー
var response = {
    "isBase64Encoded": false,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
        "Access-Control-Allow-Origin": "*",
    },
    "statusCode": 200,
    "body": {"result": "テスト成功です!"}
};

exports.handler = function(event, context, callback) {
    console.log("受理したイベント:", event);
    sendEmail(event, function(err, data) {
        context.done(err, null);
    });
    callback(null, response);
};

//メール送信処理(eventにAPIからのデータが格納されている)
function sendEmail(event, done) {
    var b = JSON.parse(event.body);
    var body = JSON.stringify(b);
    var params = {
        Destination: {
            ToAddresses: [
                RECEIVER
            ]
        },
        Message: {
            Body: {
                Text: {
                    Data: `${body}`
                }
            },
            Subject: {
                Data: "連絡フォームが来ました！",
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    };
    ses.sendEmail(params, done);
    console.log(params);
    return {
        response,
        body: JSON.stringify(params),
        statusCode: 200
    }
}