<?php

// PHP文件最好是无BOM的UTF8文件格式，否则可能出现乱码
$str = '
{
    "note": "123123",
    "_csrf": "",
    "name": "sfs中df",
    "password": "123aabbcc",
    "sex": {
        "v1": [
            "Male"
        ],
        "v0": [
            "Female"
        ]
    },
    "fruit": {
        "v1": ["Apple","Banana"],
        "v0": [ "Orange" ]
    },
    "country": {
        "v1": [
            "中国"
        ],
        "v0": [
            "",
            "美国"
        ]
    }
}
';


$json = json_decode($str);
date_default_timezone_set('asia/hong_kong');
$json->_csrf = date("Y-m-d H:i:s");

$output = json_encode($json, JSON_UNESCAPED_UNICODE);

include_once('simple.html');
?>

