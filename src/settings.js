(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "serikalikuu@mfltest.slade360.co.ke",
            "password": "serikalikuu",
            "client_id": "GIRNlwTVZOxwjPPVT1vWF3cjt7bSIt7MtVFWqqQ3",
            "client_secret": "U8ZZjjbocuKMOfeY958n3wwe6mJhbOSVJArw0bYblz88H6IBTta"+
                "GUI0eTevCLwgBJiFMh3PwQYovpywaXNQB1Yo89BMGVy"+
                "8pMDHAiXkPYrAwecE4a6YnKtA014PI0R1o"
        }
    };

    setts.CREDZ.token_url = setts.SERVER_URL + "o/token/";

    window.MFL_SETTINGS = setts;

})(window);
