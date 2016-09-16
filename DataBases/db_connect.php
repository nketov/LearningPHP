<?php
$connect = mysql_connect('localhost', 'root', '') or exit(mysql_error());
mysql_select_db('_base');
mysql_set_charset('utf8',$connect);
