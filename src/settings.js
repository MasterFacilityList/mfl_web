(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "serikalikuu@mfltest.slade360.co.ke",
            "password": "serikalikuu",
            "client_id": "LzstVEhMcbDpiMovhRb1TjWCMMBDyeiKoqNlqHcO",
            "client_secret": "0ET4Bj1VMjNcYxgrpZIvIaLOmNsF7C7B0j1SOZVhbu9Qnru0kbZob1y3zOAKiFxw2LX"+
                            "4PeVvz38w2wRdMw5FKA0DyUJWC4SYADZMTYmytCECbup5wYIdZbwHm332WeYT"
        }
    };
    
    setts.CREDZ.token_url = setts.SERVER_URL + "o/token/";

    window.MFL_SETTINGS = setts;

})(window);
