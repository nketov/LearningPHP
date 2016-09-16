<?php
header('Content-Type: text/html; charset=utf-8');
$path = "Files_dir/" . $_POST['fileName'];

if ($_GET['button'] == 'create') {

    if (file_exists($path)) {
        echo 1;

    } else {
        $file = fopen($path, 'w');
        fputs($file, "Время создания файла: " . strftime('%c'));
        fclose($file);
        echo 0;
    }
}

if ($_GET['scan'] == '1') {
    $array = scandir("Files_dir", 1);
    array_pop($array);
    array_pop($array);
    $json = json_encode($array);
    echo $json;
}

if ($_GET['button'] == 'delete') {
        unlink($path);
}

if ($_GET['button'] == 'open') {
    $content=file_get_contents($path);
    echo $content;
}

if ($_GET['button'] == 'save') {
    $file = fopen($path, 'w');
    fputs($file, $_POST['content']);
    fclose($file);
}

