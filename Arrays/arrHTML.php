<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Массивы</title>
    <link rel="stylesheet" href="arrCSS.css" type="text/css">
</head>

<body>
<!--                                                                                      Original Array-->
<table>
    <?php $lines = count($originalArray);
    $columns = count($originalArray[0]);

    if ($lines == 1) {
        echo "<h3>Исходный массив:</h3>";
        $max = maxOfArray($originalArray[0]);
        $min = minOfArray($originalArray[0]);
    } else {
        echo "<h3>Исходная матрица:</h3>";
        $max = maxOfArray(getSquareMatrixMainDiagonal($originalArray));
        $min = minOfArray(getSquareMatrixAntidiagonal($originalArray));
    }

    for ($i = 0; $i < $lines; $i++) { ?>
        <tr>
            <?php for ($j = 0; $j < $columns; $j++) {
                $tdClass = 'normalElement';

                if ($lines == 1) {
                    if ($originalArray[$i][$j] == $max)
                        $tdClass = 'maxElement';

                    if ($originalArray[$i][$j] == $min)
                        $tdClass = 'minElement';
                } else {
                    if ($i == $j) {
                        $tdClass = 'MainD';

                        if ($originalArray[$i][$j] == $max)
                            $tdClass = 'maxElement';
                    }
                    if ($i == $columns - $j - 1) {
                        $tdClass = 'AntiD';

                        if ($originalArray[$i][$j] == $min)
                            $tdClass = 'minElement';
                    }

                } ?>
                <td class='<?php echo $tdClass ?>'>
                    <?php echo $originalArray[$i][$j]; ?>
                </td>
            <?php } ?>
        </tr>
    <?php } ?>
</table>

<!--                                                                                            Min Max -->

<div class="result">
    <p class="minElement">
        <?php if ($lines == 1) { ?>
            Минимальный элемент массива:
        <?php } else { ?>
            Минимальный элемент побочной диагонали:
        <?php }
        echo $min ?>
    </p>

    <p class="maxElement">
        <?php if ($lines == 1) { ?>
            Максимальный элемент массива:
        <?php } else { ?>
            Максимальный элемент главной диагонали:
        <?php }
        echo $max ?>
    </p>
</div>

<!--                                                                                    Sorted Matrix -->

<table>
    <?php if ($lines == 1) {
        echo "<h3>Сортированный массив:</h3>";
    } else {
        echo "<h3>Матрица с сортированными строками:</h3>";
    }

    $tdClass = 'normalElement';

    for ($i = 0; $i < $lines; $i++) {

        $sortedLine = bubbleSort($originalArray[$i]); ?>

        <tr>
            <?php for ($j = 0; $j < $columns; $j++) {
                ?>
                <td class='<?php echo $tdClass ?>'>
                    <?php echo $sortedLine[$j]; ?>
                </td>
            <?php } ?>
        </tr>
    <?php } ?>
</table>

</body>
</html>