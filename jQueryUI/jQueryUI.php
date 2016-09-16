<?php
header('Content-Type: text/html; charset=utf-8');


    $citiesDirs = scandir("images/Cities", 1);
    array_pop($citiesDirs);
    array_pop($citiesDirs);

    foreach ($citiesDirs as $city) {

        $contentFile = "images/Cities/" . $city . "/city.txt";
        $content = file($contentFile);
        $imagesList = scandir('images/Cities/' . $city, 1);
        array_pop($imagesList);
        array_pop($imagesList);
        array_shift($imagesList);
        $imagesList=array_reverse($imagesList);
        $content[] = $imagesList;

        $allCities[$city] = $content;
    }

    $json = json_encode($allCities);
    echo $json;

