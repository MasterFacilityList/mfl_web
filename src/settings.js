(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "public@mfltest.slade360.co.ke",
            "password": "public",
            "client_id": "xMddOofHI0jOKboVxdoKAXWKpkEQAP0TuloGpfj5",
            "client_secret": "PHrUzCRFm9558DGa6Fh1hEvSCh3C9Lijfq8s" +
                             "bCMZhZqmANYV5ZP04mUXGJdsrZLXuZG4VCmv" +
                             "jShdKHwU6IRmPQld5LDzvJoguEP8AAXGJhrq" +
                             "fLnmtFXU3x2FO1nWLxUx",
            "token_url": "o/token/",
            "last_update": null,
            "db_name": "mflApp"
        }
    };

    setts.CREDZ.token_url = setts.SERVER_URL + setts.CREDZ.token_url;

    window.MFL_SETTINGS = setts;

})(window);
