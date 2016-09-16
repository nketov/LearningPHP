<?php

function generateArray($minRandom, $maxRandom, $columns, $lines = 1)
{
    for ($i = 0; $i < $lines; $i++) {
        for ($j = 0; $j < $columns; $j++) {
            $gen_array[$i][$j] = rand($minRandom, $maxRandom);
        }
    }
    return $gen_array;
}

function getSquareMatrixMainDiagonal($matrix)
{
    $lines = count($matrix);
    $columns = count($matrix[0]);
    
    if ($lines != $columns) {
        echo("Это не квадратная матрица");
        exit();
    }
    
    for ($j = 0; $j < $columns; $j++) {
        $mainDiagonal[$j] = $matrix[$j][$j];
    }
        return $mainDiagonal;
    
}

function getSquareMatrixAntidiagonal($matrix)
{
    $lines = count($matrix);
    $columns = count($matrix[0]);

    if ($lines != $columns) {
        echo("Это не квадратная матрица");
        exit();
    }

    for ($j = 0; $j < $columns; $j++) {
        $antiDiagonal[$j] = $matrix[$j][$lines - 1 - $j];
    }
    return $antiDiagonal;
}

function maxOfArray($array)
{
    $max = $array[0];
    $length = count($array);

    for ($j = 0; $j <= $length; $j++) {
        if ($array[$j] > $max)
            $max = $array[$j];
    }
    return $max;
}

function minOfArray($array)
{
    $min = $array[0];
    $length = count($array);

    for ($j = 0; $j < $length; $j++) {
        if ($array[$j] < $min)
            $min = $array[$j];
    }
    return $min;
}

function swapElements($x, $y, &$array)
{
    $tmp = $array[$x];
    $array[$x] = $array[$y];
    $array[$y] = $tmp;
    return true;
}

function bubbleSort($array)
{
    $length = count($array);
    for ($j = 0; $j <= $length - 1; $j++) {

        $isSwapped = false;
        $i = 0;

        while ($i < $length - 1) {
            if ($array[$i] > $array[$i + 1]) {
                swapElements($i, $i + 1, $array);
                $isSwapped = true;
            }
            ++$i;
        }

        if (!$isSwapped)
            break;
    }

    return $array;
}

function selectionSort($array)
{
    $length = count($array);

    for ($min = 0; $min < $length - 1; $min++) {
        $least = $min;

        for ($j = $min + 1; $j < $length; $j++) {
            if ($array[$j] < $array[$least])
                $least = $j;
        }
        swapElements($min, $least, $array);
    }
    return $array;
}

function insertionSort($array)
{
    $length = count($array);
    for ($j = 1; $j < $length; $j++) {

        $key = $array[$j];
        $i = $j - 1;

        while (($i >= 0) and ($array[$i] > $key)) {
            $array[$i + 1] = $array[$i];
            $i = $i - 1;
            $array[$i + 1] = $key;
        }
    }
    return $array;
}
