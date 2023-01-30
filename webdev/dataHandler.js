'use strict';

const handleData = function (url, callbackFunctionName, callbackErrorFunctionName = null, method = 'GET', body = null) {
    fetch(url, {
        method: method,
        body: body,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })
        .then(function (response) {
            if (!response.ok) {
                if (callbackErrorFunctionName) {
                    callbackErrorFunctionName(response);
                }
            } else {
                return response.json();
            }
        })
        .then(function (jsonObject) {
            if (jsonObject) {
                callbackFunctionName(jsonObject);
            }
        });
};