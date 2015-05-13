"use strict";
/**
    Error logging service based on
    : http://engineering.talis.com/articles/client-side-error-logging/.
    Unhandled errors withing the angular app(exceptions, and httpErrors)
    will be handled and automatically be send to the server
    if the app has been configured to do so.

*/
(function(jQuery, angular, _){
    angular.module("sil.common.logging", [])

    /**
       Logging Config Provider - for configuring angular js app whether to send logs
       to the server or not.
    */
    .provider("loggingConfig", function(){
        var self = this;
        self.LOG_SERVER_URL = undefined;
        self.LOG_TO_SERVER = false;
        self.LOG_TO_CONSOLE = true;
        self.$get = [function(){
            return {
                LOG_SERVER_URL : self.LOG_SERVER_URL,
                LOG_TO_SERVER: self.LOG_TO_SERVER,
                LOG_TO_CONSOLE: self.LOG_TO_CONSOLE,
                canLogToServer: (function(){
                    return self.LOG_TO_SERVER && !_.isUndefined(self.LOG_SERVER_URL);
                })()
            };
        }];
    })
    /**
        Awrapper around stacktrace.js
        stracktrace.js a trace from an exception
    */
    .factory("traceService", function(){
        return {
            print: printStackTrace
        };
    })

    /**
        Helper functions for the lib
    */
    .service("helpers", ["$sce",function($sce){
        return {
            showError: function(message) {
                return {"error": $sce.trustAsHtml(message)};
            },
            ajax: function(method, url, data){
                // todo - add auth details if log server is secured
                 //Todo: weave in authentication, if the Log server is authenticated
                 return jQuery.ajax({
                    type: method,
                    url: url,
                    contentType: "application/json",
                    data: angular.toJson(data),
                    error: function(error){
                        throw new Error(error);
                    },
                    success: function(){
                        return;
                    }
                });

            }
        };
    }])
    /**
        Override angular js default exceptionHandler to use our default
        exceptionLoggingService
    */

    .provider("$exceptionHandler", {
        $get: function(exceptionLoggingService){
            return exceptionLoggingService;
        }
    })

    /**
        Exception Logging Service used by the exception handler.
        It by default logs to the error console and optionally sends the
        generated stacktrace to the server if told to.
    */
    .factory("exceptionLoggingService",["$log", "$window", "traceService",
              "loggingConfig","helpers",
              function($log, $window, traceService, loggingConfig, helpers){
                return function(exception, cause){
                    // log to the console
                    if(loggingConfig.LOG_TO_CONSOLE){
                        $log.error.apply($log, arguments);
                    }
                    //log to server if told to in config
                    if(loggingConfig.canLogToServer){
                        //try logging to the server
                        try{
                            var errorMsg = exception.toString();
                            //use traceService to generate stacktrace
                            var stackTrace = traceService.print({e: exception});
                            // use jquery"s ajax to POST exception to the server
                            helpers.ajax(
                                "POST",
                                 loggingConfig.LOG_SERVER_URL,
                                {
                                    url: $window.location.href,
                                    message:errorMsg,
                                    type: "exception",
                                    stackTrace: stackTrace,
                                    cause: cause || ""
                                }
                            );
                        }catch(loggingError){
                            $log.warn("Error server-side logging failed");
                            $log.log(loggingError);

                        }

                    }

                };
            }])
    /**
        App wide error logging service to a provide logging of error/debug statements with
        the option of sending them to the server.
        Just inject applicationLoggingService in any module that needs logging and call
        log() specifying error level and whether to send log to the server
    */
    .factory("applicationLoggingService",
             ["$log", "$window","loggingConfig", "helpers",
             function($log, $window, loggingConfig, helpers){
                return {
                    log: function(message, level, log_to_server){
                        //level can be error, warn, debug
                        //log to console
                        if(loggingConfig.LOG_TO_CONSOLE){
                            $log.error.apply($log, arguments);
                        }
                        if(log_to_server&&loggingConfig.canLogToServer){
                            // try logging to server
                            try{
                                helpers.ajax(
                                    "POST",
                                    loggingConfig.LOG_SERVER_URL,
                                    {
                                        url: $window.location.href,
                                        message: message,
                                        type: level
                                    }
                                );
                            }catch(loggingError){
                                $log.warn("Error server-side logging failed");
                                $log.log(loggingError);
                            }
                        }
                    }
                };
            }])
    .factory("silResponseErrorInterceptor", ["$q",
     "applicationLoggingService", "helpers",
             function($q,loggingService, helpers){
                return {
                    responseError: function(error){
                        var error_info = {
                                method: error.config.method,
                                url: error.config.url,
                                message:error.data,
                                status: error.status
                            };
                        var error_msg = "";
                        switch(error.status){
                            case 500:
                                loggingService.log(JSON.stringify(error_info),"critical", true);
                                error_msg = helpers.showError("Server error occured");
                                break;
                            case 503:
                                loggingService.log(JSON.stringify(error_info), "critical", true);
                                error_msg = helpers.showError("Service unavailable");
                                break;
                            case 504:
                                loggingService.log(JSON.stringify(error_info),"critical", true);
                                error_msg = helpers.showError("Timeout error");
                                break;
                            case 404:
                                loggingService.log(JSON.stringify(error_info), "critical", true);
                                error_msg = helpers.showError("Resource not found");
                                break;
                            case 401:
                                loggingService.log(JSON.stringify(error_info),"critical", true);
                                error_msg = helpers.showError(
                                    "You are not authorized to perfom the specified action");
                                break;
                            case 403:
                                loggingService.log( JSON.stringify(error_info),"critical", true);
                                error_msg = helpers.showError(
                                    "You are forbidden to perfom the specified action");
                                break;
                            case 400:
                                loggingService.log(JSON.stringify(error_info),
                                    "critical", true);
                                var parsedError = {};
                                var parseError = function(errorObj){
                                    if(_.isObject(errorObj)){
                                        var handleArrayErr = function(key, arrayErr){
                                            parsedError[key] = "";
                                            _.each(arrayErr, function(err){
                                                if(_.isObject(err)){
                                                    handleObjErr(err, key);
                                                }else{
                                                    parsedError[key] += "<li>"+err+"</li>";
                                                }
                                            });

                                        };
                                        var handleObjErr = function(objErr, errKey){
                                            _.each(_.keys(objErr), function(key){
                                                var errValue = objErr[key];
                                                if(_.isObject(errValue)){
                                                    if(_.isArray(errValue)){
                                                        var nK = errKey===""?key:errKey+" -> "+key;
                                                        handleArrayErr(nK, errValue);
                                                    }else{
                                                        handleObjErr(errValue, key);
                                                    }
                                                }else{
                                                    parsedError[key] = "<li>"+errValue+"</li>";
                                                }
                                            });
                                        };
                                        if(_.isArray(errorObj)){
                                            handleArrayErr("generalError", errorObj);
                                        }else{
                                            handleObjErr(errorObj, "");
                                        }
                                    }else{
                                        parsedError.plainError = errorObj;
                                    }
                                };
                                parseError(error_info.message);
                                var errorMsg = "<ul>";
                                _.each(_.keys(parsedError), function(errKey){
                                    switch(errKey){
                                        case "generalError":
                                            errorMsg += parsedError.generalError;
                                            break;
                                        case "plainError":
                                            errorMsg += "<li>"+parsedError.plainError+"</li>";
                                            break;
                                        case "non_field_errors":
                                            errorMsg += parsedError[errKey];
                                            break;
                                        case "__all__":
                                            errorMsg += parsedError[errKey];
                                            break;
                                        default:
                                            var k = errKey.replace("_", " ");
                                            if(!_.isEmpty(parsedError[errKey])){
                                                errorMsg +="<li>"+k+" : <ul>"+parsedError[errKey];
                                                errorMsg +="</ul></li>";
                                            }
                                            break;

                                    }
                                });
                                errorMsg += "</ul>";
                                 error_msg = helpers.showError(errorMsg);
                                break;
                            default:
                                loggingService.log(JSON.stringify(error_info),"critical", true);
                                error_msg = helpers.showError("An error occured");
                                break;
                        }
                        error.data = error_msg;
                        return $q.reject(error);
                    }
                };
            }])
        .config(["$httpProvider", function($httpProvider){
            $httpProvider.interceptors.push("silResponseErrorInterceptor");
        }])
    ;
})(jQuery, angular,_);
