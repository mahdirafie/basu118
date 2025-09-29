const request = require('request');

const smsConfig = {
    username: 'miladloveboth',
    password: '0622176364Milad',
    baseUrl: 'http://smspanel.Trez.ir/SendMessageWithCode.ashx'
};

const sendSMS = (phone, message) => {
    return new Promise((resolve, reject) => {
        const formData = {
            UserName: smsConfig.username,
            Password: smsConfig.password,
            Mobile: phone,
            Message: message
        };

        request.post({
            url: smsConfig.baseUrl,
            form: formData
        }, (error, response, body) => {
            if (error) {
                console.error('SMS Request Error:', error);
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                console.error('SMS Response Error:', response.statusCode, body);
                reject(new Error(`SMS request failed with status ${response.statusCode}`));
                return;
            }

            resolve(body);
        });
    });
};

module.exports = {
    sendSMS,
    smsConfig
};