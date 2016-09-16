<?php
header('Content-Type: text/html; charset=utf-8');
include 'arraysFunctions.php';

function renderPhpFile($filename, $vars = null)
{
    if (is_array($vars) && !empty($vars)) {
        extract($vars);
    }    
    ob_start();
    include $filename;
    return ob_get_clean();
}

function displayArray($originalArray)
{
    echo renderPhpFile('arrHTML.php', array('originalArray' => $originalArray));
}

$test_array = generateArray(1, 100, 10,10);
displayArray($test_array);