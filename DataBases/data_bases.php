<?php
header('Content-Type: text/html; charset=utf-8');
include 'db_connect.php';

$selectBar = $_GET['selectBar'];
$table = $_GET['table'];
$panel = $_GET['panel'];
$update = $_POST['update'];
$create = $_POST['create'];
$delete = $_POST['deleting'];


if ($create) {
    for ($i = 0; $i < count($create); $i++) {

        $value = "'" . $create[$i + 1] . "'";
        if ($create[$i + 1] == '') {
            $value = 'NULL';
        }

        $columns .= $create[$i].", ";
        $values.=$value.", ";
        $i++;
    }

    $columns = preg_replace('/_name/', '_id', $columns);
    $columns = substr($columns, 0, strlen($columns) - 2);
    $values = substr($values, 0, strlen($values) - 2);
    $queryText = "INSERT INTO $table ($columns) VALUES ($values)";
   $query = mysql_query($queryText) or exit(mysql_error());
    exit();
}


if ($update) {
    for ($i = 0; $i < count($update); $i++) {

        $value = "'" . $update[$i + 1] . "'";
        if ($update[$i + 1] == '') {
            $value = 'NULL';
        }

        $columns .= $update[$i] . "=" . $value . ", ";

        $i++;
    }

    $columns = preg_replace('/_name/', '_id', $columns);
    $columns = substr($columns, 0, strlen($columns) - 2);
    $queryText = "UPDATE $table  SET $columns WHERE  id='$update[1]'";
    $query = mysql_query($queryText) or exit(mysql_error());
    $panel = 'view';
    $_GET['ID'] = $update[1];
}

if ($delete) {
    $queryText = "DELETE FROM " . $table .
                            " WHERE id=$delete";

    $query = mysql_query($queryText) or exit("0");
    echo "1";

    exit;
}


if ($table) switch ($table) {

    case "song":
        $queryText = "SELECT song.id AS id,   song.name,   album.name AS album_name,  genre.name AS genre_name
                                      FROM song
                                     JOIN album ON album.id=song.album_id 
                                     JOIN genre ON  genre.id=song.genre_id ";

        if ($_GET['artistFirstCharacterID']) {
            $artists = $_GET['artistFirstCharacterID'] . '%';
            $queryText = preg_replace('/AS genre_name/', 'AS genre_name , artist.name AS artist_name ', $queryText);
            $queryText .= " JOIN  artist ON artist.name LIKE '" . $artists . "' AND artist.id=album.artist_id";
        }

        $queryText .= " ORDER BY  date";

        break;

    case "album" :
        $queryText = "SELECT album.id AS id,  album.name AS name,  album.date, artist.name AS artist_name
                                  FROM album";

        if ($_GET['artistID']) {
            $artist = $_GET['artistID'];
            $queryText .= " WHERE  artist_id=" . $artist;
            $queryText = preg_replace('/album.date, artist.name AS artist_name/', 'album.date ', $queryText);

        } else if ($_GET['yearID']) {
            $year = $_GET['yearID'] + 1900;
            $queryText .= " JOIN artist  ON  YEAR(date) BETWEEN " . $year . " AND " . ($year + 9) . " AND artist.id=album.artist_id ";

        } else {
            $queryText .= " JOIN  artist  ON  artist.id=album.artist_id ";
        }

        $queryText .= " ORDER BY  date";

        break;

    case "artist" :
        $queryText = "SELECT * 
                                  FROM artist 
                                 ORDER BY  year";
        break;

    case "genre" :
        $queryText = "SELECT * 
                                 FROM genre ORDER BY  id";
        break;
}


if ($selectBar) switch ($selectBar) {

    case  'artist' :
    case  'artistFirstCharacter' :
        $queryText = "SELECT id,name
                                      FROM artist";
        break;

    case ('genre') :
        $queryText = "SELECT id,name
                                      FROM genre";
        break;

    case ('album') :
        $queryText = "SELECT id,name
                                      FROM album";
        break;
}


$query = mysql_query($queryText) or exit(mysql_error());;
$array = array();

while ($row = mysql_fetch_assoc($query)) {

    if (($table == "artist") || ($table == "album")) {
        correctRow($row, $table);
    }
    $array[] = $row;
}

$array[] = $queryText;

if ($panel == 'view') {
    $queryText = preg_replace("/ORDER BY.*/", "  WHERE " . $table . ".id=" . $_GET['ID'], $queryText);
    $query = mysql_query($queryText) or exit(mysql_error());
    unset($array);
    $array[] = mysql_fetch_assoc($query);

    if (($table == "artist") || ($table == "album")) {
        correctRow($array[0], $table);
    }
}

$json = json_encode($array);

echo $json;


//_______________________________________________________


function correctRow(&$row, $table)
{
    if ($table == "artist") {

        if (is_null($row['sex'])) {
            $row['sex'] = "Коллектив";
            $row['age'] = "Коллектив";

        } else {
            if ($row['sex'] == 1) {
                $row['sex'] = "Мужской";
            } else {
                $row['sex'] = "Женский";
            }
            if (is_null($row['age'])) {
                $row['age'] = "R.I.P.";
            }
        }
    }
    if ($table == "album") {
        $row['date'] = date("d M Y", strtotime($row['date']));
    }
    return true;
}