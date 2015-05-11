"use strict";

angular.module("mfl.settings", ["sil.api.wrapper"])

    .constant("SERVER_URL", "http://localhost:8061/")
    .config(["SERVER_URL", "apiConfigProvider",
        function(SERVER_URL, apiConfig){
            apiConfig.SERVER_URL = SERVER_URL;
        }
    ]);
