(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "username": "serikalikuu@mfltest.slade360.co.ke",
            "password": "serikalikuu",
            "client_id": "aQtG5rUJKF9GxWQWCuoZc6m5i581i5pCxOEIN7L4",
            "client_secret": "DZ4fCreUDhij74WdEV6RZ9qOi9O6UzWqYSB8TrmKixo" +
            "d3WWHMJ6EeVY1DktZVgnAon5Czc2h6Wg8kjce3DiegP3xTfdKh67t2jHHhPyV"+
            "815K8QjEm12R7xKEIaUcR7dB"
        }
    };

    setts.CREDZ.token_url = setts.SERVER_URL + "o/token/";

    window.MFL_SETTINGS = setts;

})(window);
