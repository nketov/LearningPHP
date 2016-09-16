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


$mainDoc = getDoc("http://www.kramatorsk.info/");

$newsHrefs[] = "";

foreach ($mainDoc->find(".news li a") as $news) {
    $newsHrefs[] = pq($news)->attr("href");
}
array_shift($newsHrefs);
array_unique($newsHrefs);

if ($_GET['GET'] == 'size') {
    echo sizeof($newsHrefs);
    exit();
}


$someNewsURL = "http://www.kramatorsk.info/" . $newsHrefs[$_GET['GET']];

$someNewsDoc = getDoc($someNewsURL);
$thisNews = pq($someNewsDoc->find(".news-view"));

echo $thisNews->find("h1");
$newsDate = $thisNews->find(".news_info")->text();
echo "<h6>" . substr($newsDate, 0, strrpos(trim($newsDate), " ")) . "</h6>";

foreach ($thisNews->find("img") as $img) {
    echo "<img src=http://www.kramatorsk.info/" . pq($img)->attr("src") . ">";
}

foreach ($thisNews->find("iframe") as $iframe) {
    echo pq($iframe);
}

$thisNews->find("a")->remove();
$thisNews->find("br")->remove();
$thisNews->find("iframe")->remove();


$HTMLText = pq($thisNews->children("div"));
$HTMLText->find("img")->remove();
echo "<p>" . $HTMLText . "</p>";














