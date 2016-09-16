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


$mainDoc = getDoc("hi.dn.ua");
$newsHrefs[] = "";

foreach ($mainDoc->find(".gk_news_show_news_header a") as $news) {
    $newsHrefs[] = pq($news)->attr("href");
}

array_shift($newsHrefs);
array_unique($newsHrefs);
rsort($newsHrefs);

if ($_GET['GET'] == 'size') {

    echo sizeof($newsHrefs);
    exit();
}

foreach ($mainDoc->find(".gk_news_show_news_header a") as $news) {
    $newsHrefs[] = pq($news)->attr("href");
}

$someNewsURL = "hi.dn.ua" . $newsHrefs[$_GET['GET']];

$someNewsDoc = getDoc($someNewsURL);
$thisNews = pq($someNewsDoc->find(".module_content")->find("td #tops")->nextAll());

echo $thisNews->parents(".module_content")->find("h1")->removeAttr("style");

echo "<h6>".$someNewsDoc->find(".createdate")->text()."</h6>";
echo "<br>";

foreach ($thisNews->find("img") as $img) {
    $img = pq($img)->attr("src");

    if (strrpos(trim($img), 'mages') == 1) {
        echo "<img src='http://hi.dn.ua/" . $img . "'>";

    }
    else {

        echo "<img src=" . $img . ">";
    }
}

$thisNews->find("img")->remove();
$text = $thisNews;
echo "<p>".$text."</p>";







