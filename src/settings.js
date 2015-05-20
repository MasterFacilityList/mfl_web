(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "",
            "password": "",
            "client_id": ""
        }
    };

    setts.CREDZ.token_url = setts.SERVER_URL + "o/token/";

    window.MFL_SETTINGS = setts;

})(window);
