(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "national@mfltest.slade360.co.ke",
            "password": "national",
            "client_id": "xMddOofHI0jOKboVxdoKAXWKpkEQAP0TuloGpfj5",
            "client_secret": "PHrUzCRFm9558DGa6Fh1hEvSCh3C9Lijfq8s" +
                             "bCMZhZqmANYV5ZP04mUXGJdsrZLXuZG4VCmv" +
                             "jShdKHwU6IRmPQld5LDzvJoguEP8AAXGJhrq" +
                             "fLnmtFXU3x2FO1nWLxUx",
            "token_url": "o/token/"
        }
    };

    setts.CREDZ.token_url = setts.SERVER_URL + setts.CREDZ.token_url;

    window.MFL_SETTINGS = setts;

})(window);
