<?php
include 'DataBases/db_connect.php';

session_start();
$thisURL = "http://" . $_SERVER['SERVER_NAME'];

define("SALT", "Secret String");

function generateString($stringLength)
{
    $chars = "qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
    $charsNumber = strlen($chars) - 1;
    $result = null;
    while ($stringLength--) {
        $result .= $chars[rand(0, $charsNumber)];
    }
    return $result;
}


//                                                                                             Registration                                                                                        
if ($_GET['action'] == "reg") {
    $login = $_POST['login'];

    $query = mysql_query("SELECT COUNT(*) FROM user WHERE login='$login'") or exit(mysql_error());
    if (mysql_result($query, 0) != 0) {
        echo "Пользователь с таким логином уже существует в базе данных";

    } else {
        $password = $_POST['password'];
        $password = md5(SALT . $password);

        $verificationCode = generateString(255);
        $activation = $thisURL . $_SERVER['PHP_SELF'] . "?" . http_build_query(array('action' => 'activation',
                'login' => $login,
                'verificationCode' => $verificationCode));

        mail($login, "Ссылка активации на сайте: " . $thisURL, $activation);

        $query = mysql_query("INSERT INTO user VALUES  ('','$login','$password','0','$verificationCode')") or exit(mysql_error());
        echo "UserAdded";
    }
}
//                                                                                                Activation
if ($_GET['action'] == "activation") {
    header('Content-Type: text/html; charset=utf-8');
    $login = $_GET['login'];
    $verificationCode = $_GET['verificationCode'];

    $userData = mysql_fetch_array(mysql_query("SELECT * FROM user WHERE  login='$login'"));

    if ($userData['verification_code'] != $verificationCode) {
        echo "Данные для активации не верны";

    } else {
        $query = mysql_query("UPDATE user SET verified='1' WHERE login='$login'") or exit(mysql_error());
        echo "Активация " . $login . " успешно завершена <br>";
        echo "<a href='" . $thisURL . "'>Нажмите для продолжения</a>";
    }
}


//                                                                                                       Logon
if ($_GET['action'] == "enter") {

    $login = $_POST['login'];
    $password = $_POST['password'];
    $password = md5(SALT . $password);
    $query = mysql_query("SELECT * FROM user WHERE  login='$login'") or exit(mysql_error());
    $userData = mysql_fetch_array($query);

    if ($userData['password'] == $password) {

        if ($userData['verified'] == false) {
            echo "Пользователь не активирован";

        } else {
            echo "OK";
            $_SESSION['login'] = $login;
        }
    } else {
        echo "Wrong Login or Password";
    }
}

//                                                                                             Logon  Check
if ($_GET['action'] == "logonCheck") {
    echo $_SESSION['login'];
}

//                                                                                                   Logout
if ($_GET['action'] == "logout") {
    unset($_SESSION['login']);
    session_destroy();
}

//                                                                                      Send Password
if ($_GET['action'] == "sendPassword") {
    $login = $_POST['login'];
    $query = mysql_query("SELECT COUNT(*) FROM user WHERE login='$login'") or exit(mysql_error());

    if (mysql_result($query, 0) == 0) {
        echo "E-mail не зарегестрирован";

    } else {

        $password = generateString(12);
        mail($login, "Новый пароль", $password);
        $password = md5(SALT . $password);
        $query = mysql_query("UPDATE user SET password='$password' WHERE login='$login'") or exit(mysql_error());
        echo "PasswordSent";
    }
}