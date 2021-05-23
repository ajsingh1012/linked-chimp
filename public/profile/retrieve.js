document.addEventListener('DOMContentLoaded', function() {
    params = getParams();
    userid = unescape(params["id"]);

    firebase.database().ref('users/' + userid).get().then((snapshot) => {
        if (snapshot.exists()) {
            var data = snapshot.val();
            document.querySelector('#username').innerHTML = '@' + data.username;
            document.querySelector('#profile-picture').src = data.profileURL;
            document.querySelector('#name').innerHTML = data.firstName + ' ' + data.lastName;
            document.querySelector('#city').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16"> \
                    <path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/> \
                    <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/> \
                </svg> ' + data.location;

            var msg = data.statement;
            msg = msg.replace(/\\/gi, '<br>');
            document.querySelector('#statement').innerHTML = msg;

            qrc = new QRCode(document.getElementById("qrcode"), {
                text: document.URL,
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            new ClipboardJS(document.getElementById('copy-btn'));
            document.getElementById('copy').value = document.URL;
        } else {
            console.log("No data available for current user");
        }
    }).catch((error) => {
        console.error(error);
    });
});

function getParams() {
    var idx = document.URL.indexOf('?');
    var params = {};
    if (idx != -1) {
        var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
        for (var i = 0; i < pairs.length; i++) {
            nameVal = pairs[i].split('=');
            params[nameVal[0]] = nameVal[1];
        }
    }
    return params;
}