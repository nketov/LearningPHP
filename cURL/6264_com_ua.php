<?php
header('Content-Type: text/html; charset=utf-8');
require "phpQuery.php";


function getDoc($url)
{


    $uagent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0) Gecko/20100101 Firefox/48.0";

    $cURL = curl_init($url);
    curl_setopt($cURL, CURLOPT_USERAGENT, $uagent);
    curl_setopt($cURL, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($cURL, CURLOPT_HEADER, 0);
    curl_setopt($cURL, CURLOPT_CONNECTTIMEOUT, 120);
    curl_setopt($cURL, CURLOPT_TIMEOUT, 120);
    curl_setopt($cURL, CURLOPT_MAXREDIRS, 10);
    $content = curl_exec($cURL);
    curl_close($cURL);
    $doc = phpQuery::newDocument($content);
    return $doc;
}


$mainDoc = getDoc("www.6264.com.ua");

$newsHrefs[] = "";

foreach ($mainDoc->find(".item div p a") as $news) {
    $newsHrefs[] = pq($news)->attr("href");
}

array_shift($newsHrefs);


if ($_GET['GET'] == 'size') {
    echo sizeof($newsHrefs);
    exit();
}


$someNewsURL = "www.6264.com.ua" . $newsHrefs[$_GET['GET']];

$someNewsDoc = getDoc($someNewsURL);
$thisNews = pq($someNewsDoc->find(".open_news"));


echo "<h1>" . $thisNews->find(".text_header")->text() . "</h1>";

echo "<h6>" . $thisNews->find(".date span")->text() . "</h6>";


foreach ($thisNews->find(".inner-photo-block")->find("img") as $img) {
    echo "<img src=" . pq($img)->attr("src") . ">";
}

foreach ($thisNews->find(".static")->find("img") as $img) {
    echo "<img src=" . pq($img)->attr("src") . ">";
}

foreach ($thisNews->find("iframe") as $iframe) {
    echo pq($iframe);
}

$thisNews->find("img")->remove();
$thisNews->find("iframe")->remove();
echo $thisNews->find(".static");;










