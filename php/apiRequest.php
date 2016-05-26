<?php

class apiRequest extends apiBaseClass {

    //http://www.example.com/api/?apitest.helloAPIWithParams={"TestParamOne":"Text of first parameter"}
function APIWithParams($apiMethodParams) {
        $retJSON = $this->createDefaultJson();
        if (isset($apiMethodParams->code)){
            //Все ок параметры верные, их и вернем
            $result = quotemeta($apiMethodParams->code);
            $result = urldecode($result);
            $result = str_replace('echo', 'return', $result);
            $retJSON->retParameter=eval($result);
        }else{
            $retJSON->errorno=  APIConstants::$ERROR_PARAMS;
        }
        return $retJSON;
    }


}

?>
