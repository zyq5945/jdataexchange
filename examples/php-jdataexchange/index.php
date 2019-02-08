<?php

// PHP文件最好是无BOM的UTF8文件格式，否则可能出现乱码
$str = '
{
    "_csrf": "Tue, 05 Feb 2019 13:02:16 GMT",
    "note": "i am here!!",
    "name": "sdf",
    "password": "sdfsdf",
    "sex": "Female",
    "fruit": [
        "Apple",
        "Banana"
    ],
    "country": "中国",
    "sport": [
        "足球",
        "乒乓球"
    ]
}
';


$json = json_decode($str);
date_default_timezone_set('asia/hong_kong');
$json->_csrf = date("Y-m-d H:i:s");

$output = json_encode($json, JSON_UNESCAPED_UNICODE);

include_once('simple.html');
?>

