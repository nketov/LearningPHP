<?php
header('Content-Type: text/html; charset=utf-8');
session_start();

function mailWithFile($emailAddress, $subject, $text, $mailFile)
{
    $file = fopen($mailFile, "r");

    if (!$file) {
        print "Файл $mailFile не может быть прочитан";
        exit();
    }

    $file = fread($file, filesize($mailFile));

    $boundary = "--" . md5(uniqid(time()));
    $headers = "MIME-Version: 1.0\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\n";
    $multipart = "--$boundary\n";
    $kod = 'utf-8';
    $multipart .= "Content-Type: text/html; charset=$kod\n";
    $multipart .= "Content-Transfer-Encoding: Quot-Printed\n\n";
    $multipart .= "$text\n\n";

    $message_part = "--$boundary\n";
    $message_part .= "Content-Type: application/octet-stream\n";
    $message_part .= "Content-Transfer-Encoding: base64\n";
    $message_part .= "Content-Disposition: attachment; filename = \"" . $mailFile . "\"\n\n";
    $message_part .= chunk_split(base64_encode($file)) . "\n";
    $multipart .= $message_part . "--$boundary--\n";

    if (!mail($emailAddress, $subject, $multipart, $headers)) {
        echo "К сожалению, письмо не отправлено";
        exit();
    }
    return true;
}


if ($_GET['button'] == 'upload') {
    if (!empty($_FILES['userfile']['tmp_name'])) {

        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($_FILES['userfile']['name']);

        if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadFile)) {
            $_SESSION['uploadFile'] = $uploadFile;

        } else {
            echo "Ошибка загрузки файла!";
        }
    }
}

if ($_GET['button'] == 'clearUploaded') {
    session_destroy();
}


if ($_GET['button'] == 'mail') {
    $time = date("H:i:s");
    $text = "\r\nИмя: " . $_POST['firstName'] . "\r\nФамилия: " . $_POST['lastName'] . "\r\nПол: " . $_POST['sex'] . "\r\nДата рождения: " . $_POST['birthdate'] . "\r\nДополнительная информация:  " . $_POST['optionallyInformation'];

    if (empty($_SESSION['uploadFile'])) {

        if (mail($_POST['emailAddress'], "Анкета", $text)) {
            echo " Спасибо! Ваша анкета принята и успешно отправлена по адресу:  " . $_POST['emailAddress'] . " Время отправки: " . $time;

        } else {

            echo "Ошибка отправки без файла!";
        }

    } else
        if (mailWithFile($_POST['emailAddress'], "Анкета", $text, $_SESSION['uploadFile'])) {
            echo " Спасибо! Ваша анкета принята и успешно отправлена по адресу:  " . $_POST['emailAddress'] . " Время отправки: " . $time;
            session_destroy();

        } else {
            echo "Ошибка отправки с файлом!";
        }
}



