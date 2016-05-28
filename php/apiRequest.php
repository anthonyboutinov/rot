<?php

class apiRequest extends apiBaseClass {

    //http://www.example.com/api/?apitest.APIWithParams={"codeType":"PHP or SQL","code":"Text of code"}
function APIWithParams($apiMethodParams) {
        $retJSON = $this->createDefaultJson();
        if (isset($apiMethodParams->codeType)&&isset($apiMethodParams->codeType)){
            if($apiMethodParams->codeType == 'PHP'){
                $result_of_eval = '';
                $result =urldecode($apiMethodParams->code);
                ob_start();
                    eval($result);
                    $result_of_eval = ob_get_contents();
                ob_end_clean();
                $retJSON->retParameter = $result_of_eval;
          } else if ($apiMethodParams->codeType == 'SQL') {
                $result_of_eval = $this->mySQLWorker->newSanitize($apiMethodParams->code);
                $retJSON->retParameter =urldecode($this->mySQLWorker->getQueryResultWithErrorNoticing($result_of_eval));
        }else {
            $retJSON->errorno =  APIConstants::$ERROR_ENGINE_PARAMS;
          }
        }else{
            $retJSON->errorno =  APIConstants::$ERROR_PARAMS;
        }
        return $retJSON;
    }


}

?>
