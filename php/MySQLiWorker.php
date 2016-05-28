<?php
class MySQLiWorker {

    protected static $instance;  // object instance
    public $dbName;
    public $dbHost;
    public $dbUser;
    public $dbPassword;
    public $connectLink = null;

    //Чтобы нельзя было создать через вызов new MySQLiWorker
    private function __construct() { /* ... */
    }

    //Чтобы нельзя было создать через клонирование
    private function __clone() { /* ... */
    }

    //Чтобы нельзя было создать через unserialize
    private function __wakeup() { /* ... */
    }

    //Получаем объект синглтона
    public static function getInstance($dbName, $dbHost, $dbUser, $dbPassword) {
        if (is_null(self::$instance)) {
            self::$instance = new MySQLiWorker();
            self::$instance->dbName = $dbName;
            self::$instance->dbHost = $dbHost;
            self::$instance->dbUser = $dbUser;
            self::$instance->dbPassword = $dbPassword;
            self::$instance->openConnection();
        }
        return self::$instance;
    }

    //Определяем типы параметров запроса к базе и возвращаем строку для привязки через ->bind
    function prepareParams($params) {
        $retSTMTString = '';
        foreach ($params as $value) {
            if (is_int($value) || is_double($value)) {
                $retSTMTString.='d';
            }
            if (is_string($value)) {
                $retSTMTString.='s';
            }
        }
        return $retSTMTString;
    }

    //Соединяемся с базой
    public function openConnection() {
        if (is_null($this->connectLink)) {
            $this->connectLink = new mysqli($this->dbHost, $this->dbUser, $this->dbPassword, $this->dbName);
            $this->connectLink->query("SET NAMES utf8");
            if (mysqli_connect_errno()) {
                return "Подключение невозможно: %s\n".' '.mysqli_connect_error();
                $this->connectLink = null;
            } else {
                mysqli_report(MYSQLI_REPORT_ERROR);
            }
        }
        return $this->connectLink;
    }

    //Закрываем соединение с базой
    public function closeConnection() {
        if (!is_null($this->connectLink)) {
            $this->connectLink->close();
        }
    }

    //Преобразуем ответ в ассоциативный массив
    public function stmt_bind_assoc(&$stmt, &$out) {
        $data = mysqli_stmt_result_metadata($stmt);
        $fields = array();
        $out = array();
        $fields[0] = $stmt;
        $count = 1;
        $currentTable = '';
        while ($field = mysqli_fetch_field($data)) {
            if (strlen($currentTable) == 0) {
                $currentTable = $field->table;
            }
            $fields[$count] = &$out[$field->name];
            $count++;
        }
        call_user_func_array('mysqli_stmt_bind_result', $fields);
    }





            /// Обернуть данные в кавычки для использования в SQL запросах
        /**
         *
         *  @param string|number|null|array &$sql   Передаваемое значение
         *  @param bool $do_return                  Возвращать ли новое значение (true) или изменять саму переменную (false). Поведение по умолчанию: изменять саму переменную.
         *  @retval typeof($sql)                    Возаращаемое значение. По умолчанию, функция ничего не возвращает.
         */
        private function wrapSanitizedValue(&$sql, $do_return = false) {
            if ($sql == 'NULL' || $sql == 'null' || $sql == null) {
                if ($do_return == true) {
                    return "NULL";
                } else {
                    $sql = "NULL";
                }
            } else if (!is_numeric($sql)) {
                if ($do_return == true) {
                    return "'$sql'";
                } else {
                    $sql = "'$sql'";
                }
            }
        }
        
