(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "serikalikuu@mfltest.slade360.co.ke",
            "password": "serikalikuu",
            /*"client_id": "89a15KxjyUktjGWyhCv8j8hHFZM6tWxvBczD9hNa",
            "client_secret": "GgP1uuFAgPsTu6nMmxNTbiZWynHhRrhrLo535plh" +
                             "TVWRWtRC51hvujbP9F9HX9I0s3td2JpPPiC3DmkQ" +
                             "K0bmqjstoUtP71VvGvuKQDHnFLP4apE4mGnrDrXe" +
                             "BN7tNDwQ"*/
            "client_id": "w3xpORZhHG4RdjTXdZWOi2Zg3LBxiZfGMpaJEkPF",
            "client_secret": "VEDhTr6CFEPOajWLxRYQBp8oK0c6tBpOu2Jm8Wp79e" +
            "NHTFu5R0l5NBNnBuxgMuVf5TTY3EEPgAiXpITkqjW3NfF7ZkA7zSl97vSe4dn" +
            "A9m5e27mqoaVNKod8vjHT1rwk"
        }
    };

    setts.CREDZ.token_url = setts.SERVER_URL + "o/token/";

    window.MFL_SETTINGS = setts;

})(window);