        /// Универсальная функция санитизации
        /**
         *  Если выставлена опция "оборачивать значения", то оборачивает
         *  значение в кавычки, если это строка (и она не "NULL").
         *  Если передается null, возаращается строка NULL. Если число, то оно
         *  не оборачивается кавычками. Если это массив из вышеперечисленного,
         *  делает это для каждого значения массива.
         *  
         *  @author Anthony Boutinov
         *  
         *  @param string|number|null|array &$sql   Значение для санитизации
         *  @param bool $do_return                  Возвращать ли новое значение (true) или изменять саму переменную (false). Поведение по умолчанию: изменять саму переменную.
         *  @param int $max_length                  Ограничение на длину значения. По умолчанию, 2048 символов.
         *  @retval typeof($sql)                    Возаращаемое значение. По умолчанию, функция ничего не возвращает.
         */
        private function innerSanitize(&$sql, $wrap_values, $do_return, $max_length = null) {
            
            if (!isset($wrap_values)) {
                $wrap_values = true;
            }
            if (!isset($do_return)) {
                $do_return = false;
            }
            if (!(isset($max_length))) {
                $max_length = 2048;
            }
            
            if (is_array($sql)) {
                if ($do_return == true) {
                    return 'DEBUG Error in DBInterface::innerSanitize(): $do_return == true не поддерживается для массивов!';
                }
                foreach ($sql as $key => $value) {
                    $val = $this->connectLink->real_escape_string($value);
                    if (strlen($val) > $max_length) {
                        return 'Warning: trying to sanitize data which is '.length($val).' characters long! Data truncated';
                        $val = substr($val, 0, $max_length);
                    }
                    $sql[$key] = $this->wrapSanitizedValue($val, true);
                }
            } else {
                if (strlen($sql) > $max_length) {
                       return 'Warning: trying to sanitize data which is '.length($val).' characters long! Data truncated';
                    $sql = substr($sql, 0, $max_length);
                }
                $sql = $this->connectLink->real_escape_string($sql);
                
                if ($wrap_values == true) {
                    return $this->wrapSanitizedValue($sql, $do_return);
                } else {
                    return $sql;
                }
            }
        }
        
        /// Версия санитизации данных без оборота в кавычки (обычная санитизация)
        /**
         *  
         *  @param string|number|null|array &$sql       Значение для санитизации
         *  @param int $max_length                      Ограничение на длину значения. По умолчанию, 2048 символов.
         *  @retval typeof($sql)                        Возаращаемое значение. По умолчанию, функция ничего не возвращает.
         */
        public function sanitize(&$sql, $max_length = null) {
           return $this->innerSanitize($sql, false, false, $max_length);
        }
        
        /// Санитизация данных с оборотом в кавычки (продвинутая, новая санитизация)
        /**
         *  
         *  @param string|number|null|array &$sql       Значение для санитизации
         *  @param int $max_length                      (Опционально) Ограничение на длину значения. По умолчанию, 2048 символов.
         *  @param bool $do_return                      (Опционально) Возвращать ли новое значение (true) или изменять саму переменную (false). Поведение по умолчанию: изменять саму переменную.
         *  @retval typeof($sql)                        Возаращаемое значение. По умолчанию, функция ничего не возвращает.
         */
        public function newSanitize(&$sql, $max_length = null, $do_return = false) {
            return $this->innerSanitize($sql, true, $do_return, $max_length);
        }

                /// Перевести результат запроса в массив
        /**
         *  @param mysqli_result $result        Резальтат запроса
         *  @retval array
         */
        public function toArray($result) {
            $out = array();
            $i = 0;
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $out[$i++] = $row;
                }
            }
            return $out;
        }

        /// Получить первую строку результата запроса (с уведомлением об ошибке, если возникает)
        /**
         *  
         *  @param string $sql                          SQL запрос строкой
         *  @param string|null $variableIdentifier      (Опционально) Название переменной, которую отображать в случае пустого ответа. По умолчанию, null
         *  @param bool $allowNullValue                 (Опционально) Позволять возвращать пустую выборку. По умолчанию, false, т.е. будет выдаваться ошибка при пустой выборке
         *  @retval array                               Массив из первой строки результата запроса
         */
        public function getQueryResultWithErrorNoticing($sql, $variableIdentifier = null, $allowNullValue = false) {
            $this->num_queries_performed++;
            $result = $this->connectLink->query($sql);
            if (!$result) {
                return 'Ошибка в SQL запросе: '.$this->connectLink->error.' '.$sql;
            }
            if ($result->num_rows > 0) {
                    return $this->toArray($result);
            } else {
                if (!$allowNullValue) {
                    if ($variableIdentifier == null) {
                        return "SQL запрос вернул 0 строк: $sql";
                    } else {
                        return "Переменная $variableIdentifier не существует";
                    }
                }
                return null;
            }
        }
        
        /// Преобразовать mysqli_result в ассоциативный массив, где ключи будут заданы по заданной колонке
        /**
         *  
         *  @param mysqli_result $query_result      Резальтат запроса
         *  @param string $key_name                 Название колонки, которую сделать ключевой
         *  @retval array
         */
        public function keyRowsByColumn($query_result, $key_name) {
            $out = array();
            if ($query_result->num_rows > 0) {
                while($row = $query_result->fetch_assoc()) {
                    $out[$row[$key_name]] = $row;
                }
            }
            return $out;
        }
        
        
        /// Получить количество совершенных SQL запросов к базе данных
        public function getNumQueriesPerformed() {
            return $this->num_queries_performed;
        }

}

?>
